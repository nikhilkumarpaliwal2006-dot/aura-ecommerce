const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'aura_super_secure_jwt_secret_key_2026',
  JWT_EXPIRES_IN: '7d',
  DATA_DIR: path.join(__dirname, '../../data'),
  DB_FILE: path.join(__dirname, '../../data/store.json')
};
