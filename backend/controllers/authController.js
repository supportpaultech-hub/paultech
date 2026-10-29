const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logActivity } = require('./activityController');

const login = async (req, res) => {
  const { username, password, requiredRole } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      await logActivity('Login Failed', `Failed login attempt for username: ${username}`, 'security', 'Unknown');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (requiredRole && user.role !== requiredRole) {
      await logActivity('Login Mismatch', `User ${username} (${user.role}) attempted login on ${requiredRole} portal`, 'security', username);
      return res.status(403).json({ error: `Access denied. ${user.role} credentials cannot be used for ${requiredRole} login.` });
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    await logActivity('Login Event', `Successful login for user: ${user.username}`, 'user', user.username);
    res.json({ 
      token, 
      role: user.role, 
      user: {
        id: user._id,
        username: user.username,
        email: user.username,
        firstName: user.firstName || 'Employee',
        lastName: user.lastName || '',
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
        employeeId: user.employeeId || 'EMP-1001',
        designation: user.designation || 'Team Member',
        department: user.department || 'IT',
        img: user.img || ''
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const registerEmployee = async (req, res) => {
  const { 
    employeeId, username, password, firstName, lastName, 
    designation, department, experience, phone, education, skills,
    bio, projects, github, linkedin 
  } = req.body;
  
  let img = '';
  if (req.file) {
    // Cloudinary returns the full secure URL in req.file.path
    img = req.file.path;
  }
  
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username (email) already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = new User({
      employeeId,
      username,
      password_hash,
      plainPassword: password,
      role: 'EMPLOYEE',
      firstName,
      lastName,
      designation,
      department,
      experience: experience || '',
      phone,
      education,
      skills: skills ? (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : skills) : [],
      bio: bio || '',
      projects: projects || '',
      github: github || '',
      linkedin: linkedin || '',
      img
    });

    await user.save();
    await logActivity('Employee Created', `Added new employee: ${firstName} ${lastName}`, 'user', 'Admin');
    res.status(201).json({ message: 'Employee created successfully' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'EMPLOYEE' }).select('-password_hash');
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await logActivity('Employee Deleted', `Deleted employee: ${employee.firstName} ${employee.lastName}`, 'user', 'Admin');
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      employeeId, firstName, lastName, 
      designation, department, experience, phone, education, skills,
      bio, projects, github, linkedin
    } = req.body;

    const updates = {
      employeeId,
      firstName,
      lastName,
      designation,
      department,
      experience,
      phone,
      education,
      skills: skills ? (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : skills) : []
    };

    if (bio !== undefined) updates.bio = bio;
    if (projects !== undefined) updates.projects = projects;
    if (github !== undefined) updates.github = github;
    if (linkedin !== undefined) updates.linkedin = linkedin;

    if (req.file) {
      updates.img = req.file.path;
    }

    const employee = await User.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await logActivity('Employee Updated', `Updated details for: ${employee.firstName} ${employee.lastName}`, 'user', 'Admin');
    res.json({ message: 'Employee updated successfully', employee });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters.' });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    const employee = await User.findByIdAndUpdate(
      id,
      { password_hash, plainPassword: newPassword },
      { returnDocument: 'after' }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await logActivity('Password Changed', `Admin changed password for: ${employee.firstName} ${employee.lastName}`, 'security', 'Admin');
    res.json({ message: 'Password updated successfully', plainPassword: newPassword });
  } catch (err) {
    console.error('Change Password Error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ error: 'New password must be at least 4 characters.' });
    }

    let admin = await User.findOne({ role: 'ADMIN' });
    if (!admin) {
      admin = await User.findOne({ username: 'admin' });
    }

    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found.' });
    }

    if (currentPassword && admin.password_hash) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    admin.password_hash = password_hash;
    admin.plainPassword = newPassword;
    await admin.save();

    await logActivity('Admin Password Changed', 'Admin updated password from Security Settings', 'security', admin.username);
    res.json({ message: 'Admin password updated successfully!' });
  } catch (err) {
    console.error('Change Admin Password Error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

module.exports = { login, registerEmployee, getEmployees, deleteEmployee, updateEmployee, changePassword, changeAdminPassword };
