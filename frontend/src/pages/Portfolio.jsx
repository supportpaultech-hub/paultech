import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';
import { FiExternalLink } from 'react-icons/fi';
import { Building2, Layers, Search, Code, RotateCw } from 'lucide-react';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [flippedCards, setFlippedCards] = useState({});

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

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

        {/* Portfolio Cards Showcase */}
        {loading ? (
          <CardGridSkeleton count={6} />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-slate-200/80 px-4 shadow-sm">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No Portfolio Projects Found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your category filter or search query.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 sm:gap-10">
            {filteredProjects.map((project) => {
              const projectImgUrl = project.img 
                ? (project.img.startsWith('http') ? project.img : `${API_BASE_URL}${project.img}`) 
                : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';

              const isFlipped = !!flippedCards[project._id];

              return (
                <div 
                  key={project._id}
                  onClick={() => toggleFlip(project._id)}
                  className="group [perspective:1400px] w-full max-w-[340px] sm:w-[330px] lg:w-[345px] h-[480px] shrink-0 cursor-pointer select-none"
                >
                  {/* 3D Flipper Box */}
                  <div className={`relative w-full h-full rounded-[26px] sm:rounded-[30px] transition-transform duration-700 [transform-style:preserve-3d] shadow-[0_12px_35px_-8px_rgba(0,0,0,0.18)] hover:shadow-[0_22px_45px_-6px_rgba(249,115,22,0.3)] hover:-translate-y-1.5 transition-all duration-500 ${
                    isFlipped ? '[transform:rotateY(180deg)] shadow-[0_22px_45px_-6px_rgba(249,115,22,0.32)]' : ''
                  }`}>

                    {/* ================= FRONT FACE (Full Image Showcase + Vignette + Name & Link) ================= */}
                    <div className="absolute inset-0 w-full h-full rounded-[26px] sm:rounded-[30px] overflow-hidden [backface-visibility:hidden] bg-slate-950 border border-slate-700/60 flex flex-col justify-between">
                      
                      {/* Ambient Blurred Aura from Same Image to Fill Card Naturally */}
                      <img 
                        src={projectImgUrl} 
                        alt="" 
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none" 
                      />

                      {/* Main Sharp Uncropped Project Screenshot (100% visible, zero cropping) */}
                      <div className="absolute inset-0 pb-36 sm:pb-40 p-4 sm:p-5 flex items-center justify-center z-10">
                        <img 
                          src={projectImgUrl} 
                          alt={project.title} 
                          loading="lazy"
                          decoding="async"
                          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>

                      {/* Top Bar Status / Flip Hint */}
                      <div className="relative z-20 p-4 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-slate-900/80 text-orange-400 border border-orange-500/30 backdrop-blur-md shadow-md">
                          {project.category || 'Web Development'}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-300 bg-slate-900/80 border border-white/10 backdrop-blur-md">
                          <RotateCw className="w-3 h-3 text-orange-400" />
                          <span>Click to Flip</span>
                        </div>
                      </div>

                      {/* Deep Photographic Vignette Gradient for High Contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none z-10" />

                      {/* Radial Corner Vignette */}
                      <div 
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.95) 100%)'
                        }}
                      />

                      {/* Subtle Inner Ring Border */}
                      <div className="absolute inset-0 rounded-[26px] sm:rounded-[30px] ring-1 ring-inset ring-white/15 pointer-events-none z-20" />

                      {/* Bottom-Left Overlay: Name & Live Link */}
                      <div className="relative z-20 p-5 sm:p-6 text-left">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                          {project.title}
                        </h3>

                        {/* Glowing Accent Line */}
                        <div className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full my-2.5 transition-all duration-500 group-hover:w-20" />

                        <div className="pt-1 flex items-center justify-between gap-3">
                          {project.liveUrl ? (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                              <span>Explore Live Demo</span>
                              <FiExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                              <Code className="w-3.5 h-3.5 text-orange-400" /> Internal Client Solution
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400 font-medium">
                            Details ↻
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ================= BACK FACE (Description + Tech Stack + Info) ================= */}
                    <div className="absolute inset-0 w-full h-full rounded-[26px] sm:rounded-[30px] overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-orange-500/40 p-5 sm:p-6 flex flex-col justify-between text-left text-white shadow-2xl relative">
                      
                      {/* Ambient Glows */}
                      <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                      {/* Back Top: Title + Category + Flip Back button */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                          <div className="min-w-0 pr-2">
                            <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest block mb-0.5">
                              {project.category || 'Project Details'}
                            </span>
                            <h4 className="text-lg sm:text-xl font-black text-white truncate">
                              {project.title}
                            </h4>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlip(project._id);
                            }}
                            className="p-2 rounded-xl bg-white/10 hover:bg-orange-500 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 shrink-0 shadow-sm"
                            title="Flip to Front"
                          >
                            <RotateCw className="w-3.5 h-3.5 text-orange-400 hover:text-white" />
                          </button>
                        </div>

                        {project.clientName && (
                          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[11px] font-semibold">
                            <Building2 className="w-3 h-3 text-orange-400 shrink-0" />
                            <span className="truncate">Client: {project.clientName}</span>
                          </div>
                        )}
                      </div>

                      {/* Back Middle: Description & Tech Stack */}
                      <div className="relative z-10 space-y-3 my-auto py-1">
                        <div>
                          <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                            About Project
                          </span>
                          <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed font-light line-clamp-6 bg-white/[0.04] p-3 rounded-xl border border-white/5 backdrop-blur-xs">
                            "{project.description}"
                          </p>
                        </div>

                        {project.techStack && project.techStack.length > 0 && (
                          <div>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                              Tech Stack
                            </span>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                              {project.techStack.map((tech, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-200 text-[10px] sm:text-[11px] font-semibold font-mono"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Back Bottom: CTA Link and Flip Back Notice */}
                      <div className="relative z-10 pt-2.5 border-t border-white/10 flex flex-col gap-2">
                        {project.liveUrl ? (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span>Open Live Website</span>
                            <FiExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <div className="w-full text-center text-xs text-slate-400 py-1 font-medium">
                            Enterprise Internal Project
                          </div>
                        )}
                        <p className="text-center text-[10px] text-slate-400">
                          Click card to flip back to image
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
