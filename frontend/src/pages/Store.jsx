import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiExternalLink, FiSearch, FiCode, FiLayers, FiCheckCircle, FiTag } from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const Store = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/templates`);
      setTemplates(res.data);
    } catch (err) {
      console.error('Error loading templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['All', 'Web App', 'Mobile App', 'React Template', 'Python Script', 'E-Commerce', 'UI Kit'];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';

  const getImageUrl = (url) => {
    if (!url) return DEFAULT_THUMBNAIL;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_THUMBNAIL;
  };

  const getZipUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Store Hero Header */}
      <section className="bg-slate-900 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-slate-800 relative overflow-hidden">
        {/* Glow ambient effects: Paul's Brand Orange Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-orange-500/25 via-amber-500/15 to-transparent blur-[85px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-orange-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            Ready-To-Deploy Source Code
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Project Store & Digital Assets
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Download production-ready project templates, web applications, and scripts with clean code & full setup guides.
          </p>
        </div>
      </section>

      {/* Search & Category Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search templates, tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 sm:py-2.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>

          {/* Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        {isLoading ? (
          <CardGridSkeleton count={6} />
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 max-w-xl mx-auto shadow-sm">
            <FiLayers size={44} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">No templates found</h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-6">We are constantly adding new project source codes. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTemplates.map((item) => (
              <div 
                key={item._id} 
                className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-orange-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Banner */}
                <div className="relative h-44 sm:h-52 bg-slate-100 overflow-hidden">
                  <img 
                    src={getImageUrl(item.thumbnail)} 
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-slate-900/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-lg border border-white/20">
                    {item.category}
                  </div>
                  {item.price > 0 ? (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-orange-500 text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-lg shadow-lg">
                      ₹{item.price}
                    </div>
                  ) : (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-emerald-500 text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-lg shadow-lg">
                      FREE
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-6 font-normal">
                      {item.description}
                    </p>

                    {/* Features List */}
                    {item.features && item.features.length > 0 && (
                      <div className="space-y-2 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        {item.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <FiCheckCircle size={14} className="text-orange-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    {item.demoUrl ? (
                      <a 
                        href={item.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FiExternalLink size={14} /> Demo
                      </a>
                    ) : (
                      <button disabled className="flex-1 py-2.5 px-3 rounded-xl border border-slate-100 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed">
                        No Demo
                      </button>
                    )}

                    {item.zipFileUrl ? (
                      <a 
                        href={getZipUrl(item.zipFileUrl)}
                        download
                        className="flex-1 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
                      >
                        <FiDownload size={14} /> Get Code
                      </a>
                    ) : (
                      <a 
                        href="/contact" 
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        Buy Now
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
