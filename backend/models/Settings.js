const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // General
  companyName: { type: String, default: 'PaulTech Software Services' },
  supportEmail: { type: String, default: 'support@paultech.com' },
  supportPhone: { type: String, default: '+91 98765 43210' },
  allowEmployeeRegistration: { type: Boolean, default: false },
  strictDeviceTracking: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { 
    type: String, 
    default: 'We are currently performing scheduled maintenance and system performance upgrades to serve you better. We will be back online shortly!' 
  },
  maintenanceEstimatedEndTime: { type: String, default: 'Under 2 Hours' },

  // Security
  sessionTimeout: { type: String, default: '24h' },
  twoFactorAuth: { type: String, default: 'optional' },
  minPasswordLength: { type: Number, default: 6 },
  maxLoginAttempts: { type: Number, default: 5 },

  // Localization
  primaryLanguage: { type: String, default: 'en-US' },
  timezone: { type: String, default: 'Asia/Kolkata (IST - UTC+05:30)' },
  dateFormat: { type: String, default: 'YYYY-MM-DD' },
  currencySymbol: { type: String, default: '₹' },

  // Backups
  autoBackupSchedule: { type: String, default: 'daily' },
  lastBackupDate: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
