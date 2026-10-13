const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/today/:employeeEmail', attendanceController.getTodayAttendance);
router.get('/employee-history/:employeeEmail', attendanceController.getEmployeeAttendanceHistory);
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.put('/admin-checkout/:id', attendanceController.adminCheckOut);
router.delete('/clear-all/all', attendanceController.clearAllAttendance);
router.delete('/:id', attendanceController.deleteAttendance);
router.get('/all', attendanceController.getAllAttendance);

module.exports = router;
