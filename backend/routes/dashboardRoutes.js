const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');

// Add auth middleware here in the future if needed
router.get('/stats', getStats);

module.exports = router;
