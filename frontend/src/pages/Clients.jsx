import React, { useEffect } from 'react';

const Clients = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const clients = [
    { name: "Tata Steel", industry: "Manufacturing", img: "/tata-logo.jpg", desc: "Enterprise ERP integration and internal tooling." },
    { name: "TCS", industry: "IT Services", img: "/tcs-logo.png", desc: "Vendor management systems and secure API gateways." },
    { name: "Amrit Packers and Movers", industry: "Logistics & Supply Chain", img: "/amrit-packers-logo.jpg", desc: "Digital booking management, fleet tracking solutions, and web portal development." },
    { name: "Madadsathi", industry: "Emergency QR Platform", img: "/madadsathi-logo.jpg", desc: "Smart Emergency QR platform, instant alert dispatch system, and public safety infrastructure." },
    { name: "Tata Steel Foundation", industry: "Non-Profit", img: "/tsf-logo.png", desc: "Data analytics dashboards and reporting portals." },
    { name: "Suncraft Energy", industry: "Renewable", img: "/suncraft-logo.jpg", desc: "IoT monitoring platform and mobile apps." },
    { name: "EduSmart Academy", industry: "Education Technology", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80", desc: "E-learning platform with seamless video streaming." },
    { name: "TechVision India", industry: "Software", img: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80", desc: "B2B SaaS product design and architecture." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Clients Hero Header */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 shadow-xs backdrop-blur-md mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              Our Partnerships
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Trusted By <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Industry Leaders</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            We take pride in our long-term partnerships with some of the most respected organizations across various sectors.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
        {clients.map((client, idx) => (
          <div key={idx} className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150"></div>
            
            <div className="h-16 sm:h-20 md:h-24 w-full flex items-center justify-start mb-4 sm:mb-6">
              <img src={client.img} alt={client.name} className="max-h-full max-w-[130px] sm:max-w-[150px] object-contain opacity-100 transition-all duration-500" />
            </div>
            
            <div>
              <p className="text-[10px] sm:text-[11px] text-blue-600 font-bold uppercase tracking-widest mb-1.5 sm:mb-2">{client.industry}</p>
              <h4 className="font-bold text-slate-800 text-lg sm:text-xl mb-2 sm:mb-3">{client.name}</h4>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{client.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
