import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/employees`);
        // Filter out if needed, or just set all employees
        setTeamMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch team members", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const leaders = [
    {
      _id: 'leader-1',
      firstName: 'Daljeet',
      lastName: 'Paul',
      designation: 'CFO',
      experience: '8+ Years of Experience in HR & Finance',
      img: '/images/team/daljeet-paul.png'
    },
    {
      _id: 'leader-2',
      firstName: 'Devashis',
      lastName: 'Kumar',
      designation: 'Project Manager',
      experience: '5+ years of experience in IT Field',
      img: '/images/team/devashis-kumar.jpg'
    }
  ];

  const membersList = teamMembers
    .filter(m => m.firstName !== 'Daljeet' && m.firstName !== 'Devashis')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const MemberCard = ({ member }) => (
    <div className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_12px_35px_-8px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] border border-slate-200 hover:shadow-2xl hover:shadow-orange-500/25 hover:border-orange-500/40 hover:-translate-y-2 transition-all duration-300 w-full h-full flex flex-col">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-4 bg-slate-100 aspect-[4/5] w-full shrink-0 shadow-sm border border-slate-100">
        <img
          src={member.img ? member.img : `https://ui-avatars.com/api/?name=${member.firstName || 'T'}+${member.lastName || 'M'}&background=random&size=400`}
          alt={member.firstName}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-grow justify-between text-center">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {member.firstName} {member.lastName}
          </h3>
          <p className="text-orange-600 font-semibold text-xs sm:text-sm mt-1">
            {member.designation || 'Team Member'}
          </p>
        </div>
        {member.experience && (
          <div className="flex items-center justify-center gap-1.5 text-slate-600 text-[11px] sm:text-xs mt-3 font-semibold bg-slate-100/90 w-max max-w-full mx-auto px-3 py-1.5 rounded-lg border border-slate-200/80 text-center mt-auto shadow-xs">
            <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span className="truncate">
              {(() => {
                const expText = String(member.experience);
                let text = expText.toLowerCase().includes('year') ? expText : `${expText} Experience`;
                if (member.designation && !expText.toLowerCase().includes(' as ') && !expText.toLowerCase().includes(' in ')) {
                  text += ` as ${member.designation}`;
                }
                return text;
              })()}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Team Hero Header */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 shadow-xs backdrop-blur-md mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              Our People
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Leadership & Team</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            The innovative minds and industry experts guiding PaulTech Software Services toward digital excellence.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <CardGridSkeleton count={4} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12 sm:space-y-16">

          {/* Superiors Section */}
          <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 max-w-5xl mx-auto">
            {leaders.map(member => (
              <div key={member._id} className="w-full max-w-[290px] sm:max-w-[320px] flex">
                <MemberCard member={member} />
              </div>
            ))}
          </div>

          {/* Regular Members Section */}
          <div className="pt-8 sm:pt-10 border-t border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-10 text-slate-800">Our Core Team</h2>

            {membersList.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">Our team is growing! Check back later to meet them.</div>
            ) : (
              <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 max-w-6xl mx-auto">
                {membersList.map(member => (
                  <div key={member._id} className="w-full max-w-[290px] sm:max-w-[320px] flex">
                    <MemberCard member={member} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Team;
