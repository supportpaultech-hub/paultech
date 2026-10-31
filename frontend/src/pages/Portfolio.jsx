import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';
import { FiExternalLink } from 'react-icons/fi';
import { Layers, Search, Code, Lock } from 'lucide-react';

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
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-slate-800 relative overflow-hidden">
        {/* Glow ambient effects: Matching Brand Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[85px] rounded-full pointer-events-none"></div>

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
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 mb-8 sm:mb-12 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tech or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ease-out ${
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
          <CardGridSkeleton count={4} />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-slate-200/80 px-4 shadow-sm">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No Portfolio Projects Found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your category filter or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto justify-items-center">
            {filteredProjects.map((project) => {
              const projectImgUrl = project.img 
                ? (project.img.startsWith('http') ? project.img : `${API_BASE_URL}${project.img}`) 
                : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';

              const cleanDomain = project.liveUrl 
                ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') 
                : `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

              return (
                <div 
                  key={project._id}
                  className="w-full max-w-[540px] bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* macOS Style Window Title Bar */}
                  <div className="bg-slate-100/90 border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between select-none">
                    {/* macOS Window Control Dots */}
                    <div className="flex items-center gap-1.5 w-16">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block"></span>
                    </div>

                    {/* macOS Browser Address Pill */}
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 px-3.5 py-1 rounded-full text-[11px] font-mono text-slate-500 shadow-sm truncate max-w-[240px]">
                      <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{cleanDomain}</span>
                    </div>

                    {/* Right spacer to balance the traffic dots and keep address bar centered */}
                    <div className="w-16"></div>
                  </div>

                  {/* Project Screenshot Display (ZERO Vignette, 100% Crisp & Uncropped) */}
                  <div className="aspect-[16/10] w-full bg-slate-50 border-b border-slate-100 flex items-center justify-center p-2.5 sm:p-3 overflow-hidden">
                    <img 
                      src={projectImgUrl} 
                      alt={project.title} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain rounded-lg shadow-sm transition-transform duration-500 group-hover:scale-[1.02]" 
                    />
                  </div>

                  {/* Card Bottom: Project Name & Open Live Website Button */}
                  <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate group-hover:text-orange-600 transition-colors uppercase">
                        {project.title}
                      </h3>
                    </div>

                    {project.liveUrl ? (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                      >
                        <span>Open Live Website</span>
                        <FiExternalLink className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      </a>
                    ) : (
                      <div className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-500 font-semibold text-xs px-4 py-2.5 rounded-xl">
                        <Code className="w-3.5 h-3.5 text-slate-400" />
                        <span>Internal Solution</span>
                      </div>
                    )}
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
