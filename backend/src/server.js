const express = require('express');
const cors = require('cors');
const config = require('./config');
const store = require('./db/store');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to Aura Store API Server',
    version: '1.0.0',
    database: store.isMongoConnected
      ? 'MongoDB Atlas (Connected)'
      : config.MONGODB_URI
        ? 'MongoDB Atlas (Failed to connect - check credentials/IP whitelist)'
        : 'Local Persistent File Store (store.json)',
    mongoConnected: store.isMongoConnected,
    mongoError: store.mongoError || null,
    endpoints: {
      health: '/api/v1/health',
      products: '/api/v1/products',
      orders: '/api/v1/orders'
    }
  });
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'Aura Store API',
    version: '1.0.0',
    database: store.isMongoConnected
      ? 'MongoDB Atlas (Connected)'
      : config.MONGODB_URI
        ? 'MongoDB Atlas (Failed to connect - check credentials/IP whitelist)'
        : 'Local Persistent File Store (store.json)',
    mongoConnected: store.isMongoConnected,
    mongoError: store.mongoError || null,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 Route
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(config.PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Aura Store Backend running on http://localhost:${config.PORT}`);
  console.log(`📊 Health check: http://localhost:${config.PORT}/api/v1/health`);
  console.log(`🛍️ Products API: http://localhost:${config.PORT}/api/v1/products`);
  console.log(`===============================================`);
});

module.exports = app;
