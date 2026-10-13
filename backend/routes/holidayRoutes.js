const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');

router.post('/', holidayController.addHoliday);
router.get('/', holidayController.getAllHolidays);
router.delete('/:id', holidayController.deleteHoliday);

module.exports = router;
