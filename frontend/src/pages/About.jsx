import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AboutTechTerminal from '../components/AboutTechTerminal';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-orange-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            About PaulTech
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Building The Future of IT
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            We are an IT company transforming bold ideas into world-class digital products and enterprise software.
          </p>
        </div>
      </section>

      {/* 2. Who We Are (Split Layout) */}
      <section className="py-12 sm:py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2">
            <h4 className="text-blue-600 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-2">Our Story</h4>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4 sm:mb-6">Driven By Innovation, Built On Trust.</h2>
            <div className="space-y-4 mb-6 sm:mb-8 text-slate-600 text-sm sm:text-base leading-relaxed text-justify">
              <p>
                Based in Jamshedpur, Jharkhand, <strong className="font-bold text-slate-900">PaulTech Software Services Pvt. Ltd.</strong> was established to bring modern technology, industry best practices, and innovative engineering solutions to businesses in India and beyond. We specialize in customized software development, enterprise ERP implementation &amp; support, mobile applications, and comprehensive IT solutions tailored to diverse enterprise needs.
              </p>
              <p>
                Driven by innovation, agility, and a commitment to excellence, we combine deep technical expertise with business insight to deliver scalable, secure, and cost-effective digital architectures. Alongside our core engineering services, we offer industry-oriented training and internship programs to prepare the next generation of tech talent. At <strong className="font-bold text-slate-900">PaulTech</strong>, we are committed to building enduring partnerships grounded in quality, transparency, and continuous learning.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-4 sm:gap-8">
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800">10+</h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Years Exp.</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-slate-200 hidden sm:block"></div>
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800">50+</h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Projects Delivered</p>
              </div>
              <div className="w-px h-10 sm:h-12 bg-slate-200 hidden sm:block"></div>
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800">99%</h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wide">Client Retention</p>
              </div>
            </div>
          </div>
          
          {/* Right: Interactive Developer Terminal */}
          <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0">
            <AboutTechTerminal />
          </div>
        </div>
      </section>

      {/* 2.5 Founders Spotlight Section */}
      <section className="py-10 sm:py-16 md:py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Ambient glow accent background */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-orange-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
              Leadership
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Meet Our Founders
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-stretch">
            {/* Box 1: Left - Abhijeet Paul */}
            <div className="bg-slate-800/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-700/60 shadow-xl flex flex-col justify-between hover:border-slate-600 transition-all duration-300">
              <div>
                {/* Header: Photo + Name/Role side-by-side */}
                <div className="flex items-center sm:items-start gap-3.5 sm:gap-5 mb-3.5 sm:mb-4">
                  <div className="w-20 h-24 sm:w-36 sm:h-44 md:w-40 md:h-48 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-700/80 shadow-md bg-slate-900">
                    <img 
                      src="/images/team/abhijeet-paul.jpg" 
                      alt="Abhijeet Paul - Co-Founder & Director" 
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://ui-avatars.com/api/?name=Abhijeet+Paul&background=1e293b&color=f97316&size=500";
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                      Abhijeet Paul
                    </h3>
                    <p className="text-orange-400 text-xs sm:text-sm font-semibold mt-0.5">
                      Co-Founder & Director
                    </p>
                    <p className="text-slate-400 text-[11px] sm:text-xs mt-1">
                      SAP Specialist • Tata Steel Foundation (TSF)
                    </p>
                    <p className="hidden sm:block text-slate-300 text-xs sm:text-sm mt-2.5 leading-relaxed font-light">
                      Graduated in Commerce and earned his MBA from Shobhit University. Over 10 years of active experience in IT and enterprise administration.
                    </p>
                  </div>
                </div>

                {/* Mobile Bio */}
                <p className="sm:hidden text-slate-300 text-xs leading-relaxed font-light mb-3">
                  Graduated in Commerce with an MBA from Shobhit University. Over 10 years of active IT experience with Tata Steel Foundation (TSF) and expertise in SAP modules (FICO, MM, PS, SD).
                </p>

                {/* Desktop Additional Bio */}
                <p className="hidden sm:block text-slate-300 text-xs sm:text-sm leading-relaxed font-light mb-4">
                  Possesses vast hands-on expertise in core SAP modules including <strong className="text-white font-medium">SAP FICO, MM, PS, and SD</strong>. Leads corporate administration, strategic expansion, and operational growth.
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-2 pt-3 sm:pt-4 border-t border-slate-700/60 text-center">
                <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-700/40">
                  <div className="text-orange-400 text-[11px] sm:text-xs font-bold">SAP Modules</div>
                  <div className="text-slate-400 text-[10px] sm:text-[11px] mt-0.5 truncate">FICO, MM, PS, SD</div>
                </div>
                <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-700/40">
                  <div className="text-slate-200 text-[11px] sm:text-xs font-bold">Education</div>
                  <div className="text-slate-400 text-[10px] sm:text-[11px] mt-0.5 truncate">MBA, Shobhit</div>
                </div>
                <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-700/40">
                  <div className="text-slate-200 text-[11px] sm:text-xs font-bold">Experience</div>
                  <div className="text-slate-400 text-[10px] sm:text-[11px] mt-0.5 truncate">10+ Years IT</div>
                </div>
              </div>
            </div>

            {/* Box 2: Right - Surjit Paul */}
            <div className="bg-slate-800/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-700/60 shadow-xl flex flex-col justify-between hover:border-slate-600 transition-all duration-300">
              <div>
                {/* Header: Photo + Name/Role side-by-side */}
                <div className="flex items-center sm:items-start gap-3.5 sm:gap-5 mb-3.5 sm:mb-4">
                  <div className="w-20 h-24 sm:w-36 sm:h-44 md:w-40 md:h-48 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-700/80 shadow-md bg-slate-900">
                    <img 
                      src="/images/team/surjit-paul.jpg" 
                      alt="Surjit Paul - Co-Founder" 
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/team/default-avatar.svg";
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                      Surjit Paul
                    </h3>
                    <p className="text-cyan-400 text-xs sm:text-sm font-semibold mt-0.5">
                      Co-Founder
                    </p>
                    <p className="text-slate-400 text-[11px] sm:text-xs mt-1">
                      Ph.D. Scholar, IIT Kharagpur • GATE & NET
                    </p>
                    <p className="hidden sm:block text-slate-300 text-xs sm:text-sm mt-2.5 leading-relaxed font-light">
                      B.Sc IT (Hons), MCA, and M.Tech in CSE from Ranchi University, BPUT, and NIT Jamshedpur. Qualified GATE and NET in Computer Science.
                    </p>
                  </div>
                </div>

                {/* Mobile Bio */}
                <p className="sm:hidden text-slate-300 text-xs leading-relaxed font-light mb-3">
                  B.Sc IT (Hons), MCA, and M.Tech from Ranchi Univ., BPUT, and NIT Jamshedpur. GATE & NET qualified with IIM Indore summer internship. Currently pursuing Ph.D. in InfoSec at IIT Kharagpur.
                </p>

                {/* Desktop Additional Bio */}
                <p className="hidden sm:block text-slate-300 text-xs sm:text-sm leading-relaxed font-light mb-4">
                  Completed an M.Tech summer internship at <strong className="text-white font-medium">IIM Indore</strong> and worked in the IT industry for nearly a year. Currently pursuing his <strong className="text-white font-medium">Ph.D. in Information Systems Security at IIT Kharagpur</strong>.
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-2 pt-3 sm:pt-4 border-t border-slate-700/60 text-center">
                <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-700/40">
                  <div className="text-cyan-400 text-[11px] sm:text-xs font-bold">Ph.D. Research</div>
                  <div className="text-slate-400 text-[10px] sm:text-[11px] mt-0.5 truncate">IIT Kharagpur</div>
                </div>
                <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-700/40">
                  <div className="text-slate-200 text-[11px] sm:text-xs font-bold">Post Grad</div>
                  <div className="text-slate-400 text-[10px] sm:text-[11px] mt-0.5 truncate">M.Tech (NIT), MCA</div>
                </div>
                <div className="bg-slate-900/60 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-700/40">
                  <div className="text-slate-200 text-[11px] sm:text-xs font-bold">Qualifications</div>
                  <div className="text-slate-400 text-[10px] sm:text-[11px] mt-0.5 truncate">GATE, NET, IIM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision (Modern Cards with Visual Harmony & Interactive Border Beam) */}
      <section className="py-10 sm:py-14 md:py-16 bg-white border-y border-slate-200">
        {/* Keyframe for Interactive Border Beam */}
        <style>{`
          @keyframes borderBeamRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Mission Card (Orange / Amber Glow) */}
            <div className="group relative rounded-2xl sm:rounded-3xl p-[3.5px] sm:p-[4.5px] md:p-[5px] bg-slate-800/80 overflow-hidden cursor-pointer hover:-translate-y-2 hover:scale-[1.015] transition-all duration-500 shadow-xl hover:shadow-[0_0_35px_rgba(249,115,22,0.45)] flex flex-col">
              {/* Luminous Neon Diffusion Layer (Thick Radiant Aura) */}
              <div 
                className="absolute inset-[-150%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-[6px]"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg 180deg, rgba(249,115,22,0.4) 240deg, #ea580c 290deg, #f97316 335deg, #ffffff 360deg)',
                  animation: 'borderBeamRotate 3.2s linear infinite'
                }}
              />

              {/* Crisp High-Intensity Border Beam Layer (Bold Visible Width) */}
              <div 
                className="absolute inset-[-150%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg 180deg, rgba(249,115,22,0.7) 240deg, #f97316 295deg, #fed7aa 345deg, #ffffff 360deg)',
                  animation: 'borderBeamRotate 3.2s linear infinite'
                }}
              />

              {/* Inner Dark Graphite Card */}
              <div className="relative z-10 w-full h-full bg-[#0B0F19] rounded-[calc(1rem-3.5px)] sm:rounded-[calc(1.5rem-5px)] p-6 sm:p-7 md:p-8 overflow-hidden flex flex-col justify-between flex-grow">
                {/* Light Sheen Sweep Overlay */}
                <div className="pointer-events-none absolute -inset-full w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                {/* Orange / Amber Ambient Glow */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-500/20 blur-[70px] rounded-full group-hover:scale-125 group-hover:bg-orange-500/40 transition-all duration-700 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-11 h-11 sm:w-13 sm:h-13 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3.5 sm:mb-4 backdrop-blur-md border border-white/10 group-hover:border-orange-500/40 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-orange-500/20 transition-all duration-500 shadow-sm">
                    {/* Modern Precision Target / Crosshair Icon for Mission */}
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 group-hover:text-orange-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-2.5 tracking-tight group-hover:text-orange-300 transition-colors">Our Mission</h2>
                  <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed text-justify">
                    To empower businesses globally by providing innovative, scalable, and affordable IT solutions. We strive to be the ultimate technology partner, helping our clients navigate digital transformation seamlessly.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card (Electric Cyan / Royal Blue Glow) */}
            <div className="group relative rounded-2xl sm:rounded-3xl p-[3.5px] sm:p-[4.5px] md:p-[5px] bg-slate-800/80 overflow-hidden cursor-pointer hover:-translate-y-2 hover:scale-[1.015] transition-all duration-500 shadow-xl hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] flex flex-col">
              {/* Luminous Neon Diffusion Layer (Thick Radiant Aura) */}
              <div 
                className="absolute inset-[-150%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-[6px]"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg 180deg, rgba(6,182,212,0.4) 240deg, #0284c7 290deg, #38bdf8 335deg, #ffffff 360deg)',
                  animation: 'borderBeamRotate 3.2s linear infinite'
                }}
              />

              {/* Crisp High-Intensity Border Beam Layer (Bold Visible Width) */}
              <div 
                className="absolute inset-[-150%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg 180deg, rgba(6,182,212,0.7) 240deg, #06b6d4 295deg, #bae6fd 345deg, #ffffff 360deg)',
                  animation: 'borderBeamRotate 3.2s linear infinite'
                }}
              />

              {/* Inner Dark Graphite Card */}
              <div className="relative z-10 w-full h-full bg-[#0B0F19] rounded-[calc(1rem-3.5px)] sm:rounded-[calc(1.5rem-5px)] p-6 sm:p-7 md:p-8 overflow-hidden flex flex-col justify-between flex-grow">
                {/* Light Sheen Sweep Overlay */}
                <div className="pointer-events-none absolute -inset-full w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                {/* Electric Cyan / Blue Ambient Glow */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/20 blur-[70px] rounded-full group-hover:scale-125 group-hover:bg-cyan-500/40 transition-all duration-700 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-11 h-11 sm:w-13 sm:h-13 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3.5 sm:mb-4 backdrop-blur-md border border-white/10 group-hover:border-cyan-400/40 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-cyan-500/20 transition-all duration-500 shadow-sm">
                    {/* Modern Strategic Compass / Guiding Star Icon for Vision */}
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.25" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-2.5 tracking-tight group-hover:text-cyan-300 transition-colors">Our Vision</h2>
                  <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed text-justify">
                    To become a globally recognized software development powerhouse known for engineering excellence, rapid innovation, and pushing the boundaries of what technology can achieve for enterprises.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Grid */}
      <section className="py-12 sm:py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h4 className="text-blue-600 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-2">What Sets Us Apart</h4>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">Why Partner With Us?</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { title: 'Agile Startup Culture', desc: 'We move fast, adapt quickly, and implement the latest tech stacks without legacy corporate red tape.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { title: 'Enterprise Quality', desc: 'Startup speed meets enterprise reliability. Our code goes through rigorous QA for flawless execution.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { title: 'Dedicated Partnership', desc: 'We don’t just write code and disappear. We work alongside you like an in-house team, with transparent communication and ongoing support.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-4">{item.title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-slate-200 py-12 sm:py-16 md:py-20 text-center relative overflow-hidden">
        {/* Subtle ambient background glow for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[220px] bg-gradient-to-r from-orange-100/50 via-blue-50/60 to-orange-100/50 blur-3xl rounded-full pointer-events-none -z-0" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3 sm:mb-4">
            Let's Build Something Great Together
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal">
            Looking for a reliable technology partner? We are ready to take your project to the next level.
          </p>
          <Link 
            to="/contact" 
            className="group inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm sm:text-base px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start A Conversation</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default About;
