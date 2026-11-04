const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, optionalAuth, requireAdmin } = require('../middleware/auth');

// Public catalog
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Reviews
router.post('/:id/reviews', optionalAuth, productController.addReview);

// Admin product management
router.post('/', authenticateToken, requireAdmin, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router;
