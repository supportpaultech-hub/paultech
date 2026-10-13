const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disk Storage for Resume Files
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
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit for Resume files
});

// Job Posting Routes
router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);
router.delete('/:id', jobController.deleteJob);

// Job Application & Candidate Resume Routes
router.post('/apply', upload.single('resume'), jobController.applyForJob);
router.get('/applications', jobController.getApplications);
router.get('/applications/:id/resume', jobController.getResume);
router.put('/applications/:id/status', jobController.updateApplicationStatus);
router.put('/applications/:id/accept', jobController.acceptApplication);
router.put('/applications/:id/reject', jobController.rejectApplication);
router.get('/applications/:id/offer-letter', jobController.downloadOfferLetter);
router.delete('/applications/:id', jobController.deleteApplication);

module.exports = router;

