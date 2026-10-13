const Activity = require('../models/Activity');

// Helper to be used internally by other controllers
const logActivity = async (action, details, type = 'system', user = 'System') => {
    try {
        // Mock save if DB is not connected
        if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
            console.log('Mocked Activity Log:', { action, details, type, user });
            return;
        }

        const newActivity = new Activity({ action, details, type, user });
        await newActivity.save();
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Server error while fetching activities' });
    }
};

module.exports = { logActivity, getActivities };
