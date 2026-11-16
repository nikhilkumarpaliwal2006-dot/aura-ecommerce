const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  selectedColor: { type: String, default: null },
  selectedSize: { type: String, default: null }
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  shippingAddress: {
    fullName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  appliedCoupon: { type: String, default: null },
  shippingFee: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  deliverySpeed: { type: String, default: 'Standard Ground (3-5 Days)' },
  paymentMethod: { type: String, default: 'Simulated Credit Card' },
  trackingNumber: { type: String, required: true },
  estimatedDelivery: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
