const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, enquiryController.getAllEnquiries);
router.post('/', authenticateToken, enquiryController.addEnquiry);
router.put('/:id', authenticateToken, enquiryController.updateEnquiry);
router.delete('/:id', authenticateToken, enquiryController.deleteEnquiry);

module.exports = router;
