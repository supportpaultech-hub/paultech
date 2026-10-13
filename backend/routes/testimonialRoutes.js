const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, deleteTestimonial } = require('../controllers/testimonialController');

router.get('/', getTestimonials);
router.post('/', createTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;
