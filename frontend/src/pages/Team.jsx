import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiMail, 
  FiGithub, 
  FiLinkedin, 
  FiBriefcase, 
  FiCode, 
  FiUser, 
  FiFolder
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const MemberCard = ({ member, isLeader = false }) => {
  const fullName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Team Member';
  const designation = member.designation || member.role || 'Software Developer';
  const imageSrc = member.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1e293b&color=f97316&size=600&bold=true`;
  const bio = member.bio || '';
  const skills = Array.isArray(member.skills) 
    ? member.skills 
    : (typeof member.skills === 'string' && member.skills ? member.skills.split(',') : []);

  // Leaders retain their original executive size; Core team members get uniform, slightly more compact dimensions
  const cardSizeClasses = isLeader
    ? "w-[300px] sm:w-[330px] md:w-[350px] h-[470px] sm:h-[490px]"
    : "w-[250px] sm:w-[265px] md:w-[275px] h-[380px] sm:h-[400px]";

  const titleSizeClasses = isLeader
    ? "text-2xl sm:text-[26px]"
    : "text-lg sm:text-xl";

  const designationSizeClasses = isLeader
    ? "text-sm sm:text-base"
    : "text-xs sm:text-[13px]";

  const paddingClasses = isLeader ? "p-6 sm:p-7" : "p-4 sm:p-5";
  const bottomOverlayClasses = isLeader ? "bottom-6 left-6 right-6" : "bottom-4 left-4 right-4";

  return (
    <div className={`group [perspective:1400px] ${cardSizeClasses} shrink-0 cursor-pointer select-none`}>
      {/* 3D Flipper Box */}
      <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-[0_12px_35px_-8px_rgba(0,0,0,0.18)] group-hover:shadow-[0_20px_45px_-6px_rgba(249,115,22,0.32)]">
        
        {/* ================= FRONT FACE (Full Box Image + Vignette + Bottom Left Name & Designation) ================= */}
        <div className="absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden [backface-visibility:hidden] bg-slate-900 border border-slate-200/40">
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
          <div className="absolute inset-0 rounded-[24px] sm:rounded-[28px] ring-1 ring-inset ring-white/15 pointer-events-none" />

          {/* Bottom-Left Overlay: Name & Designation */}
          <div className={`absolute ${bottomOverlayClasses} text-left z-20`}>
            <h3 className={`${titleSizeClasses} font-black text-white tracking-tight leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]`}>
              {fullName}
            </h3>

            <p className={`${designationSizeClasses} font-semibold text-orange-400 mt-0.5 flex items-center gap-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]`}>
              {designation}
            </p>

            {member.experience && (
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-300 mt-1 flex items-center gap-1.5">
                <FiBriefcase className="text-orange-400 shrink-0" size={11} />
                <span className="truncate">{member.experience}</span>
              </p>
            )}

            {/* Glowing Accent Line */}
            <div className="w-10 h-0.5 sm:h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-2 transition-all duration-500 group-hover:w-20" />
          </div>
        </div>

        {/* ================= BACK FACE (3D Flip) ================= */}
        <div className={`absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-orange-500/40 ${paddingClasses} flex flex-col justify-between text-left text-white shadow-2xl relative`}>
          
          {/* Ambient Glows */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Back Top: Mini Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                {member.firstName?.charAt(0) || 'P'}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">{fullName}</h4>
                <p className="text-[10px] sm:text-[11px] text-orange-400 font-medium truncate">{designation}</p>
              </div>
            </div>
          </div>

          {/* Back Middle: About (Only if user has written bio) + Skills + Projects */}
          <div className="relative z-10 space-y-2.5 my-auto py-1">
            {bio && bio.trim() && (
              <div>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-orange-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <FiUser size={11} /> About
                </span>
                <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed font-light line-clamp-4 bg-white/[0.04] p-2.5 rounded-xl border border-white/5 backdrop-blur-xs">
                  "{bio}"
                </p>
              </div>
            )}

            {/* Tech Stack / Skills Badges */}
            {skills.length > 0 && (
              <div>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <FiCode size={11} /> Tech Stack & Skills
                </span>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto custom-scrollbar">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-200 text-[9px] sm:text-[10px] font-semibold font-mono"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience & Projects */}
            <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[10px]">
              {member.experience && (
                <div className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[9px] block flex items-center gap-1">
                    <FiBriefcase size={10} className="text-orange-400" /> Experience
                  </span>
                  <span className="font-semibold text-slate-200 truncate block mt-0.5">{member.experience}</span>
                </div>
              )}
              {member.projects && (
                <div className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[9px] block flex items-center gap-1">
                    <FiFolder size={10} className="text-orange-400" /> Project
                  </span>
                  <span className="font-semibold text-slate-200 truncate block mt-0.5">{member.projects}</span>
                </div>
              )}
            </div>
          </div>

          {/* Back Bottom: Socials & Connect */}
          <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
              {member.employeeId ? `ID: ${member.employeeId}` : 'PaulTech Core'}
            </span>

            <div className="flex items-center gap-1.5">
              {member.linkedin && (
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-orange-600 text-white transition-all hover:scale-110"
                  title="LinkedIn Profile"
                >
                  <FiLinkedin size={13} />
                </a>
              )}
              {member.github && (
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-orange-600 text-white transition-all hover:scale-110"
                  title="GitHub Profile"
                >
                  <FiGithub size={13} />
                </a>
              )}
              {member.username && (
                <a 
                  href={`mailto:${member.username}`}
                  className="p-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all hover:scale-110"
                  title="Send Corporate Email"
                >
                  <FiMail size={13} />
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

  // Top Leaders (Daljeet Paul & Devashis Kumar kept at their prominent original size)
  const leaders = [
    {
      _id: 'leader-1',
      firstName: 'Daljeet',
      lastName: 'Paul',
      designation: 'CFO',
      experience: '8+ Years in HR & Finance',
      projects: 'Finance & HR Strategy',
      img: '/images/team/daljeet-paul.png',
      bio: ''
    },
    {
      _id: 'leader-2',
      firstName: 'Devashis',
      lastName: 'Kumar',
      designation: 'Project Manager',
      experience: '5+ Years in IT Field',
      projects: 'IT Delivery & Operations',
      img: '/images/team/devashis-kumar.jpg',
      bio: ''
    }
  ];

  // Core team members from database (excluding Daljeet and Devashis to avoid duplicate cards)
  const coreMembers = teamMembers.filter(m => {
    const fName = (m.firstName || '').toLowerCase().trim();
    return fName !== 'daljeet' && fName !== 'devashis' && fName !== 'devashish';
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
              Our People
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Leadership & Team</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            The innovative minds and industry experts guiding PaulTech Software Services toward digital excellence.
          </p>
        </div>
      </section>

      {/* Main Members Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        {isLoading ? (
          <CardGridSkeleton count={4} />
        ) : (
          <>
            {/* Top Superiors / Leadership Section (Unaffected, original prominent size) */}
            <div className="flex flex-wrap justify-center items-stretch gap-8 sm:gap-10 max-w-5xl mx-auto">
              {leaders.map((leader) => (
                <div key={leader._id} className="flex justify-center">
                  <MemberCard member={leader} isLeader={true} />
                </div>
              ))}
            </div>

            {/* Core Team Section from Database (Uniform, exactly equal, slightly more compact boxes) */}
            <div className="pt-8 sm:pt-12 border-t border-slate-200">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 sm:mb-10 text-slate-800">
                Our Core Team
              </h2>

              {coreMembers.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Our team is growing! Check back later to meet them.
                </div>
              ) : (
                <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 max-w-6xl mx-auto">
                  {coreMembers.map((member) => (
                    <div key={member._id} className="flex justify-center">
                      <MemberCard member={member} isLeader={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Team;
