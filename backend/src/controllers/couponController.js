const store = require('../db/store');

exports.validateCoupon = (req, res) => {
  const { code, subtotal } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Please provide a promo code' });
  }

  const coupon = store.findCouponByCode(code);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
  }

  const orderSubtotal = parseFloat(subtotal) || 0;
  if (orderSubtotal < coupon.minOrderAmount) {
    return res.status(400).json({
      success: false,
      message: `Coupon requires a minimum order subtotal of $${coupon.minOrderAmount.toFixed(2)}`
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderSubtotal * coupon.discountValue) / 100;
  } else if (coupon.discountType === 'fixed') {
    discountAmount = Math.min(orderSubtotal, coupon.discountValue);
  }

  discountAmount = parseFloat(discountAmount.toFixed(2));

  res.json({
    success: true,
    message: `Coupon '${coupon.code}' applied successfully!`,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      description: coupon.description
    }
  });
};
