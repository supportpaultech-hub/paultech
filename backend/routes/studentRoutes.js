const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticateToken = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disk Storage for Optional Resume Files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }
});

router.get('/', authenticateToken, studentController.getAllStudents);
router.get('/:id/offer-letter', authenticateToken, studentController.downloadOfferLetter);
router.post('/', authenticateToken, upload.single('resume'), studentController.addStudent);
router.put('/:id', authenticateToken, upload.single('resume'), studentController.updateStudent);
router.put('/:id/certificate', authenticateToken, studentController.updateCertificate);
router.delete('/:id', authenticateToken, studentController.deleteStudent);

module.exports = router;
