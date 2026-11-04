const store = require('../db/store');

exports.getAnalytics = (req, res) => {
  try {
    const stats = store.getAnalytics();
    res.json({
      success: true,
      analytics: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate store analytics' });
  }
};
