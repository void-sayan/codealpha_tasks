const Product = require('../models/Product');

async function list(req, res) {
  const { search, category, page = 1, limit = 20 } = req.query;
  const size = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const current = Math.max(Number(page) || 1, 1);
  const query = { active: true };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };
  const [items, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip((current - 1) * size).limit(size),
    Product.countDocuments(query)
  ]);
  res.json({ products: items, items, page: current, pages: Math.ceil(total / size), total });
}

async function getById(req, res) {
  const product = await Product.findOne({ _id: req.params.id, active: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
}

async function create(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
}

async function update(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
}

async function remove(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product removed' });
}

module.exports = { list, getById, create, update, remove };
