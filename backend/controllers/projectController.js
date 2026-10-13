const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

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

    let imgPath = '';
    if (req.file) {
      imgPath = `/uploads/${req.file.filename}`;
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

// Delete a portfolio project (Admin)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.img && project.img.startsWith('/uploads/')) {
      const fullPath = path.join(__dirname, '..', project.img);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
