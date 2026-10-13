const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['user', 'system', 'security'],
        default: 'system'
    },
    user: {
        type: String,
        default: 'System'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 2592000 // Automatically deletes activity logs older than 30 days (30 days * 24h * 60m * 60s)
    }
});

module.exports = mongoose.model('Activity', activitySchema);
