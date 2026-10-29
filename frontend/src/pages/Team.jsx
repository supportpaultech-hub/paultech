import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiMail, 
  FiGithub, 
  FiLinkedin, 
  FiRotateCw, 
  FiBriefcase, 
  FiCode, 
  FiUser, 
  FiUsers,
  FiSearch
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const MemberCard = ({ member }) => {
  const fullName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Team Member';
  const designation = member.designation || member.role || 'Software Developer';
  const imageSrc = member.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1e293b&color=f97316&size=600&bold=true`;
  const defaultBio = `${member.firstName || 'This team member'} is a core ${designation} at PaulTech Software Services, dedicated to engineering robust, scalable software architectures and innovative digital solutions.`;
  const bio = member.bio || defaultBio;
  const skills = Array.isArray(member.skills) 
    ? member.skills 
    : (typeof member.skills === 'string' && member.skills ? member.skills.split(',') : []);

  return (
    <div className="group [perspective:1400px] w-full max-w-[340px] sm:max-w-[360px] md:max-w-[380px] h-[480px] sm:h-[510px] cursor-pointer select-none">
      {/* 3D Flipper Box */}
      <div className="relative w-full h-full rounded-[28px] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.18)] group-hover:shadow-[0_24px_50px_-8px_rgba(249,115,22,0.35)]">
        
        {/* ================= FRONT FACE (Full Box Image + Vignette + Bottom Left Name & Designation) ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden [backface-visibility:hidden] bg-slate-900 border border-slate-200/40">
          {/* Full Cover Image */}
          <img
            src={imageSrc}
            alt={fullName}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Vignette Layer 1: Bottom Deep Gradient for High Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none" />

          {/* Vignette Layer 2: Photographic Radial Vignette (Dark Edges & Corners) */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.02) 35%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.85) 100%)'
            }}
          />

          {/* Subtle Inner Ring Border */}
          <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/15 pointer-events-none" />

          {/* Top-Right Turn/Flip Hint Pill */}
          <div className="absolute top-4 right-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium shadow-md transition-all group-hover:bg-orange-600 group-hover:border-orange-500">
              <FiRotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
              <span>Flip for Bio</span>
            </span>
          </div>

          {/* Bottom-Left Overlay: Name, Designation & Department */}
          <div className="absolute bottom-6 left-6 right-6 text-left z-20">
            {member.department && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/25 backdrop-blur-md border border-orange-400/40 text-orange-300 text-[10px] font-bold tracking-wider uppercase mb-2">
                {member.department}
              </span>
            )}
            
            <h3 className="text-2xl sm:text-[26px] font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {fullName}
            </h3>

            <p className="text-sm sm:text-base font-semibold text-orange-400 mt-1 flex items-center gap-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {designation}
            </p>

            {member.experience && (
              <p className="text-[11px] font-medium text-slate-300 mt-1.5 flex items-center gap-1.5">
                <FiBriefcase className="text-orange-400 shrink-0" size={12} />
                <span>{member.experience} Experience</span>
              </p>
            )}

            {/* Glowing Accent Line */}
            <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-3 transition-all duration-500 group-hover:w-24" />
          </div>
        </div>

        {/* ================= BACK FACE (3D Flip: Developer Ke Baare Me & Skills) ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-orange-500/40 p-6 sm:p-7 flex flex-col justify-between text-left text-white shadow-2xl relative">
          
          {/* Ambient Glows */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Back Top: Mini Header */}
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {member.firstName?.charAt(0) || 'P'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{fullName}</h4>
                  <p className="text-[11px] text-orange-400 font-medium truncate">{designation}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                {member.department || 'PaulTech'}
              </span>
            </div>
          </div>

          {/* Back Middle: Developer Ke Baare Me (Bio) & Skills */}
          <div className="relative z-10 space-y-3.5 my-auto py-2">
            <div>
              <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <FiUser size={12} /> About The Developer
              </span>
              <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed font-light line-clamp-5 bg-white/[0.04] p-3.5 rounded-2xl border border-white/5 backdrop-blur-xs">
                "{bio}"
              </p>
            </div>

            {/* Tech Stack / Skills Badges */}
            {skills.length > 0 && (
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                  <FiCode size={12} /> Tech Stack & Skills
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-200 text-[10px] font-semibold font-mono"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Tags: Experience & Education */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              {member.experience && (
                <div className="bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[10px] block">Experience</span>
                  <span className="font-semibold text-slate-200 truncate block">{member.experience}</span>
                </div>
              )}
              {member.education && (
                <div className="bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[10px] block">Education</span>
                  <span className="font-semibold text-slate-200 truncate block">{member.education}</span>
                </div>
              )}
            </div>
          </div>

          {/* Back Bottom: Socials & Connect */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              {member.employeeId ? `ID: ${member.employeeId}` : 'PaulTech Member'}
            </span>

            <div className="flex items-center gap-2">
              {member.linkedin && (
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 rounded-xl bg-white/10 hover:bg-orange-600 text-white transition-all hover:scale-110"
                  title="LinkedIn Profile"
                >
                  <FiLinkedin size={14} />
                </a>
              )}
              {member.github && (
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 rounded-xl bg-white/10 hover:bg-orange-600 text-white transition-all hover:scale-110"
                  title="GitHub Profile"
                >
                  <FiGithub size={14} />
                </a>
              )}
              {member.username && (
                <a 
                  href={`mailto:${member.username}`}
                  className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-all hover:scale-110"
                  title="Send Corporate Email"
                >
                  <FiMail size={14} />
                </a>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/employees`);
        setTeamMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch team members", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, []);

  // Compute departments list dynamically from database
  const departments = ['All', ...new Set(teamMembers.map(m => m.department).filter(Boolean))];

  // Dynamic filtering based on search and department
  const filteredMembers = teamMembers.filter(member => {
    const fullName = `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase();
    const designation = (member.designation || '').toLowerCase();
    const skills = Array.isArray(member.skills) ? member.skills.join(' ').toLowerCase() : '';
    const q = searchQuery.toLowerCase();

    const matchesSearch = fullName.includes(q) || designation.includes(q) || skills.includes(q);
    const matchesDept = selectedDept === 'All' || member.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Team Hero Header */}
      <section className="bg-slate-950 py-10 sm:py-14 md:py-16 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 shadow-xs backdrop-blur-md mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 text-xs font-semibold uppercase tracking-widest">
              Our People & Experts
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Engineering & Tech Team</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            The skilled engineers, architects, and analysts driving innovation, scalability, and digital excellence at PaulTech Software Services.
          </p>

          {/* Quick Filter & Search Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, role, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
              />
            </div>

            {/* Department Filter Pills if multiple departments exist */}
            {departments.length > 2 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 shrink-0">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedDept === dept
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Members Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {isLoading ? (
          <CardGridSkeleton count={3} />
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl">
              <FiUsers />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Team Members Found</h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              {searchQuery ? 'Try clearing your search term to see all members.' : 'Our team is growing! Check back soon.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-stretch gap-8 sm:gap-10">
            {filteredMembers.map((member) => (
              <div key={member._id} className="flex justify-center">
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
