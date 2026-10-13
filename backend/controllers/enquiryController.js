const Enquiry = require('../models/Enquiry');

// Get all enquiries (Admin & Developer)
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ enquiry_date: -1 });
    res.json(enquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new enquiry (Admin & Developer)
const addEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json(enquiry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an enquiry (Admin only)
const updateEnquiry = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can update enquiries' });
  }
  
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(enquiry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete an enquiry (Admin only)
const deleteEnquiry = async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can delete enquiries' });
  }
  
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllEnquiries,
  addEnquiry,
  updateEnquiry,
  deleteEnquiry
};
