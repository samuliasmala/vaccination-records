const express = require('express');

let router = express.Router();

let userRoutes = require('./user');

// Add all routes
router.use('/user', userRoutes);

module.exports = router;
