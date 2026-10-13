const Visitor = require('../models/Visitor');

// Get and increment visitor count
exports.incrementVisitorCount = async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: 1248 });
      await visitor.save();
    } else {
      visitor.count += 1;
      visitor.updatedAt = Date.now();
      await visitor.save();
    }
    res.json({ count: visitor.count });
  } catch (err) {
    console.error('Error in visitor count:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
