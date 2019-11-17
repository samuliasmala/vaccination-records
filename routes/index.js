const express = require('express');
const cors = require('cors');

let router = express.Router();
const log = require('../utils/logger');

let authRoutes = require('./auth');
let userRoutes = require('./user');

// Log all API calls
// Currently handled by Morgan
/*router.use('*', (req, _, next) => {
  log.http(`Call to API: ${req.originalUrl}`);
  next();
});*/

// Add cors for localhost addresses
const corsOptions = {
  origin: [/https?:\/\/localhost(:\d{2,5})?$/],
  credentials: true
};
router.use(cors(corsOptions));

// Add all routes
router.use('/', authRoutes);
router.use('/user', userRoutes);

module.exports = router;
