import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FuturisticGlobe3DCanvas from './FuturisticGlobe3DCanvas';

const rotatingServices = [
  {
    id: 'software-dev',
    name: 'Software Dev',
    tag: 'Web & Mobile Apps',
    borderColor: 'border-cyan-500/30 hover:border-cyan-400',
    glowShadow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    badgeBg: 'bg-cyan-500/15',
    badgeBorder: 'border-cyan-500/30',
    dotColor: 'bg-cyan-400',
    icon: (
      <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    )
  },
  {
    id: 'cloud-services',
    name: 'Cloud Services',
    tag: 'AWS & DevOps Infra',
    borderColor: 'border-sky-500/30 hover:border-sky-400',
    glowShadow: 'hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]',
    badgeBg: 'bg-sky-500/15',
    badgeBorder: 'border-sky-500/30',
    dotColor: 'bg-sky-400',
    icon: (
      <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        <polyline points="12 13 12 9" />
        <polyline points="9 11 12 9 15 11" />
      </svg>
    )
  },
  {
    id: 'ai-automation',
    name: 'AI & Automation',
    tag: 'Neural & Smart Bots',
    borderColor: 'border-purple-500/30 hover:border-purple-400',
    glowShadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-500/30',
    dotColor: 'bg-purple-400',
    icon: (
      <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    )
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    tag: 'BI & Analytics',
    borderColor: 'border-pink-500/30 hover:border-pink-400',
    glowShadow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]',
    badgeBg: 'bg-pink-500/15',
    badgeBorder: 'border-pink-500/30',
    dotColor: 'bg-pink-400',
    icon: (
      <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <polyline points="4 8 10 3 16 8 20 4" />
      </svg>
    )
  },
  {
    id: 'erp-solutions',
    name: 'ERP Solutions',
    tag: 'Enterprise SAP',
    borderColor: 'border-amber-500/30 hover:border-amber-400',
    glowShadow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/30',
    dotColor: 'bg-amber-400',
    icon: (
      <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    )
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    tag: 'Zero-Trust Sec',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400',
    glowShadow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    icon: (
      <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    )
  }
];

const AboutServicesShowcase = () => {
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);

  return (
    <div className="relative flex items-center justify-center h-[310px] sm:h-[480px] lg:h-[600px] min-h-[300px] sm:min-h-[460px] lg:min-h-[580px] w-full max-w-[350px] sm:max-w-none mx-auto rounded-3xl bg-gradient-to-br from-slate-950 via-[#070b14] to-black border border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(249,115,22,0.06),inset_0_1px_1px_rgba(255,255,255,0.08)] overflow-hidden sm:overflow-visible group">
      {/* Keyframe Styles for Smooth Clockwise Orbit & Counter-Rotation */}
      <style>{`
        @keyframes paultechAboutOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes paultechAboutCounter {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .paultech-about-system {
          --orbit-r: 88px;
        }
        @media (min-width: 375px) {
          .paultech-about-system {
            --orbit-r: 96px;
          }
        }
        @media (min-width: 440px) {
          .paultech-about-system {
            --orbit-r: 118px;
          }
        }
        @media (min-width: 640px) {
          .paultech-about-system {
            --orbit-r: 180px;
          }
        }
        @media (min-width: 1024px) {
          .paultech-about-system {
            --orbit-r: 215px;
          }
        }
        @media (min-width: 1280px) {
          .paultech-about-system {
            --orbit-r: 235px;
          }
        }
      `}</style>

      {/* Subtle Ambient Brand Glow Orbs */}
      <div className="absolute top-[-5%] right-[-5%] w-72 h-72 bg-orange-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Modern Subtle Dark Dot Grid Pattern */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px'
        }}
      />


      {/* Center 3D PaulTech "P" Particle Canvas */}
      <div className="relative w-full h-full flex items-center justify-center z-10">
        <FuturisticGlobe3DCanvas />
      </div>

      {/* Orbit System Layer with 6 Revolving Services */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none paultech-about-system z-20">
        {/* Subtle Ambient Orbit Path Rings */}
        <div 
          className="absolute rounded-full border border-white/10 border-dashed pointer-events-none"
          style={{
            width: 'calc(var(--orbit-r) * 2)',
            height: 'calc(var(--orbit-r) * 2)'
          }}
        />
        <div 
          className="absolute rounded-full border border-white/5 pointer-events-none"
          style={{
            width: 'calc(var(--orbit-r) * 2 + 10px)',
            height: 'calc(var(--orbit-r) * 2 + 10px)'
          }}
        />

        {/* Clockwise Orbit Master Pivot Container (16s Dynamic Speed) */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            animation: 'paultechAboutOrbit 16s linear infinite',
            animationPlayState: isOrbitPaused ? 'paused' : 'running'
          }}
        >
          {rotatingServices.map((service, index) => {
            // 6 Evenly Distributed Angles on circle (60 deg intervals, starting top at -90 deg)
            const angleDeg = (index * 60) - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const cosVal = Number(Math.cos(angleRad).toFixed(4));
            const sinVal = Number(Math.sin(angleRad).toFixed(4));

            return (
              <div
                key={service.id}
                style={{
                  left: `calc(50% + (${cosVal} * var(--orbit-r)))`,
                  top: `calc(50% + (${sinVal} * var(--orbit-r)))`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute"
                onMouseEnter={() => setIsOrbitPaused(true)}
                onMouseLeave={() => setIsOrbitPaused(false)}
              >
                {/* Counter-Rotate so Badge remains perfectly horizontal & upright */}
                <div
                  style={{
                    animation: 'paultechAboutCounter 16s linear infinite',
                    animationPlayState: isOrbitPaused ? 'paused' : 'running'
                  }}
                  className="pointer-events-auto"
                >
                  <Link 
                    to="/services"
                    className={`block bg-slate-900/90 hover:bg-slate-850 border ${service.borderColor} rounded-full py-0.5 px-2 sm:py-2 sm:px-3.5 backdrop-blur-xl shadow-[0_6px_20px_rgba(0,0,0,0.5)] ${service.glowShadow} transition-all duration-300 group/pill hover:scale-105 sm:hover:scale-110 active:scale-95`}
                  >
                    <div className="flex items-center gap-1 sm:gap-2.5">
                       {/* Round Icon Disc */}
                      <div className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full ${service.badgeBg} border ${service.badgeBorder} flex items-center justify-center shrink-0 shadow-sm group-hover/pill:scale-110 transition-transform [&>svg]:w-2.5 [&>svg]:h-2.5 sm:[&>svg]:w-4 sm:[&>svg]:h-4`}>
                        {service.icon}
                      </div>
                      {/* Service Info */}
                      <div className="text-left pr-0.5 sm:pr-2">
                        <h4 className="text-[8.5px] sm:text-xs font-bold text-slate-100 tracking-wide whitespace-nowrap group-hover/pill:text-white">
                          {service.name}
                        </h4>
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${service.dotColor} animate-pulse`} />
                          <span className="text-[7px] sm:text-[9px] text-slate-400 font-medium whitespace-nowrap group-hover/pill:text-slate-300">
                            {service.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AboutServicesShowcase;
