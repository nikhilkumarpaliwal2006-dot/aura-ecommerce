const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
