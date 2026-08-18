const express = require('express');
const Stripe = require('stripe');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    // Get the user's cart, with full product details
    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate the total price (server-side, never trust frontend for this)
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId; // populated, so this is the full product doc

      if (!product) {
        return res.status(400).json({ message: 'A product in your cart no longer exists' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      totalAmount += product.price * item.quantity;
    }

    // Stripe requires the amount in the smallest currency unit (cents for USD)
    const amountInCents = Math.round(totalAmount * 100);

    // Create the Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        userId: req.userId.toString(),
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// CONFIRM payment succeeded, then update inventory
router.post('/confirm', authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment Intent ID is required' });
    }

    // Ask Stripe directly — don't trust the frontend's claim
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Extra safety: make sure this payment belongs to the logged-in user
    if (paymentIntent.metadata.userId !== req.userId.toString()) {
      return res.status(403).json({ message: 'This payment does not belong to you' });
    }

    // Get the user's cart with full product details
    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is already empty' });
    }

    // Reduce stock for each product
    for (const item of cart.items) {
      const product = item.productId;
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear the cart after successful checkout
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Payment confirmed, inventory updated, cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
