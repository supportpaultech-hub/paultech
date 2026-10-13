const Broadcast = require('../models/Broadcast');

// Get current global broadcast
exports.getBroadcast = async (req, res) => {
  try {
    let broadcast = await Broadcast.findOne();
    if (!broadcast) {
      broadcast = new Broadcast();
      await broadcast.save();
    }
    res.json(broadcast);
  } catch (err) {
    console.error('Error fetching broadcast:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update global broadcast (Admin)
exports.updateBroadcast = async (req, res) => {
  try {
    const { message, priority, isActive } = req.body;
    let broadcast = await Broadcast.findOne();
    if (!broadcast) {
      broadcast = new Broadcast();
    }

    if (message !== undefined) broadcast.message = message;
    if (priority !== undefined) broadcast.priority = priority;
    if (isActive !== undefined) broadcast.isActive = Boolean(isActive);
    broadcast.updatedAt = Date.now();

    await broadcast.save();
    res.json({ message: 'Global broadcast updated successfully', broadcast });
  } catch (err) {
    console.error('Error updating broadcast:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
