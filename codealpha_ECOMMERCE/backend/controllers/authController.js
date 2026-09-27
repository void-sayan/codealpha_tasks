const jwt = require('jsonwebtoken');
const User = require('../models/User');

function tokenFor(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ user, token: tokenFor(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ user, token: tokenFor(user) });
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };
