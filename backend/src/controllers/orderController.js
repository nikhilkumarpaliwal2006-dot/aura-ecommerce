const store = require('../db/store');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode, paymentMethod, deliverySpeed } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: 'Incomplete shipping address' });
    }

    // Verify stock and calculate subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = store.findProductById(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.title || item.productId} no longer exists` });
      }

      const qty = parseInt(item.quantity, 10) || 1;
      if (product.stockQuantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Only ${product.stockQuantity} remaining.`
        });
      }

      subtotal += product.price * qty;
      validatedItems.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: qty,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null
      });
    }

    // Coupon discount calculation
    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = store.findCouponByCode(couponCode);
      if (coupon && subtotal >= coupon.minOrderAmount) {
        appliedCoupon = coupon.code;
        if (coupon.discountType === 'percentage') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
        } else {
          discountAmount = Math.min(subtotal, coupon.discountValue);
        }
      }
    }

    // Shipping fee: Free if subtotal >= 2499 or standard delivery, ₹499 for Express
    const isExpress = deliverySpeed === 'express';
    const shippingFee = isExpress ? 499.00 : (subtotal >= 2499 ? 0.00 : 199.00);

    // Estimated Tax / GST (approx 5%)
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = parseFloat((taxableAmount * 0.05).toFixed(2));

    const totalAmount = parseFloat((taxableAmount + shippingFee + taxAmount).toFixed(2));

    // Determine customer info
    const userId = req.user ? req.user.id : null;
    const customerName = shippingAddress.fullName;
    const customerEmail = req.user ? req.user.email : (shippingAddress.email || 'guest@nikkaura.com');

    const newOrder = store.createOrder({
      userId,
      customerName,
      customerEmail,
      shippingAddress,
      items: validatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      appliedCoupon,
      shippingFee,
      taxAmount,
      totalAmount,
      deliverySpeed: isExpress ? 'Express Air Priority (1-2 Days)' : 'Standard Ground Delivery (3-5 Days)',
      paymentMethod: paymentMethod || 'UPI / Credit Card (Simulated)',
      estimatedDelivery: new Date(Date.now() + (isExpress ? 2 : 5) * 86400000).toISOString().split('T')[0]
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Tracking code generated.',
      order: newOrder
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ success: false, message: 'Server error processing order' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = store.findOrdersByUserId(req.user.id);
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = store.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Security check: non-admin can only view their own orders
    if (req.user && req.user.role !== 'admin' && order.userId && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
};

// Admin Endpoints
exports.getAllOrders = async (req, res) => {
  try {
    const orders = store.getOrders();
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch store orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ success: false, message: `Invalid status. Valid options: ${validStatuses.join(', ')}` });
    }

    const updated = store.updateOrderStatus(req.params.id, status.toLowerCase());
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to '${status}'`,
      order: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};
