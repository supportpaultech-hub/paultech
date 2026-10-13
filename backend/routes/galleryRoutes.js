const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'gallery-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per image
});

const uploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 30 }
]);

router.get('/', galleryController.getAlbums);
router.get('/:id', galleryController.getAlbumById);
router.post('/', uploadFields, galleryController.createAlbum);
router.put('/:id/images', upload.fields([{ name: 'images', maxCount: 30 }]), galleryController.addImagesToAlbum);
router.delete('/:id', galleryController.deleteAlbum);
router.delete('/:id/image', galleryController.deleteImageFromAlbum);

module.exports = router;
