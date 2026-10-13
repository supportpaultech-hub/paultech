const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disk Storage for Thumbnails and Zip Files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for ZIP files
});

const uploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'zipFile', maxCount: 1 }
]);

router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplateById);
router.post('/', uploadFields, templateController.createTemplate);
router.put('/:id', uploadFields, templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
