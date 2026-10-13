const express = require('express');
const router = express.Router();
const broadcastController = require('../controllers/broadcastController');

router.get('/', broadcastController.getBroadcast);
router.put('/', broadcastController.updateBroadcast);

module.exports = router;
