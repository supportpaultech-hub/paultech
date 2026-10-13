import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiMenu, FiX, FiHome, FiInfo, FiBriefcase, 
  FiShoppingBag, FiFolder, FiImage, FiUserPlus, 
  FiAward, FiMail, FiLock, FiChevronDown, FiChevronRight,
  FiUsers, FiUserCheck, FiVideo
} from 'react-icons/fi';
import BroadcastBanner from './BroadcastBanner';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleSubmenu = (name) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Handler for logo click -> Target/scroll to home section
  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  // FULL ORIGINAL NAV LINKS LIST
  const leftNavLinks = [
    {
      name: 'About Us',
      path: '/about',
      icon: FiInfo,
      subLinks: [
        { name: 'About Company', path: '/about', icon: FiInfo },
        { name: 'Our Team', path: '/team', icon: FiUsers },
        { name: 'Our Clients', path: '/clients', icon: FiUserCheck }
      ]
    },
    {
      name: 'Services',
      path: '/services',
      icon: FiBriefcase,
      subLinks: [
        { name: 'Our Services', path: '/services', icon: FiBriefcase },
        { name: 'Digital Store', path: '/store', icon: FiShoppingBag }
      ]
    },
    {
      name: 'Events',
      path: '/events',
      icon: FiVideo,
      subLinks: [
        { name: 'Live Events & Bootcamps', path: '/events', icon: FiVideo },
        { name: 'Photo Gallery', path: '/gallery', icon: FiImage }
      ]
    }
  ];

  const rightNavLinks = [
    { name: 'Portfolio', path: '/portfolio', icon: FiFolder },
    {
      name: 'Careers',
      path: '/careers',
      icon: FiUserPlus,
      subLinks: [
        { name: 'Full-Time Careers', path: '/careers', icon: FiBriefcase },
        { name: 'Industrial Internships', path: '/internships', icon: FiAward }
      ]
    },
    { name: 'Certificate', path: '/certificate', icon: FiAward },
    { name: 'Contact Us', path: '/contact', icon: FiMail }
  ];

  // Combine all links for Mobile view and Desktop navigation
  const classicNavLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    ...leftNavLinks,
    ...rightNavLinks
  ];

  return (
    <header className="sticky top-0 z-50 w-full font-sans transition-all duration-300">
      <BroadcastBanner />

      {/* Full-Width Fixed Liquid Glass Navbar */}
      <nav 
        style={{
          WebkitBackdropFilter: isScrolled ? 'blur(24px) saturate(180%)' : 'blur(16px) saturate(140%)',
          backdropFilter: isScrolled ? 'blur(24px) saturate(180%)' : 'blur(16px) saturate(140%)'
        }}
        className={`w-full transition-all duration-300 relative border-b ${
          isScrolled 
            ? 'bg-white/80 border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] py-2 sm:py-2.5' 
            : 'bg-white/65 border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.7)] py-2.5 sm:py-3'
        }`}
      >
        {/* Liquid Glass Highlight Accents */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo with Soft Glass Hover */}
          <Link 
            to="/" 
            onClick={handleLogoClick} 
            className="flex items-center p-1 rounded-xl transition-transform duration-300 hover:scale-105 shrink-0"
          >
            <img src="/logo.png" alt="PaulTech Software Services" className="h-7 sm:h-8 md:h-9 w-auto object-contain" />
          </Link>

          {/* Desktop Menu - Liquid Glass Pills */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {classicNavLinks.map((link) => {
              const isSubActive = link.subLinks?.some(sub => location.pathname === sub.path);
              const isActive = location.pathname === link.path || isSubActive;

              return link.subLinks ? (
                <div key={link.name} className="relative group">
                  <Link 
                    to={link.path || '#'} 
                    className={`text-xs xl:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 py-1.5 px-3 rounded-full ${
                      isActive 
                        ? 'text-orange-600 font-bold bg-orange-500/12 border border-orange-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]' 
                        : 'text-slate-800 hover:text-orange-600 hover:bg-white/40 hover:shadow-xs'
                    }`}
                  >
                    <span>{link.name}</span>
                    <FiChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 opacity-70 group-hover:opacity-100" />
                  </Link>

                  {/* Liquid Glass Floating Dropdown Panel */}
                  <div 
                    style={{
                      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                      backdropFilter: 'blur(24px) saturate(180%)'
                    }}
                    className="absolute top-full left-0 mt-1.5 w-60 bg-white/85 border border-white/80 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),inset_0_1.5px_1px_rgba(255,255,255,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 flex flex-col p-2 z-50"
                  >
                    {link.subLinks.map(subLink => {
                      const SubIcon = subLink.icon;
                      const isChildActive = location.pathname === subLink.path;
                      return (
                        <Link 
                          key={subLink.name} 
                          to={subLink.path} 
                          className={`px-3 py-2 rounded-xl text-xs xl:text-sm flex items-center gap-2.5 font-medium transition-all duration-150 ${
                            isChildActive 
                              ? 'text-orange-600 font-bold bg-orange-500/15 border border-orange-400/30 shadow-xs' 
                              : 'text-slate-700 hover:bg-white/80 hover:text-orange-600 hover:shadow-xs hover:border hover:border-white/80'
                          }`}
                        >
                          {SubIcon && (
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isChildActive ? 'bg-orange-500 text-white shadow-xs shadow-orange-500/30' : 'bg-orange-50 text-orange-500'}`}>
                              <SubIcon className="w-3 h-3" />
                            </div>
                          )}
                          <span>{subLink.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs xl:text-sm font-semibold transition-all duration-200 py-1.5 px-3 rounded-full ${
                    isActive 
                      ? 'text-orange-600 font-bold bg-orange-500/12 border border-orange-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]' 
                      : 'text-slate-800 hover:text-orange-600 hover:bg-white/40 hover:shadow-xs'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Liquid Glow Button (Employee Login) */}
            <Link 
              to="/login" 
              className="ml-2 relative group overflow-hidden bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-[0_4px_16px_rgba(249,115,22,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:shadow-[0_6px_22px_rgba(249,115,22,0.55)] transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Employee Login</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle - Liquid Glass */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              style={{
                WebkitBackdropFilter: 'blur(16px)',
                backdropFilter: 'blur(16px)'
              }}
              className="p-2 rounded-xl text-slate-800 bg-white/40 hover:bg-white/70 border border-white/60 shadow-xs transition-all active:scale-95"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer - Frosted Liquid Glass */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white/85 backdrop-blur-2xl flex flex-col animate-fade-in overflow-hidden pointer-events-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/60 bg-white/75 backdrop-blur-xl shrink-0 shadow-xs">
            <Link to="/" onClick={handleLogoClick} className="flex items-center">
              <img src="/logo.png" alt="PaulTech Software Services" className="h-8 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-full bg-white/80 border border-white/80 text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-xs"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2.5">
            {classicNavLinks.map((link) => {
              const IconComponent = link.icon;
              const isSubActive = link.subLinks?.some(sub => location.pathname === sub.path);
              const isActive = location.pathname === link.path || isSubActive;
              const isExpanded = !!expandedMenus[link.name];

              if (link.subLinks) {
                return (
                  <div key={link.name} className="rounded-2xl border border-white/80 overflow-hidden bg-white/70 backdrop-blur-md shadow-xs">
                    <button
                      onClick={() => toggleSubmenu(link.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all ${
                        isSubActive
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-slate-800 hover:bg-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {IconComponent && (
                          <div className={`p-2 rounded-xl ${isSubActive ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 border border-slate-200/70'}`}>
                            <IconComponent size={16} />
                          </div>
                        )}
                        <span>{link.name}</span>
                      </div>
                      <FiChevronDown className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${isExpanded ? 'rotate-180 text-orange-500' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="bg-white/80 border-t border-white/60 p-2 space-y-1.5 backdrop-blur-md">
                        {link.subLinks.map((sub) => {
                          const isSubItemActive = location.pathname === sub.path;
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.name}
                              to={sub.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                isSubItemActive
                                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                                  : 'text-slate-700 hover:bg-white/90'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                {SubIcon && <SubIcon size={14} className={isSubItemActive ? 'text-white' : 'text-orange-500'} />}
                                <span>{sub.name}</span>
                              </div>
                              <FiChevronRight size={14} className={isSubItemActive ? 'text-white' : 'text-slate-300'} />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white/70 hover:bg-white/90 text-slate-900 border border-white/80 backdrop-blur-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {IconComponent && (
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600 border border-slate-200/70'}`}>
                        <IconComponent size={16} />
                      </div>
                    )}
                    <span>{link.name}</span>
                  </div>
                  <FiChevronRight size={16} className={isActive ? 'text-white' : 'text-slate-300'} />
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-200/60">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-3.5 px-6 rounded-2xl text-sm font-black shadow-lg shadow-orange-500/25 active:scale-98 transition-all"
              >
                <FiLock size={18} />
                <span>Employee Login Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
