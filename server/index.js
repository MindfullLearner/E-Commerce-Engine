require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // lets us read JSON data sent from the frontend

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

const checkoutRoutes = require('./routes/checkout');
app.use('/api/checkout', checkoutRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);
app.use('/images', express.static('public/images'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    console.log('Connected to database:', mongoose.connection.name);
  })
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
