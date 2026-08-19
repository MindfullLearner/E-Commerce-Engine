require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones',
    price: 59.99,
    stock: 15,
    image: 'http://localhost:5000/images/headphones.jpg',
    category: 'Audio',
  },
  {
    name: 'Desk Speakers',
    description: 'Compact stereo speakers with deep bass',
    price: 44.99,
    stock: 10,
    image: 'http://localhost:5000/images/speakers.jpg',
    category: 'Audio',
  },
  {
    name: 'USB Microphone',
    description: 'Studio-quality mic for streaming and calls',
    price: 69.99,
    stock: 6,
    image: 'http://localhost:5000/images/microphone.jpg',
    category: 'Audio',
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard',
    price: 89.99,
    stock: 8,
    image: 'http://localhost:5000/images/keyboard.jpg',
    category: 'Keyboards',
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic mouse with silent clicks',
    price: 29.99,
    stock: 25,
    image: 'http://localhost:5000/images/mouse.jpg',
    category: 'Keyboards',
  },
  {
    name: 'Mouse Pad',
    description: 'Extended desk mat with stitched edges',
    price: 14.99,
    stock: 30,
    image: 'http://localhost:5000/images/mousepad.jpg',
    category: 'Keyboards',
  },
  {
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub adapter',
    price: 24.99,
    stock: 20,
    image: 'http://localhost:5000/images/usbhub.jpg',
    category: 'Accessories',
  },
  {
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop riser',
    price: 34.99,
    stock: 12,
    image: 'http://localhost:5000/images/laptopstand.jpg',
    category: 'Accessories',
  },
  {
    name: 'Webcam',
    description: '1080p webcam with built-in mic',
    price: 39.99,
    stock: 9,
    image: 'http://localhost:5000/images/webcam.jpg',
    category: 'Accessories',
  },
  {
    name: 'Portable SSD',
    description: '1TB external SSD, USB-C, 1050MB/s',
    price: 99.99,
    stock: 7,
    image: 'http://localhost:5000/images/ssd.jpg',
    category: 'Storage',
  },
  {
    name: '4K Monitor',
    description: '27" 4K IPS monitor for coding and design',
    price: 279.99,
    stock: 4,
    image: 'http://localhost:5000/images/monitor.jpg',
    category: 'Storage',
  },
  {
    name: 'Cable Organizer',
    description: 'Under-desk cable management tray',
    price: 12.99,
    stock: 40,
    image: 'http://localhost:5000/images/cableorganizer.jpg',
    category: 'Storage',
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to:', mongoose.connection.name);
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Products seeded successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed script error:', err);
    process.exit(1);
  });