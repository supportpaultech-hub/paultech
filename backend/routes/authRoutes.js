const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'paultech_employees',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});
const upload = multer({ storage: storage });

router.post('/login', authController.login);
router.post('/register-employee', upload.single('image'), authController.registerEmployee);
router.get('/employees', authController.getEmployees);
router.delete('/employees/:id', authController.deleteEmployee);
router.put('/employees/:id', upload.single('image'), authController.updateEmployee);
router.put('/employees/:id/password', authController.changePassword);
router.put('/admin/password', authController.changeAdminPassword);

module.exports = router;
