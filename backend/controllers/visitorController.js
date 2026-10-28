const Visitor = require('../models/Visitor');

const BASE_VISITOR_COUNT = 77000;

// Get and increment visitor count
exports.incrementVisitorCount = async (req, res) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: BASE_VISITOR_COUNT });
      await visitor.save();
    } else {
      if (!visitor.count || visitor.count < BASE_VISITOR_COUNT) {
        visitor.count = BASE_VISITOR_COUNT;
      } else {
        visitor.count += 1;
      }
      visitor.updatedAt = Date.now();
      await visitor.save();
    }
    res.json({ count: visitor.count });
  } catch (err) {
    console.error('Error in visitor count:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
