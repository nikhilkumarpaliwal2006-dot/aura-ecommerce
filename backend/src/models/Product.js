const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 20 },
  featured: { type: Boolean, default: false },
  badge: { type: String, default: 'New' },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  features: [{ type: String }],
  colors: [{ type: String }],
  sizes: [{ type: String }],
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
