import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';
import { FiExternalLink } from 'react-icons/fi';
import { Building2, Layers, Search, Code, Globe, Eye, X } from 'lucide-react';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Web Development', 'Mobile App', 'Enterprise ERP', 'Cloud Architecture', 'UI/UX Design'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/projects`);
        setProjects(res.data || []);
      } catch (err) {
        console.error('Error fetching portfolio projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const filteredProjects = projects.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.techStack && p.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-orange-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            Our Proven Engineering Portfolio
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Delivered <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Client Innovations</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Explore web applications, mobile platforms, enterprise ERP systems, and cloud architectures built by PaulTech Software Services.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Category & Search Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tech or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ease-out ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 -translate-y-0.5'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        {loading ? (
          <CardGridSkeleton count={6} />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-slate-200/80 px-4 shadow-sm">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No Portfolio Projects Found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your category filter or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
            {filteredProjects.map((project) => {
              const projectImgUrl = project.img 
                ? (project.img.startsWith('http') ? project.img : `${API_BASE_URL}${project.img}`) 
                : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';

              return (
                <div 
                  key={project._id} 
                  className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_50px_-10px_rgba(15,23,42,0.18)] hover:-translate-y-2 hover:border-orange-500/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between"
                >
                  {/* Animated Top Orange Highlight Line on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left z-20" />

                  {/* Soft Ambient Radial Corner Glow on Hover */}
                  <div className="absolute -right-12 -bottom-12 w-44 h-44 bg-orange-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex flex-col">
                    {/* Browser-style Mockup Header */}
                    <div className="bg-slate-900 px-3.5 py-2.5 flex items-center justify-between border-b border-white/10 select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-800/90 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] text-slate-300 font-mono truncate max-w-[180px]">
                        <Globe className="w-3 h-3 text-orange-400 shrink-0" />
                        <span className="truncate">
                          {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-white/5">
                        {project.category || 'Web App'}
                      </span>
                    </div>

                    {/* Project Screenshot Container with Proper Proportions and Top Alignment */}
                    <div 
                      className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer group/img"
                      onClick={() => setSelectedImage({ src: projectImgUrl, title: project.title })}
                    >
                      <img 
                        src={projectImgUrl} 
                        alt={project.title} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                      {/* Subtle Vignette Gradient for Depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                      {/* Hover Sheen & Quick Action Pill */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage({ src: projectImgUrl, title: project.title });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                          <Eye className="w-3.5 h-3.5 text-orange-600" />
                          <span>View Screenshot</span>
                        </button>

                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                          >
                            <span>Live Site</span>
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors duration-300 tracking-tight leading-snug">
                          {project.title}
                        </h3>
                      </div>

                      {project.clientName && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/90 text-slate-600 text-xs font-semibold mb-3 self-start border border-slate-200/50">
                          <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span className="truncate">Client: {project.clientName}</span>
                        </div>
                      )}

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tech Stack Chips */}
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2 mt-auto">
                          {project.techStack.map((tech, idx) => (
                            <span 
                              key={idx}
                              className="bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200/80 group-hover:border-orange-200/80 transition-colors duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Action Button */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 mt-auto">
                    {project.liveUrl ? (
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ease-out group/btn"
                      >
                        <span>Explore Live Demo</span>
                        <FiExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </a>
                    ) : (
                      <div className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 border border-slate-200/80 text-slate-500 font-semibold text-xs py-2.5 rounded-xl">
                        <Code className="w-3.5 h-3.5 text-slate-400" />
                        <span>Internal Enterprise Solution</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/90 border-b border-slate-800">
              <h4 className="text-white font-bold text-sm sm:text-base truncate pr-4">
                {selectedImage.title} — Screenshot Preview
              </h4>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="overflow-auto p-3 sm:p-5 bg-slate-950/50 flex items-center justify-center">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
