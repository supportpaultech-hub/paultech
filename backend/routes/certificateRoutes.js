const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

// Public route for Certificate Verification
router.get('/verify/:certNo', certificateController.verifyCertificate);

// Admin routes
router.get('/all', certificateController.getAllCertificates);
router.post('/', certificateController.createCertificate);
router.post('/bulk-upload', certificateController.bulkUploadCertificates);
router.post('/sync-students', certificateController.syncFromStudents);
router.delete('/:id', certificateController.deleteCertificate);

module.exports = router;
