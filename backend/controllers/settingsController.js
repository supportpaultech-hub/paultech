const Settings = require('../models/Settings');
const Event = require('../models/Event');
const User = require('../models/User');
const Certificate = require('../models/Certificate');
const Enquiry = require('../models/Enquiry');
const Job = require('../models/Job');
const Project = require('../models/Project');
const Gallery = require('../models/Gallery');
const { logActivity } = require('./activityController');

// Get System Settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Update System Settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
      settings.updatedAt = new Date();
    }
    await settings.save();
    await logActivity('Settings Updated', 'System configuration updated by Admin', 'system', 'Admin');
    res.json({ message: 'Settings saved successfully', settings });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(400).json({ error: err.message || 'Failed to update settings' });
  }
};

// Create Database Backup
exports.createBackup = async (req, res) => {
  try {
    const [events, users, certificates, enquiries, jobs, projects, gallery] = await Promise.all([
      Event.find().lean(),
      User.find().select('-password_hash').lean(),
      Certificate.find().lean(),
      Enquiry.find().lean(),
      Job.find().lean(),
      Project.find().lean(),
      Gallery.find().lean()
    ]);

    const backupData = {
      backupTimestamp: new Date().toISOString(),
      platform: 'PaulTech Software Services',
      collections: {
        events,
        users,
        certificates,
        enquiries,
        jobs,
        projects,
        gallery
      }
    };

    // Update lastBackupDate in settings
    let settings = await Settings.findOne();
    if (settings) {
      settings.lastBackupDate = new Date();
      await settings.save();
    }

    await logActivity('Backup Created', 'Full system database backup generated', 'system', 'Admin');

    res.json({
      message: 'System backup generated successfully!',
      timestamp: backupData.backupTimestamp,
      summary: {
        eventsCount: events.length,
        usersCount: users.length,
        certificatesCount: certificates.length,
        enquiriesCount: enquiries.length,
        jobsCount: jobs.length,
        projectsCount: projects.length,
        galleryCount: gallery.length
      },
      backupData
    });
  } catch (err) {
    console.error('Error creating backup:', err);
    res.status(500).json({ error: err.message || 'Failed to generate backup' });
  }
};
