const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const orderController = require('../controllers/orderController');
const analyticsController = require('../controllers/analyticsController');

// All routes here require Admin authentication
router.use(authenticateToken, requireAdmin);

router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:id/status', orderController.updateOrderStatus);
router.get('/analytics', analyticsController.getAnalytics);

module.exports = router;
