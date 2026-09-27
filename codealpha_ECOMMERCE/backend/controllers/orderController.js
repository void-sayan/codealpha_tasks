const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

async function create(req, res) {
  const { items, shippingAddress: submittedAddress } = req.body;
  const shippingAddress = submittedAddress && {
    ...submittedAddress,
    line1: submittedAddress.line1 || submittedAddress.address,
    country: submittedAddress.country || 'United States'
  };
  if (!Array.isArray(items) || items.length === 0 || !shippingAddress) return res.status(400).json({ message: 'Items and shipping address are required' });
  const ids = items.map(item => item.product);
  if (ids.some(id => !mongoose.isValidObjectId(id))) return res.status(400).json({ message: 'Invalid product id' });
  const products = await Product.find({ _id: { $in: ids }, active: true });
  const byId = new Map(products.map(product => [String(product._id), product]));
  const orderItems = [];
  let total = 0;
  for (const item of items) {
    const product = byId.get(String(item.product));
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) return res.status(400).json({ message: 'Invalid product or quantity' });
    if (product.stock < quantity) return res.status(409).json({ message: `${product.name} is out of stock` });
    orderItems.push({ product: product._id, name: product.name, price: product.price, quantity });
    total += product.price * quantity;
  }
  const order = await Order.create({ user: req.user._id, items: orderItems, shippingAddress, total: Math.round(total * 100) / 100 });
  await Promise.all(orderItems.map(item => Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })));
  res.status(201).json({ order });
}

async function mine(req, res) {
  res.json({ orders: await Order.find({ user: req.user._id }).sort({ createdAt: -1 }) });
}

async function getById(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
}

async function all(req, res) {
  res.json({ orders: await Order.find().populate('user', 'name email').sort({ createdAt: -1 }) });
}

async function updateStatus(req, res) {
  const allowed = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order });
}

module.exports = { create, mine, getById, all, updateStatus };
