import React, { useState } from 'react';
import { 
  Wrench, 
  Clock, 
  Mail, 
  Phone, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MaintenanceMode = ({ settings = {}, onRefresh }) => {
  const [checking, setChecking] = useState(false);

  const handleCheckLive = async () => {
    setChecking(true);
    if (onRefresh) {
      await onRefresh();
    } else {
      window.location.reload();
    }
    setTimeout(() => setChecking(false), 800);
  };

  const supportEmail = settings.supportEmail || 'hr@paultechsoftwareservices.com';
  const supportPhone = settings.supportPhone || '+91 91550 51440';
  const message = settings.maintenanceMessage || 
    'We are currently undergoing scheduled system maintenance and performance optimizations to serve you better. We will be back online shortly!';
  const estimatedTime = settings.maintenanceEstimatedEndTime || 'Under 2 Hours';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Dynamic Background Ambient Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Subtle Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Top Header with PaulTech Brand */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg shadow-black/40">
            <img 
              src="/logo.png" 
              alt="PaulTech Software Services Logo" 
              className="h-8 sm:h-9 w-auto object-contain brightness-110"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="text-sm sm:text-base font-black tracking-wider text-white">
              PaulTech
            </div>
            <div className="text-[10px] sm:text-xs text-orange-400 font-semibold uppercase tracking-widest">
              Software Services
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold backdrop-blur-md shadow-inner">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>System Maintenance</span>
        </div>
      </header>

      {/* Main Hero Card */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 flex-grow flex items-center justify-center">
        <div className="w-full bg-slate-900/70 border border-slate-800/90 rounded-3xl p-6 sm:p-10 md:p-12 backdrop-blur-xl shadow-2xl shadow-black/60 text-center relative overflow-hidden">
          
          {/* Top Decorative Flare */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>

          {/* Animated Center Icon Disc */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-3xl opacity-20 blur-xl animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/10">
              <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400 animate-bounce transition-transform" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-xl shadow-md font-black">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3 sm:mb-4">
            Under Scheduled <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Maintenance</span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-300 text-xs sm:text-base max-w-xl mx-auto leading-relaxed mb-6 font-normal">
            {message}
          </p>

          {/* Estimated Uptime Pill */}
          {estimatedTime && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold mb-8 shadow-inner">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Expected Back Online: <strong className="text-orange-400 font-bold">{estimatedTime}</strong></span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-8">
            <button
              onClick={handleCheckLive}
              disabled={checking}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Checking Status...' : 'Refresh Status'}</span>
            </button>

            <a
              href={`mailto:${supportEmail}?subject=Urgent Inquiry during Maintenance`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Email Support</span>
            </a>
          </div>

          {/* Emergency Contact Strip */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              Direct Support: <a href={`tel:${supportPhone}`} className="text-slate-300 hover:text-orange-400 font-semibold">{supportPhone}</a>
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-orange-400" />
              <a href={`mailto:${supportEmail}`} className="text-slate-300 hover:text-orange-400 font-semibold">{supportEmail}</a>
            </span>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} PaulTech Software Services (OPC) Pvt. Ltd. All rights reserved.
        </div>

        {/* Discreet Staff/Admin Access Link */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-orange-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5 font-medium"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Gateway</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default MaintenanceMode;
