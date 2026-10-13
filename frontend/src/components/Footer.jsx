import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiLinkedin, 
  FiTwitter, 
  FiInstagram, 
  FiGithub, 
  FiYoutube, 
  FiEye, 
  FiClock, 
  FiCheckCircle, 
  FiSend, 
  FiShield, 
  FiArrowRight 
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    // Increment & fetch visitor count once per session
    const fetchVisitors = async () => {
      try {
        const hasVisitedSession = sessionStorage.getItem('paultech_visited');
        if (!hasVisitedSession) {
          // New session -> call increment endpoint
          const res = await axios.get(`${API_BASE_URL}/api/visitors`);
          setVisitorCount(res.data.count);
          sessionStorage.setItem('paultech_visited', 'true');
        } else {
          // Already incremented in this session -> fetch current count
          const res = await axios.get(`${API_BASE_URL}/api/visitors`);
          setVisitorCount(res.data.count);
        }
      } catch (err) {
        console.error('Error loading visitor count:', err);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <footer className="bg-[#090D16] text-slate-400 pt-12 sm:pt-16 pb-8 sm:pb-10 border-t border-white/10 mt-auto relative overflow-hidden">
      {/* Ambient Top Glow Orbs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-32 bg-orange-500/10 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 translate-x-1/2 w-96 h-32 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* 2. Comprehensive 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 lg:gap-8 pb-10 sm:pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Credibility (3 Cols) */}
          <div className="sm:col-span-2 md:col-span-6 lg:col-span-3 pr-0 lg:pr-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <img 
                src="/logo.png" 
                alt="PaulTech Software Services" 
                className="h-9 sm:h-10 w-auto object-contain bg-white/95 px-2 py-1 rounded-lg shadow-md group-hover:scale-105 transition-transform" 
              />
            </Link>
            
            <p className="text-xs sm:text-sm leading-relaxed mb-5 font-light text-slate-400">
              Engineering digital excellence. We build scalable software, enterprise web applications, and empower future software engineers through industry-aligned industrial training.
            </p>

            {/* Trust Badges */}
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium w-full">
                <FiShield className="text-orange-400 shrink-0" />
                <span className="truncate">Govt. Recognized MSME Enterprise</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium w-full">
                <FiCheckCircle className="text-emerald-400 shrink-0" />
                <span className="truncate">MoU Partner with 4+ Leading Universities</span>
              </div>
            </div>

            {/* Social Icons with Brand Hover Colors */}
            <div className="flex gap-2.5">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-[#0A66C2] hover:border-[#0A66C2] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#0A66C2]/30 hover:-translate-y-0.5 cursor-pointer"
              >
                <FiLinkedin size={16} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-[#24292e] hover:border-[#24292e] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-slate-900/50 hover:-translate-y-0.5 cursor-pointer"
              >
                <FiGithub size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-[#1DA1F2] hover:border-[#1DA1F2] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#1DA1F2]/30 hover:-translate-y-0.5 cursor-pointer"
              >
                <FiTwitter size={16} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:border-rose-400 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 cursor-pointer"
              >
                <FiInstagram size={16} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-[#FF0000] hover:border-[#FF0000] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#FF0000]/30 hover:-translate-y-0.5 cursor-pointer"
              >
                <FiYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Our Services (2 Cols) */}
          <div className="sm:col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Services
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-light">
              <li>
                <Link to="/services" className="hover:text-orange-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-orange-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  Mobile App Dev
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-orange-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  Cloud & Microservices
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-orange-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  UI/UX & Branding
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-orange-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  IT Strategy & Consulting
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-orange-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  SEO & Digital Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academics & Programs (2 Cols) */}
          <div className="sm:col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Programs
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-light">
              <li>
                <Link to="/internships" className="hover:text-cyan-300 hover:translate-x-1 transition-all duration-200 inline-block">
                  Industrial Internship
                </Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="hover:text-cyan-300 hover:translate-x-1 transition-all duration-200 inline-block">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-cyan-300 hover:translate-x-1 transition-all duration-200 inline-block">
                  Bootcamps & Events
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-cyan-300 hover:translate-x-1 transition-all duration-200 inline-block">
                  Projects & Portfolio
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-cyan-300 hover:translate-x-1 transition-all duration-200 inline-block">
                  Digital Asset Store
                </Link>
              </li>
              <li>
                <Link to="/student-app" className="hover:text-cyan-300 hover:translate-x-1 transition-all duration-200 inline-block">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links / Company (2 Cols) */}
          <div className="sm:col-span-1 md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-light">
              <li>
                <Link to="/about" className="hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  About PaulTech
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  Our Leadership Team
                </Link>
              </li>
              <li>
                <Link to="/clients" className="hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  Clients & Partners
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2">
                  <span>Careers</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Hiring
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  Life at PaulTech
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Get In Touch (3 Cols for ample width) */}
          <div className="sm:col-span-1 md:col-span-3 lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 sm:mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Get In Touch
            </h4>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm font-light">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="mt-1 shrink-0 text-orange-500" />
                <span className="leading-relaxed">
                  34, 1st Floor, Pacific Height, Aambagan,<br className="hidden sm:inline" /> Sakchi, Jamshedpur - 831001
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-orange-500 shrink-0" />
                <a href="tel:+917209986943" className="hover:text-orange-400 transition-colors whitespace-nowrap">
                  +91 7209986943
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-orange-500 shrink-0" />
                <a href="mailto:hr@paultechsoftwareservices.com" className="hover:text-orange-400 transition-colors whitespace-nowrap">
                  hr@paultechsoftwareservices.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 pt-1 text-[11px] sm:text-xs text-slate-400">
                <FiClock className="text-orange-500 shrink-0" />
                <span className="whitespace-nowrap">Mon – Sat: 9:30 AM – 6:30 PM (IST)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Bottom Sub-Footer Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6 text-xs font-light text-center lg:text-left">
          
          <div className="space-y-1">
            <p>&copy; {new Date().getFullYear()} PaulTech Software Services (OPC) Pvt. Ltd. All Rights Reserved.</p>
            <p className="text-[11px] text-slate-500">
              Registered under Ministry of Corporate Affairs (MCA), Govt. of India.
            </p>
          </div>

          {/* Real-time Website Visitor Counter Badge */}
          <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 shadow-inner">
            <FiEye className="text-orange-500 animate-pulse" />
            <span className="text-slate-400">Total Site Visitors:</span>
            <span className="font-mono font-bold text-white bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-md border border-orange-500/30">
              {visitorCount ? visitorCount.toLocaleString() : '1,806'}
            </span>
          </div>

          {/* Quick Legal & Portal Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 text-xs">
            <Link 
              to="/login" 
              className="text-orange-400 hover:text-orange-300 font-semibold px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/25 transition-colors"
            >
              Employee Portal
            </Link>
            <Link 
              to="/admin-login" 
              className="hover:text-slate-200 text-slate-400 transition-colors"
            >
              Admin Access
            </Link>
            <Link 
              to="/contact" 
              className="hover:text-slate-200 text-slate-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/contact" 
              className="hover:text-slate-200 text-slate-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
