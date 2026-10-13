const Holiday = require('../models/Holiday');

// Add a new Holiday (Admin)
exports.addHoliday = async (req, res) => {
  try {
    const { title, startDate, endDate, description, type } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: 'Title, Start Date, and End Date are required.' });
    }

    const holiday = new Holiday({
      title,
      startDate,
      endDate: endDate || startDate,
      description: description || '',
      type: type || 'Festival Holiday'
    });

    const saved = await holiday.save();
    res.status(201).json({ message: 'Holiday added successfully!', holiday: saved });
  } catch (err) {
    console.error('Error adding holiday:', err);
    res.status(500).json({ error: 'Failed to add holiday: ' + err.message });
  }
};

// Get All Holidays
exports.getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ startDate: 1 }).lean();
    res.json(holidays);
  } catch (err) {
    console.error('Error fetching holidays:', err);
    res.status(500).json({ error: 'Failed to fetch holidays: ' + err.message });
  }
};

// Delete Holiday (Admin)
exports.deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    await Holiday.findByIdAndDelete(id);
    res.json({ message: 'Holiday deleted successfully!' });
  } catch (err) {
    console.error('Error deleting holiday:', err);
    res.status(500).json({ error: 'Failed to delete holiday: ' + err.message });
  }
};
