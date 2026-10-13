const Template = require('../models/Template');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Helper to upload image file to Cloudinary
const uploadToCloudinary = async (filePath, folder = 'paultech_templates') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    // Remove local file after successful upload to Cloudinary
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return null;
  }
};

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error('Error fetching templates:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single template
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (err) {
    console.error('Error fetching template:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new template (Admin)
exports.createTemplate = async (req, res) => {
  try {
    const { title, description, category, price, originalPrice, demoUrl, features, tags, thumbnailUrl } = req.body;

    let thumbnailPath = thumbnailUrl || req.body.thumbnail || '';
    let zipFilePath = req.body.zipFileUrl || req.body.zipFile || '';

    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const cloudUrl = await uploadToCloudinary(req.files.thumbnail[0].path, 'paultech_templates');
        thumbnailPath = cloudUrl || `/uploads/${req.files.thumbnail[0].filename}`;
      }
      if (req.files.zipFile && req.files.zipFile[0]) {
        zipFilePath = `/uploads/${req.files.zipFile[0].filename}`;
      }
    }

    let parsedFeatures = [];
    let parsedTags = [];

    if (features) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        parsedFeatures = String(features).split(',').map(s => s.trim());
      }
    }

    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = String(tags).split(',').map(s => s.trim());
      }
    }

    const newTemplate = new Template({
      title,
      description,
      category: category || 'Web App',
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || 0,
      demoUrl: demoUrl || '',
      thumbnail: thumbnailPath,
      zipFileUrl: zipFilePath,
      features: parsedFeatures,
      tags: parsedTags
    });

    await newTemplate.save();
    res.status(201).json({ message: 'Template created successfully', template: newTemplate });
  } catch (err) {
    console.error('Error creating template:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Update an existing template (Admin)
exports.updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const { title, description, category, price, originalPrice, demoUrl, features, tags, thumbnailUrl } = req.body;

    if (title !== undefined) template.title = title;
    if (description !== undefined) template.description = description;
    if (category !== undefined) template.category = category;
    if (price !== undefined) template.price = Number(price);
    if (originalPrice !== undefined) template.originalPrice = Number(originalPrice);
    if (demoUrl !== undefined) template.demoUrl = demoUrl;

    if (thumbnailUrl) {
      template.thumbnail = thumbnailUrl;
    }

    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const cloudUrl = await uploadToCloudinary(req.files.thumbnail[0].path, 'paultech_templates');
        template.thumbnail = cloudUrl || `/uploads/${req.files.thumbnail[0].filename}`;
      }
      if (req.files.zipFile && req.files.zipFile[0]) {
        template.zipFileUrl = `/uploads/${req.files.zipFile[0].filename}`;
      }
    }

    if (features !== undefined) {
      try {
        template.features = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        template.features = String(features).split(',').map(s => s.trim());
      }
    }

    if (tags !== undefined) {
      try {
        template.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        template.tags = String(tags).split(',').map(s => s.trim());
      }
    }

    await template.save();
    res.json({ message: 'Template updated successfully', template });
  } catch (err) {
    console.error('Error updating template:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Delete a template (Admin)
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Delete local uploaded files if existing
    if (template.thumbnail && template.thumbnail.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', template.thumbnail);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    if (template.zipFileUrl && template.zipFileUrl.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', template.zipFileUrl);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted successfully' });
  } catch (err) {
    console.error('Error deleting template:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
