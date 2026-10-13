import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { 
  FiImage, FiPlus, FiTrash2, FiUploadCloud, FiX, 
  FiFolder, FiCheck, FiCalendar, FiEye, FiLayers 
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const ManageGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // for viewing/editing images
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  // New Album Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Internship Batch');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);

  // Additional Image Upload for Existing Album
  const [extraImageFiles, setExtraImageFiles] = useState([]);

  const categories = ['All', 'Internship Batch', 'Picnic & Outings', 'Events & Celebrations', 'Office Life', 'Workshops'];

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/gallery`);
      setAlbums(res.data || []);
    } catch (err) {
      console.error('Error fetching gallery albums:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagesPreviews(previews);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter an album title.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('eventDate', eventDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      await axios.post(`${API_BASE_URL}/api/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Gallery Album created successfully!');
      setIsCreateModalOpen(false);
      resetCreateForm();
      fetchAlbums();
    } catch (err) {
      console.error('Error creating album:', err);
      alert('Failed to create album: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const resetCreateForm = () => {
    setTitle('');
    setCategory('Internship Batch');
    setDescription('');
    setEventDate('');
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setImageFiles([]);
    setImagesPreviews([]);
  };

  const handleDeleteAlbum = async (id, albumTitle) => {
    if (window.confirm(`Are you sure you want to delete album "${albumTitle}" and all its photos?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/gallery/${id}`);
        fetchAlbums();
        if (selectedAlbum && selectedAlbum._id === id) {
          setSelectedAlbum(null);
        }
      } catch (err) {
        alert('Failed to delete album.');
      }
    }
  };

  const handleDeleteSingleImage = async (albumId, imageUrl) => {
    if (window.confirm('Delete this photo from album?')) {
      try {
        const res = await axios.delete(`${API_BASE_URL}/api/gallery/${albumId}/image`, {
          data: { imageUrl }
        });
        setSelectedAlbum(res.data);
        fetchAlbums();
      } catch (err) {
        alert('Failed to delete image.');
      }
    }
  };

  const handleAddExtraImages = async (e) => {
    e.preventDefault();
    if (!extraImageFiles || extraImageFiles.length === 0) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      Array.from(extraImageFiles).forEach(file => {
        formData.append('images', file);
      });

      const res = await axios.put(`${API_BASE_URL}/api/gallery/${selectedAlbum._id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSelectedAlbum(res.data);
      setExtraImageFiles([]);
      fetchAlbums();
      alert('New photos added to album!');
    } catch (err) {
      alert('Failed to add photos to album.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAlbums = albums.filter(album => 
    filterCategory === 'All' || album.category === filterCategory
  );

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';
    return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiImage className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0" />
            Manage Photo Gallery
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Upload album thumbnails (e.g. Intern Batch 2026, Picnic 2026) and add multiple event photos.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-xs sm:text-sm shrink-0"
        >
          <FiPlus size={18} /> Create New Album
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Albums Grid */}
      {loading ? (
        <CardGridSkeleton count={6} />
      ) : filteredAlbums.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <FiLayers size={48} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Gallery Albums Uploaded Yet</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto mt-1 mb-4">
            Click "Create New Album" to upload album covers like "Intern Batch 2026" or "Annual Picnic 2026" with photos.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md shadow-orange-600/20"
          >
            <FiPlus size={16} /> Create First Album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlbums.map((album) => (
            <div 
              key={album._id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Album Thumbnail */}
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <img
                  src={getImageUrl(album.thumbnail)}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
                  {album.category}
                </div>

                {/* Photo Count Badge */}
                <div className="absolute bottom-3 right-3 bg-orange-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                  <FiImage size={12} />
                  <span>{(album.images ? album.images.length : 0) + 1} Photos</span>
                </div>
              </div>

              {/* Album Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900 leading-snug truncate">{album.title}</h3>
                  </div>

                  {album.eventDate && (
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-2">
                      <FiCalendar className="text-orange-500" size={12} />
                      {album.eventDate}
                    </p>
                  )}

                  {album.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {album.description}
                    </p>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedAlbum(album)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-colors"
                  >
                    <FiEye size={14} /> View / Add Photos
                  </button>

                  <button
                    onClick={() => handleDeleteAlbum(album._id, album.title)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Album"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE NEW ALBUM MODAL */}
      {isCreateModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <FiFolder className="text-orange-500" /> Create New Gallery Album
              </h2>
              <button 
                onClick={() => { setIsCreateModalOpen(false); resetCreateForm(); }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Album Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Intern Batch 2026 or Picnic Sakchi 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="Internship Batch">Internship Batch</option>
                    <option value="Picnic & Outings">Picnic & Outings</option>
                    <option value="Events & Celebrations">Events & Celebrations</option>
                    <option value="Office Life">Office Life</option>
                    <option value="Workshops">Workshops</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Event Month / Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Aug 2026"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Memories and moments from this batch or event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                ></textarea>
              </div>

              {/* Cover Thumbnail File Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Thumbnail Image *</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer transition-colors text-xs border border-slate-200">
                    <FiUploadCloud size={16} /> Choose Cover Photo
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                  </label>
                  {thumbnailPreview && (
                    <img src={thumbnailPreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-300" />
                  )}
                </div>
              </div>

              {/* Multiple Event Photos Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Album Event Photos (Select Multiple)</label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors text-center">
                  <FiUploadCloud size={24} className="text-orange-500 mb-1" />
                  <span className="font-bold text-slate-700 text-xs">Click to select multiple photos</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Hold Ctrl/Cmd to select 10, 20 photos at once</span>
                  <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
                </label>

                {imagesPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {imagesPreviews.map((src, idx) => (
                      <img key={idx} src={src} alt="Event photo" className="w-full h-12 object-cover rounded-lg border border-slate-200" />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); resetCreateForm(); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
                >
                  {submitting ? 'Creating Album...' : 'Upload & Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* VIEW & EDIT ALBUM PHOTOS MODAL */}
      {selectedAlbum && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 md:p-8 relative max-h-[90vh] flex flex-col space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedAlbum.title}</h2>
                <p className="text-xs text-slate-500 font-medium">{selectedAlbum.category} • {(selectedAlbum.images ? selectedAlbum.images.length : 0) + 1} Photos</p>
              </div>
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Add More Photos Form */}
            <form onSubmit={handleAddExtraImages} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-700 mb-1">Add More Photos to this Album</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={(e) => setExtraImageFiles(e.target.files)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200" 
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !extraImageFiles.length}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow transition-all shrink-0 w-full sm:w-auto disabled:opacity-50"
              >
                {submitting ? 'Uploading...' : 'Upload Photos'}
              </button>
            </form>

            {/* Photos Grid */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Album Photos</h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {/* Cover Thumbnail Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden group border-2 border-orange-500 shadow-sm">
                  <img src={getImageUrl(selectedAlbum.thumbnail)} alt="Cover" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-orange-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                    COVER
                  </div>
                </div>

                {/* Additional Images */}
                {selectedAlbum.images && selectedAlbum.images.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 shadow-sm bg-slate-900">
                    <img src={getImageUrl(imgUrl)} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    
                    <button
                      onClick={() => handleDeleteSingleImage(selectedAlbum._id, imgUrl)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      title="Delete photo"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedAlbum(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManageGallery;
