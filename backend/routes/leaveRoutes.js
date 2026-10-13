const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

// Employee routes
router.post('/apply', leaveController.applyLeave);
router.get('/my/:employeeEmail', leaveController.getMyLeaves);

// Admin & General routes
router.get('/all', leaveController.getAllLeaves);
router.get('/stats', leaveController.getLeaveStats);
router.put('/:id/status', leaveController.updateLeaveStatus);
router.delete('/:id', leaveController.deleteLeave);

module.exports = router;
