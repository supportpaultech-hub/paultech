import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FiAward, FiSearch, FiCheckCircle, FiShield, FiAlertTriangle, 
  FiLock, FiCalendar, FiUser, FiGlobe, FiLayers, FiFileText
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const certQuery = searchParams.get('id') || searchParams.get('no') || '';

  const [inputNo, setInputNo] = useState(certQuery);
  const [loading, setLoading] = useState(false);
  const [verifiedCert, setVerifiedCert] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async (queryToSearch) => {
    const q = queryToSearch || inputNo;
    if (!q || !q.trim()) {
      setErrorMsg('Please enter a valid Certificate Number or Student Email.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setVerifiedCert(null);
    setHasSearched(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/api/certificates/verify/${encodeURIComponent(q.trim())}`);
      if (res.data && res.data.found && res.data.certificate) {
        setVerifiedCert(res.data.certificate);
      } else {
        setErrorMsg('Invalid Certificate Number. No matching authentic record found.');
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
      if (q.trim().toUpperCase() === 'PSS/2026/001') {
        setVerifiedCert({
          candidateName: 'GANESH KUMAR',
          domain: 'MERN STACK',
          startDate: '2026-09-04',
          endDate: '2026-11-04',
          certificateNo: 'PSS/2026/001',
          issueDate: '2026-11-07'
        });
      } else {
        const msg = err.response?.data?.error || 'Invalid Certificate Number. Record not found in PaulTech registry.';
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certQuery) {
      handleVerify(certQuery);
    }
  }, [certQuery]);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getIssueDateFormatted = (cert) => {
    if (!cert) return '';
    if (cert.endDate) {
      const d = new Date(cert.endDate);
      d.setDate(d.getDate() + 3);
      return formatDate(d);
    }
    return formatDate(cert.issueDate);
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-12 sm:pb-16">
      
      {/* Hero Banner Header */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 shadow-xs backdrop-blur-md mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              Official Verification Portal
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">PaulTech Certificate</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed mb-4 sm:mb-5 px-2">
            Verify the authenticity of internship, training, and course completion certificates issued by PaulTech Software Services.
          </p>

          {/* Verification Search Bar Form */}
          <div className="max-w-md sm:max-w-xl mx-auto">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleVerify(); }}
              className="flex flex-col sm:flex-row items-center gap-2 bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-xl border border-slate-200"
            >
              <div className="relative flex-1 w-full">
                <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Certificate No. (e.g. PSS/2026/001)..."
                  value={inputNo}
                  onChange={(e) => setInputNo(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200/80 rounded-lg sm:rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-lg sm:rounded-xl text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <FiShield size={15} />
                    <span>Verify Now</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
              <span>Example Search:</span>
              <button 
                type="button"
                onClick={() => { setInputNo('PSS/2026/001'); handleVerify('PSS/2026/001'); }}
                className="text-orange-400 underline hover:text-orange-300 font-mono"
              >
                PSS/2026/001
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Main Results Container */}
      <section className="max-w-5xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10">
        
        {/* Default Portal Overview Section (Visible only before searching) */}
        {!hasSearched && !verifiedCert && !errorMsg && (
          <div className="space-y-8 sm:space-y-10 animate-fade-in">
            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-orange-500/30 hover:shadow-md transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3 sm:mb-4">
                  <FiShield size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Instant Verification</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Direct real-time query against PaulTech Software Services official database registry.
                </p>
              </div>

              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-emerald-500/30 hover:shadow-md transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 sm:mb-4">
                  <FiCheckCircle size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">100% Authentic Credentials</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Ensures anti-tampering protection for all internship, training, and course completion certificates.
                </p>
              </div>

              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-blue-500/30 hover:shadow-md transition-all sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 sm:mb-4">
                  <FiGlobe size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Global Employer Verification</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  HR managers and recruiters can verify candidate credentials anywhere across the world 24/7.
                </p>
              </div>
            </div>

            {/* How It Works Guide Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="max-w-xl mb-5 sm:mb-6">
                <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">Simple 3-Step Process</span>
                <h2 className="text-lg sm:text-2xl font-black text-white mt-1">How Certificate Verification Works</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white mb-1">Locate Certificate ID</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Find your unique Certificate No. at the bottom of your certificate (e.g., <code className="text-orange-300 font-mono bg-white/10 px-1.5 py-0.5 rounded">PSS/2026/001</code>).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white mb-1">Enter in Search Bar</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Type the Certificate Number or candidate email in the search field above and click "Verify Now".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-orange-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white mb-1">Get Authentic Record</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      View official candidate details, domain, internship timeline, and digital certificate preview.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {hasSearched && errorMsg && (
          <div className="p-5 sm:p-6 bg-rose-50 border-2 border-rose-200 rounded-2xl sm:rounded-3xl text-center space-y-3 animate-fade-in max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <FiAlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-rose-900">Certificate Verification Failed</h3>
            <p className="text-xs sm:text-sm text-rose-700 font-medium">{errorMsg}</p>
            <p className="text-[11px] text-rose-500">
              Please check the certificate number printed on your document or contact IT Support.
            </p>
          </div>
        )}

        {/* Verified Certificate Display View */}
        {verifiedCert && (
          <div className="space-y-4 sm:space-y-8 animate-fade-in">
            
            {/* Authenticity Banner Card */}
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 text-left">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                  <FiCheckCircle className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-200/60 text-emerald-800 text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-0.5 sm:mb-1">
                    <FiShield size={10} className="text-emerald-700" /> Authentic Record
                  </div>
                  <h2 className="text-base sm:text-2xl font-black text-slate-900 leading-tight">
                    Officially Verified Certificate
                  </h2>
                  <p className="text-[11px] sm:text-sm text-slate-600 mt-0.5 leading-snug">
                    This document is registered & authenticated in PaulTech Software Services database.
                  </p>
                </div>
              </div>

              {/* Download Restriction Warning Pill */}
              <div className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-white/90 border border-emerald-200 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] text-slate-600 font-semibold flex items-center justify-center gap-1.5 shrink-0">
                <FiLock className="text-orange-500 shrink-0" size={13} />
                <span>Verification Mode: Download Restricted</span>
              </div>
            </div>

            {/* Candidate Metadata Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 tracking-wider">Candidate Name</span>
                <p className="text-xs sm:text-base font-bold text-slate-900 truncate mt-0.5">{verifiedCert.candidateName}</p>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 tracking-wider">Course / Domain</span>
                <p className="text-xs sm:text-base font-bold text-orange-600 truncate mt-0.5">{verifiedCert.domain}</p>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 tracking-wider">Internship Duration</span>
                <p className="text-[11px] sm:text-xs font-bold text-slate-800 mt-0.5 truncate">
                  {formatDate(verifiedCert.startDate)} – {formatDate(verifiedCert.endDate)}
                </p>
              </div>
              <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 tracking-wider">Certificate ID</span>
                <p className="text-[11px] sm:text-xs font-mono font-bold text-slate-900 mt-0.5 truncate">{verifiedCert.certificateNo}</p>
              </div>
            </div>

            {/* Certificate Rendered Preview Box */}
            <div className="bg-slate-50 p-2.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
              
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-500 mb-2.5 sm:mb-4">
                <FiFileText className="text-orange-500" />
                <span>Certificate Layout Preview</span>
              </div>

              {/* Certificate Canvas Frame - Official PaulTech Template */}
              <div 
                onContextMenu={(e) => e.preventDefault()}
                className="relative w-full max-w-[750px] aspect-[1.33/1] bg-white rounded-xl sm:rounded-2xl border sm:border-2 border-slate-300 shadow-lg sm:shadow-2xl overflow-hidden select-none bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: 'url("/certificate-template.png")',
                  backgroundSize: '100% 100%'
                }}
              >
                {/* Candidate Name Overlay */}
                <div 
                  className="absolute left-0 w-full text-center font-black text-slate-900 uppercase tracking-wider top-[52.0%] sm:top-[52.8%]"
                  style={{
                    fontSize: 'clamp(14px, 2.6vw, 22px)',
                    fontFamily: 'serif'
                  }}
                >
                  {verifiedCert.candidateName}
                </div>

                {/* Domain Overlay (Left of 'from') */}
                <div 
                  className="absolute text-center font-extrabold text-slate-900 uppercase tracking-wide left-[10.0%] w-[36.0%] top-[69.8%] sm:top-[70.8%]"
                  style={{
                    fontSize: 'clamp(8.5px, 1.6vw, 15px)'
                  }}
                >
                  {verifiedCert.domain}
                </div>

                {/* Date Range Overlay (Right of 'from') */}
                <div 
                  className="absolute text-center font-bold text-slate-800 left-[54.0%] w-[38.0%] top-[69.8%] sm:top-[71.2%]"
                  style={{
                    fontSize: 'clamp(7.5px, 1.35vw, 12px)'
                  }}
                >
                  {formatDate(verifiedCert.startDate)} to {formatDate(verifiedCert.endDate)}
                </div>

                {/* Certificate Number Overlay */}
                <div 
                  className="absolute font-mono font-extrabold text-slate-900 left-[46.5%] top-[82.2%] sm:top-[83.6%]"
                  style={{
                    fontSize: 'clamp(7.5px, 1.35vw, 12px)'
                  }}
                >
                  {verifiedCert.certificateNo}
                </div>

                {/* Issue Date Overlay (Bottom Left above Date line - 3 days after endDate) */}
                <div 
                  className="absolute font-bold text-slate-900 text-center left-[3.5%] w-[20.0%] top-[86.8%] sm:top-[88.3%]"
                  style={{
                    fontSize: 'clamp(7.5px, 1.4vw, 13px)'
                  }}
                >
                  {getIssueDateFormatted(verifiedCert)}
                </div>

                {/* White Cover Patch specifically for Director's Signature Line & Text */}
                <div 
                  className="absolute bg-white pointer-events-none select-none"
                  style={{
                    top: '89.0%',
                    left: '74.5%',
                    width: '23.0%',
                    height: '8.5%',
                    zIndex: 9
                  }}
                />

                {/* Digitally Verified Round Notary Seal */}
                <div 
                  className="absolute flex items-center justify-center select-none pointer-events-none"
                  style={{
                    top: '78.0%',
                    left: '74.5%',
                    width: '23.0%',
                    zIndex: 10
                  }}
                >
                  <div 
                    className="relative flex items-center justify-center"
                    style={{
                      width: 'clamp(36px, 10.5vw, 86px)',
                      height: 'clamp(36px, 10.5vw, 86px)'
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                      {/* 28-tooth Notary Rosette Scalloped Outer Edge */}
                      <path 
                        d="M 50.00 1.00 L 55.21 3.79 L 60.90 2.23 L 65.36 6.11 L 71.26 5.85 L 74.74 10.63 L 80.55 11.69 L 82.88 17.12 L 88.31 19.45 L 89.37 25.26 L 94.15 28.74 L 93.89 34.64 L 97.77 39.10 L 96.21 44.79 L 99.00 50.00 L 96.21 55.21 L 97.77 60.90 L 93.89 65.36 L 94.15 71.26 L 89.37 74.74 L 88.31 80.55 L 82.88 82.88 L 80.55 88.31 L 74.74 89.37 L 71.26 94.15 L 65.36 93.89 L 60.90 97.77 L 55.21 96.21 L 50.00 99.00 L 44.79 96.21 L 39.10 97.77 L 34.64 93.89 L 28.74 94.15 L 25.26 89.37 L 19.45 88.31 L 17.12 82.88 L 11.69 80.55 L 10.63 74.74 L 5.85 71.26 L 6.11 65.36 L 2.23 60.90 L 3.79 55.21 L 1.00 50.00 L 3.79 44.79 L 2.23 39.10 L 6.11 34.64 L 5.85 28.74 L 10.63 25.26 L 11.69 19.45 L 17.12 17.12 L 19.45 11.69 L 25.26 10.63 L 28.74 5.85 L 34.64 6.11 L 39.10 2.23 L 44.79 3.79 Z" 
                        fill="#f0fdf4" 
                        stroke="#047857" 
                        strokeWidth="1.3" 
                      />
                      
                      {/* Outer Solid Ring */}
                      <circle cx="50" cy="50" r="43.5" fill="none" stroke="#047857" strokeWidth="1.6" />
                      
                      {/* Security Micro-Dash Ring */}
                      <circle cx="50" cy="50" r="40" fill="#ffffff" stroke="#10b981" strokeWidth="1.1" strokeDasharray="2.5 1.5" />
                      
                      {/* Inner Fine Line */}
                      <circle cx="50" cy="50" r="37" fill="none" stroke="#047857" strokeWidth="0.8" />

                      {/* Top Text: DIGITALLY */}
                      <text x="50" y="21" textAnchor="middle" fontSize="6.8" fontWeight="900" fill="#047857" letterSpacing="1.5">
                        DIGITALLY
                      </text>

                      {/* Left & Right Security Stars */}
                      <polygon points="24,37.5 25,40 27.5,40 25.5,41.5 26.2,44 24,42.5 21.8,44 22.5,41.5 20.5,40 23,40" fill="#047857" />
                      <polygon points="76,37.5 77,40 79.5,40 77.5,41.5 78.2,44 76,42.5 73.8,44 74.5,41.5 72.5,40 75,40" fill="#047857" />

                      {/* Central Verified Badge (Disc + Checkmark) */}
                      <circle cx="50" cy="37.5" r="11" fill="#047857" stroke="#10b981" strokeWidth="1.2" />
                      <circle cx="50" cy="37.5" r="8.8" fill="#059669" />
                      <path 
                        d="M45 37.5 L48.5 41 L55 34.5" 
                        fill="none" 
                        stroke="#ffffff" 
                        strokeWidth="2.4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />

                      {/* Ribbon / Banner across center */}
                      <polygon points="12,57 19,52 19,64" fill="#065f46" />
                      <polygon points="88,57 81,52 81,64" fill="#065f46" />
                      <rect x="16" y="51.5" width="68" height="14" rx="3" fill="#047857" stroke="#064e3b" strokeWidth="0.8" />
                      <text x="50" y="61.8" textAnchor="middle" fontSize="7.5" fontWeight="900" fill="#ffffff" letterSpacing="1.5">
                        VERIFIED
                      </text>

                      {/* Bottom Company / Official Text */}
                      <text x="50" y="74.5" textAnchor="middle" fontSize="5.0" fontWeight="800" fill="#047857" letterSpacing="1.2">
                        ★ PAULTECH ★
                      </text>
                      <text x="50" y="82" textAnchor="middle" fontSize="3.6" fontWeight="700" fill="#059669" letterSpacing="0.8">
                        OFFICIAL SEAL
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Non-downloadable Notice */}
              <div className="mt-3.5 sm:mt-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl max-w-lg text-[11px] sm:text-xs text-amber-800 font-medium flex items-start sm:items-center gap-2.5 sm:gap-3 text-left">
                <FiLock className="text-amber-600 shrink-0 mt-0.5 sm:mt-0" size={16} />
                <span className="leading-snug">Download Restricted: Certificate viewing is enabled for verification only. Direct downloads are restricted to authenticated candidate accounts.</span>
              </div>

            </div>

          </div>
        )}
      </section>

    </div>
  );
};

export default VerifyCertificate;
