const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');

// 1. Get All Gallery Albums
exports.getAlbums = async (req, res) => {
  try {
    const albums = await Gallery.find().sort({ createdAt: -1 });
    res.json(albums);
  } catch (error) {
    console.error('Error fetching gallery albums:', error);
    res.status(500).json({ error: 'Failed to fetch gallery albums' });
  }
};

// 2. Get Single Album by ID
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.json(album);
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ error: 'Failed to fetch album' });
  }
};

// 3. Create New Album (Thumbnail + Multiple Images)
exports.createAlbum = async (req, res) => {
  try {
    const { title, description, category, eventDate } = req.body;

    let thumbnailUrl = req.body.thumbnailUrl || '';
    const imagesList = [];

    // Handle uploaded files from Multer
    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const thumbFile = req.files.thumbnail[0];
        thumbnailUrl = thumbFile.path ? (thumbFile.path.startsWith('http') ? thumbFile.path : `/uploads/${thumbFile.filename}`) : thumbnailUrl;
      }

      if (req.files.images && req.files.images.length > 0) {
        req.files.images.forEach(file => {
          const imgUrl = file.path ? (file.path.startsWith('http') ? file.path : `/uploads/${file.filename}`) : '';
          if (imgUrl) imagesList.push(imgUrl);
        });
      }
    }

    // Fallback if no thumbnail file uploaded but images exist
    if (!thumbnailUrl && imagesList.length > 0) {
      thumbnailUrl = imagesList[0];
    }

    if (!thumbnailUrl) {
      thumbnailUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
    }

    const newAlbum = new Gallery({
      title,
      description: description || '',
      category: category || 'Events',
      eventDate: eventDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      thumbnail: thumbnailUrl,
      images: imagesList
    });

    await newAlbum.save();
    res.status(201).json(newAlbum);
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Failed to create album: ' + error.message });
  }
};

// 4. Add Additional Images to Existing Album
exports.addImagesToAlbum = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const newImages = [];
    if (req.files && req.files.images) {
      req.files.images.forEach(file => {
        const imgUrl = file.path ? (file.path.startsWith('http') ? file.path : `/uploads/${file.filename}`) : '';
        if (imgUrl) newImages.push(imgUrl);
      });
    }

    if (newImages.length > 0) {
      album.images = [...album.images, ...newImages];
      await album.save();
    }

    res.json(album);
  } catch (error) {
    console.error('Error adding images to album:', error);
    res.status(500).json({ error: 'Failed to add images to album' });
  }
};

// 5. Delete Specific Image from Album
exports.deleteImageFromAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const album = await Gallery.findById(id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    album.images = album.images.filter(img => img !== imageUrl);
    
    // If thumbnail was deleted image, reset thumbnail to first remaining image
    if (album.thumbnail === imageUrl) {
      album.thumbnail = album.images[0] || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
    }

    await album.save();
    res.json(album);
  } catch (error) {
    console.error('Error deleting image from album:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

// 6. Delete Entire Album
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Failed to delete album' });
  }
};
