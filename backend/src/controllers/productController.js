const store = require('../db/store');

exports.getProducts = async (req, res) => {
  try {
    let products = store.getProducts();
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStockOnly,
      sort,
      featured
    } = req.query;

    // Search query filter
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Price range filter
    if (minPrice !== undefined && minPrice !== '') {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Rating filter
    if (minRating !== undefined && minRating !== '') {
      products = products.filter(p => p.rating >= parseFloat(minRating));
    }

    // In-stock only
    if (inStockOnly === 'true') {
      products = products.filter(p => p.inStock && p.stockQuantity > 0);
    }

    // Featured filter
    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'featured':
      default:
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    // Extract all unique categories
    const allProducts = store.getProducts();
    const categories = ['All', ...new Set(allProducts.map(p => p.category))];

    res.json({
      success: true,
      count: products.length,
      categories,
      products
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = store.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Review comment must be at least 5 characters' });
    }

    const userName = req.user ? req.user.name : (req.body.userName || 'Verified Buyer');
    const review = store.addReview(productId, {
      userName,
      rating: Number(rating),
      comment: comment.trim()
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add review' });
  }
};

// Admin Endpoints
exports.createProduct = async (req, res) => {
  try {
    const { title, category, price, stockQuantity, shortDescription, description, image, badge } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ success: false, message: 'Title, category, and price are required' });
    }

    const newProduct = store.createProduct({
      title: title.trim(),
      category: category.trim(),
      price: parseFloat(price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      stockQuantity: parseInt(stockQuantity, 10) || 10,
      inStock: (parseInt(stockQuantity, 10) || 10) > 0,
      shortDescription: shortDescription || '',
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      badge: badge || 'New',
      colors: req.body.colors || ['Default'],
      features: req.body.features || []
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = store.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const success = store.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};
