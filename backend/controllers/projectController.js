const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Helper to upload project image to Cloudinary
const uploadToCloudinary = async (filePath, folder = 'paultech_portfolio') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    // Remove local file after successful upload to Cloudinary
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary project upload error:', err);
    return null;
  }
};

// Get all portfolio projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new portfolio project (Admin)
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, clientName, techStack, liveUrl } = req.body;

    let imgPath = req.body.img || '';
    if (req.file) {
      const cloudUrl = await uploadToCloudinary(req.file.path, 'paultech_portfolio');
      imgPath = cloudUrl || `/uploads/${req.file.filename}`;
    }

    let parsedTechStack = [];
    if (techStack) {
      try {
        parsedTechStack = typeof techStack === 'string' ? JSON.parse(techStack) : techStack;
      } catch (e) {
        parsedTechStack = String(techStack).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const newProject = new Project({
      title,
      description,
      category: category || 'Web Development',
      clientName: clientName || '',
      img: imgPath,
      techStack: parsedTechStack,
      liveUrl: liveUrl || ''
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Update a portfolio project (Admin)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { title, description, category, clientName, techStack, liveUrl } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (clientName !== undefined) project.clientName = clientName;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;

    if (techStack) {
      try {
        project.techStack = typeof techStack === 'string' ? JSON.parse(techStack) : techStack;
      } catch (e) {
        project.techStack = String(techStack).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    if (req.file) {
      const cloudUrl = await uploadToCloudinary(req.file.path, 'paultech_portfolio');
      project.img = cloudUrl || `/uploads/${req.file.filename}`;
    } else if (req.body.img) {
      project.img = req.body.img;
    }

    await project.save();
    res.json({ message: 'Project updated successfully', project });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// Delete a portfolio project (Admin)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.img) {
      if (project.img.startsWith('/uploads/')) {
        const fullPath = path.join(__dirname, '..', project.img);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
