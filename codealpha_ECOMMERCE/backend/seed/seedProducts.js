require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

async function seed() {
  await connectDB();
  let admin = await User.findOne({ email: 'admin@example.com' });
  if (!admin) admin = new User({ email: 'admin@example.com' });
  admin.name = 'Store Admin';
  admin.password = 'Admin123!';
  admin.role = 'admin';
  await admin.save();
  await Product.deleteMany({});
  await Product.insertMany([
    { name: 'Classic Sneakers', description: 'Comfortable everyday sneakers.', price: 79.99, category: 'Footwear', stock: 25, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
    { name: 'Canvas Backpack', description: 'Durable backpack for work and travel.', price: 49.5, category: 'Accessories', stock: 40, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
    { name: 'Wireless Headphones', description: 'Noise-reducing wireless headphones.', price: 129, category: 'Electronics', stock: 15, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' }
  ]);
  console.log('Database seeded. Admin: admin@example.com / Admin123!');
}

seed().then(disconnectDB).catch(error => { console.error(error); disconnectDB().finally(() => process.exit(1)); });
