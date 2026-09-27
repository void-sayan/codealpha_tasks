const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  price: { type: Number, required: true, min: 0, set: value => Math.round(value * 100) / 100 },
  image: { type: String, trim: true, default: '' },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ category: 1, active: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
