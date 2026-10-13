const Testimonial = require('../models/Testimonial');

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { clientName, clientRole, review, rating } = req.body;
    
    if (!clientName || !clientRole || !review || !rating) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newTestimonial = new Testimonial({
      clientName,
      clientRole,
      review,
      rating
    });

    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};

module.exports = { getTestimonials, createTestimonial, deleteTestimonial };
