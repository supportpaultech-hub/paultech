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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 shadow-xs backdrop-blur-md mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              About PaulTech
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Building The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Future of IT</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            We are a visionary IT company transforming bold ideas into world-class digital products and enterprise software.
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
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mb-6 sm:mb-8 rounded-full"></div>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6">
              PaulTech Software Services Pvt Ltd. started with a simple yet powerful mission: to bring Silicon Valley-level technology and engineering practices to businesses in India and beyond. 
            </p>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
              We specialize in custom software, ERP implementations, and mobile apps. Our agile startup culture allows us to move fast, adapt to cutting-edge technologies, and deliver unmatched value to our clients—from local enterprises to global brands.
            </p>
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
      <section className="py-12 sm:py-16 md:py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Ambient glow accent background */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-orange-500/15 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-orange-400 font-semibold tracking-widest text-xs sm:text-sm uppercase bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
              Visionary Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Meet Our Founders & Leadership
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-400 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Box 1: Left - Abhijeet Paul */}
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl flex flex-col justify-between hover:border-orange-500/40 transition-all duration-300 group">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center sm:items-start lg:items-center xl:items-start gap-6">
                {/* Image */}
                <div className="shrink-0 w-52 sm:w-56 lg:w-48 xl:w-52 aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-500/30">
                  <img 
                    src="/images/team/abhijeet-paul.jpg" 
                    alt="Mr. Abhijeet Paul - Co-Founder & Director" 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://ui-avatars.com/api/?name=Abhijeet+Paul&background=F97316&color=fff&size=500";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <h3 className="text-lg font-bold text-white tracking-wide">Abhijeet Paul</h3>
                    <p className="text-orange-400 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Co-Founder & Director</p>
                  </div>
                </div>

                {/* Info & Bio */}
                <div className="flex-1 min-w-0 space-y-3.5 text-center sm:text-left lg:text-center xl:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold">
                    <span>⭐ 10+ Yrs IT & SAP Leadership | TSF</span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                    "Vast expertise in SAP Technology, enterprise administration, and strategic decision-making."
                  </h4>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                    <strong className="text-white font-semibold">Abhijeet Paul</strong> graduated in Commerce and earned his <strong className="text-white font-semibold">MBA from Shobhit University</strong>. Associated with <strong className="text-white font-semibold">Tata Steel Foundation (TSF)</strong>, he brings over 10 years of active experience in IT.
                  </p>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                    He possesses hands-on expertise in core SAP modules (<strong className="text-white font-semibold">FICO, MM, PS, SD</strong>) and leads corporate administration, governance, and business expansion.
                  </p>
                </div>
              </div>

              {/* Stat badges */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 mt-5 border-t border-slate-700/60 text-center">
                <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/50">
                  <div className="text-orange-400 text-xs font-bold">SAP Modules</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">FICO, MM, PS, SD</div>
                </div>
                <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/50">
                  <div className="text-emerald-400 text-xs font-bold">Education</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">MBA, Shobhit Univ.</div>
                </div>
                <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/50">
                  <div className="text-amber-400 text-xs font-bold">Experience</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">10+ Years IT</div>
                </div>
              </div>
            </div>

            {/* Box 2: Right - Surjit Paul */}
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center sm:items-start lg:items-center xl:items-start gap-6">
                {/* Image */}
                <div className="shrink-0 w-52 sm:w-56 lg:w-48 xl:w-52 aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-500/30">
                  <img 
                    src="/images/team/surjit-paul.jpg" 
                    alt="Mr. Surjit Paul - Co-Founder" 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/team/default-avatar.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-center">
                    <h3 className="text-lg font-bold text-white tracking-wide">Surjit Paul</h3>
                    <p className="text-cyan-400 text-[11px] font-semibold uppercase tracking-wider mt-0.5">Co-Founder</p>
                  </div>
                </div>

                {/* Info & Bio */}
                <div className="flex-1 min-w-0 space-y-3.5 text-center sm:text-left lg:text-center xl:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                    <span>🎓 Ph.D. Scholar IIT Kharagpur | GATE & NET</span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                    "Pioneering research in Information Systems Security and advanced computing systems."
                  </h4>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                    <strong className="text-white font-semibold">Surjit Paul</strong> obtained his <strong className="text-white font-semibold">B.Sc IT (Hons), MCA, and M.Tech (CSE)</strong> from <strong className="text-white font-semibold">Ranchi University</strong>, <strong className="text-white font-semibold">BPUT</strong>, and <strong className="text-white font-semibold">NIT Jamshedpur</strong>. He qualified <strong className="text-white font-semibold">GATE and NET</strong> in Computer Science.
                  </p>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                    He completed an M.Tech summer internship at <strong className="text-white font-semibold">IIM Indore</strong> and worked in the IT industry for nearly a year. Currently, he is pursuing his <strong className="text-white font-semibold">Ph.D. in Information Systems Security at IIT Kharagpur</strong>.
                  </p>
                </div>
              </div>

              {/* Stat badges */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 mt-5 border-t border-slate-700/60 text-center">
                <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/50">
                  <div className="text-cyan-400 text-xs font-bold">Ph.D. Research</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">IIT Kharagpur</div>
                </div>
                <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/50">
                  <div className="text-emerald-400 text-xs font-bold">Post Graduation</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">M.Tech (NIT), MCA</div>
                </div>
                <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700/50">
                  <div className="text-amber-400 text-xs font-bold">Internship & IT</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">IIM Indore & IT Exp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision (Modern Cards) */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            
            {/* Mission */}
            <div className="group relative bg-[#0B0F19] rounded-2xl p-6 sm:p-8 md:p-10 overflow-hidden cursor-pointer shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full group-hover:bg-orange-500/40 transition-colors duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Our Mission</h2>
                <p className="text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed">
                  To empower businesses globally by providing innovative, scalable, and affordable IT solutions. We strive to be the ultimate technology partner, helping our clients navigate digital transformation seamlessly.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="group relative bg-blue-600 rounded-2xl p-6 sm:p-8 md:p-10 overflow-hidden cursor-pointer shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full group-hover:bg-white/40 transition-colors duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Our Vision</h2>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                  To become a globally recognized software development powerhouse known for engineering excellence, rapid innovation, and pushing the boundaries of what technology can achieve for enterprises.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Grid */}
      <section className="py-12 sm:py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h4 className="text-blue-600 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-2">The PaulTech Advantage</h4>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">Why Partner With Us?</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { title: 'Agile Startup Culture', desc: 'We move fast, adapt quickly, and implement the latest tech stacks without legacy corporate red tape.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { title: 'Enterprise Quality', desc: 'Startup speed meets enterprise reliability. Our code goes through rigorous QA for flawless execution.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            { title: 'Client-Centric DNA', desc: 'Your success is our KPI. We act as an extension of your own team, fully invested in your digital growth.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
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

      {/* CTA */}
      <section className="bg-slate-900 text-white py-12 sm:py-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Let's Build Something Great Together</h2>
          <p className="text-slate-400 mb-8 sm:mb-10 text-sm sm:text-base lg:text-lg">Looking for a reliable technology partner? We are ready to take your project to the next level.</p>
          <Link to="/contact" className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-colors duration-300 shadow-xl shadow-orange-500/20 inline-block">
            Start A Conversation
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default About;
