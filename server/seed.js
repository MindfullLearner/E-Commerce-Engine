require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones',
    price: 59.99,
    stock: 15,
    image: 'https://via.placeholder.com/200',
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard',
    price: 89.99,
    stock: 8,
    image: 'https://via.placeholder.com/200',
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub adapter',
    price: 24.99,
    stock: 20,
    image: 'https://via.placeholder.com/200',
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Products seeded successfully');
    mongoose.connection.close();
  })
  .catch((err) => console.log(err));
