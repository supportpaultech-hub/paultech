import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';
import { FiExternalLink } from 'react-icons/fi';
import { Building2, Layers, Search, Code } from 'lucide-react';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProjects = projects.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.techStack && p.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 shadow-xs backdrop-blur-md mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              Our Proven Engineering Portfolio
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Delivered <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Client Innovations</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Explore web applications, mobile platforms, enterprise ERP systems, and cloud architectures built by PaulTech Software Services.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Category & Search Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tech or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/80'
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
          <div className="text-center py-16 sm:py-20 bg-slate-50 rounded-3xl border border-slate-200/80 px-4">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No Portfolio Projects Uploaded Yet</h3>
            <p className="text-slate-500 text-sm mt-1">Upload client projects from the Admin Dashboard to feature them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project._id} 
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-orange-500/40 transition-all duration-500 group flex flex-col justify-between"
              >
                <div>
                  {/* Project Screenshot Container */}
                  <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
                    <img 
                      src={project.img ? (project.img.startsWith('http') ? project.img : `${API_BASE_URL}${project.img}`) : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'} 
                      alt={project.title} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-slate-900/85 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-white border border-white/20 shadow-md">
                      {project.category}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {project.title}
                    </h3>
                    
                    {project.clientName && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-3">
                        <Building2 className="w-3.5 h-3.5 text-orange-500" />
                        <span>Client: {project.clientName}</span>
                      </div>
                    )}

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-light line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Tech Stack & Live Button */}
                <div className="px-6 pb-6 pt-0 border-t border-slate-100 mt-auto">
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4 pt-4">
                      {project.techStack.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.liveUrl ? (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="w-full inline-flex items-center justify-center gap-2 bg-orange-500/10 hover:bg-orange-500 text-orange-600 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-orange-500/30 transition-all duration-300 shadow-sm"
                    >
                      <span>Explore Live Demo</span>
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Code className="w-3.5 h-3.5" /> Internal Client Solution
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
