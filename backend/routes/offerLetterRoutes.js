const express = require('express');
const router = express.Router();
const offerLetterController = require('../controllers/offerLetterController');

// 1. Get available domains
router.get('/domains', offerLetterController.getDomains);

// 2. Get blank template HTML
router.get('/blank', offerLetterController.getBlankTemplate);

// 3. Render custom offer letter HTML
router.post('/render', offerLetterController.renderOfferLetter);

// 4. Render for specific student
router.get('/student/:id', offerLetterController.getStudentOfferLetter);

// 5. Render for specific job application
router.get('/application/:id', offerLetterController.getApplicationOfferLetter);

module.exports = router;
