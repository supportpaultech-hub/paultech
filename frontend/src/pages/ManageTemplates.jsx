import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { FiPlus, FiTrash2, FiExternalLink, FiUploadCloud, FiPackage, FiCheck, FiX, FiEdit2, FiImage } from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';

const ManageTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web App');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [zipFile, setZipFile] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/templates`);
      setTemplates(res.data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item._id);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setCategory(item.category || 'Web App');
    setPrice(item.price ? String(item.price) : '');
    setOriginalPrice(item.originalPrice ? String(item.originalPrice) : '');
    setDemoUrl(item.demoUrl || '');
    setFeaturesInput(Array.isArray(item.features) ? item.features.join('\n') : '');
    setThumbnailUrl(item.thumbnail || '');
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setZipFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !description || !price) {
      alert('Please fill in title, description, and price.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('originalPrice', originalPrice || '0');
    formData.append('demoUrl', demoUrl);

    if (thumbnailUrl) {
      formData.append('thumbnailUrl', thumbnailUrl);
    }

    // Convert newline separated features to array
    const featuresArr = featuresInput.split('\n').filter(f => f.trim() !== '');
    formData.append('features', JSON.stringify(featuresArr));

    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    if (zipFile) {
      formData.append('zipFile', zipFile);
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/templates/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Template updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/templates`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Template uploaded successfully!');
      }
      resetForm();
      setIsModalOpen(false);
      fetchTemplates();
    } catch (err) {
      console.error('Error saving template:', err);
      alert('Failed to save template: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/templates/${id}`);
      fetchTemplates();
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Web App');
    setPrice('');
    setOriginalPrice('');
    setDemoUrl('');
    setFeaturesInput('');
    setThumbnailUrl('');
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setZipFile(null);
    setEditingId(null);
  };

  const getImageUrl = (url) => {
    if (!url) return DEFAULT_THUMBNAIL;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_THUMBNAIL;
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiPackage className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0" />
            Manage Digital Store
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Upload and manage project source codes, templates, and digital assets.
          </p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-xs sm:text-sm shrink-0"
        >
          <FiPlus size={18} /> Upload New Item
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] sm:text-xs uppercase text-slate-700 font-bold border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Item Details</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Category</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Price</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4">ZIP Package</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400">
                    <FiPackage size={36} className="mx-auto mb-2 text-slate-300" />
                    No templates uploaded yet. Click "Upload New Item" above!
                  </td>
                </tr>
              ) : (
                templates.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          <img 
                            src={getImageUrl(item.thumbnail)} 
                            alt={item.title}
                            onError={handleImageError}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                          {item.demoUrl && (
                            <a href={item.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-0.5">
                              <FiExternalLink size={10} /> Live Preview
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{item.price}
                    </td>
                    <td className="px-6 py-4">
                      {item.zipFileUrl ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <FiCheck size={12} /> ZIP Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          No File Attached
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors mr-1"
                        title="Edit Template"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Template"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload/Edit Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Project Template' : 'Upload Project Template / Source Code'}
              </h3>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 p-1">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Project Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. MERN Stack E-Commerce Full Source Code"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                  >
                    <option value="Web App">Web App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="React Template">React Template</option>
                    <option value="Python Script">Python Script</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="UI Kit">UI Kit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Selling Price (₹) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Live Demo URL (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://example-demo.com"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description *</label>
                <textarea 
                  rows="3"
                  required
                  placeholder="Provide a overview of what's included in this project package..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Features (One feature per line)</label>
                <textarea 
                  rows="3"
                  placeholder="Node.js Express Backend&#10;React Tailwind Frontend&#10;MongoDB Database Setup"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                ></textarea>
              </div>

              {/* Thumbnail Image URL or File Upload */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">Thumbnail Image (Choose File or Paste URL)</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Option A: Upload Image File</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Option B: Paste Image URL</label>
                    <input 
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={thumbnailUrl}
                      onChange={(e) => {
                        setThumbnailUrl(e.target.value);
                        setThumbnailPreview(null);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Preview Box */}
                {(thumbnailPreview || thumbnailUrl) && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200/80">
                    <img 
                      src={thumbnailPreview || getImageUrl(thumbnailUrl)} 
                      alt="Thumbnail Preview" 
                      onError={handleImageError}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-sm" 
                    />
                    <span className="text-xs text-slate-500 font-medium">Image Preview Ready</span>
                  </div>
                )}
              </div>

              {/* Zip File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Project ZIP File (.zip)</label>
                <input 
                  type="file" 
                  accept=".zip,.rar,.7z"
                  onChange={(e) => setZipFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : (editingId ? 'Update Item' : 'Save & Publish Item')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManageTemplates;
