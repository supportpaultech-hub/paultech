import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { FiPlus, FiTrash2, FiStar, FiMessageSquare, FiX } from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    review: '',
    rating: 5
  });

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/testimonials`);
      setTestimonials(res.data);
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/testimonials`, formData);
      setIsModalOpen(false);
      setFormData({ clientName: '', clientRole: '', review: '', rating: 5 });
      fetchTestimonials();
    } catch (err) {
      alert("Failed to add testimonial");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/testimonials/${id}`);
      fetchTestimonials();
    } catch (err) {
      alert("Failed to delete testimonial");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiStar className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0" />
            Manage Testimonials
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Add or remove client reviews displayed on the public website.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-xs sm:text-sm shrink-0"
        >
          <FiPlus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-slate-500 col-span-full">Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
            <FiMessageSquare size={48} className="mb-4 text-slate-300" />
            <p className="font-medium">No testimonials yet.</p>
            <p className="text-sm mt-1">Click "Add Testimonial" to create one.</p>
          </div>
        ) : (
          testimonials.map((test) => (
            <div key={test._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col relative">
              <button 
                onClick={() => handleDelete(test._id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Testimonial"
              >
                <FiTrash2 size={18} />
              </button>
              
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(test.rating)].map((_, i) => <FiStar key={i} fill="currentColor" size={16} />)}
              </div>
              
              <p className="text-slate-600 italic mb-6 flex-1 text-sm leading-relaxed">"{test.review}"</p>
              
              <div className="border-t border-slate-100 pt-4 flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {test.clientName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{test.clientName}</h4>
                  <p className="text-xs text-slate-500">{test.clientRole}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
              <FiX size={24} />
            </button>
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Add New Testimonial</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Client Name</label>
                  <input type="text" name="clientName" required value={formData.clientName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="e.g. Rajesh Kumar" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Client Role / Company</label>
                  <input type="text" name="clientRole" required value={formData.clientRole} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="e.g. CEO, TechVision" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Rating (1-5)</label>
                <select name="rating" required value={formData.rating} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Review Text</label>
                <textarea name="review" required rows="4" value={formData.review} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none transition-all" placeholder="Type the client's review here..."></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-8 rounded-xl shadow-md shadow-orange-600/20 transition-all">Add Testimonial</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManageTestimonials;
