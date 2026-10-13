import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiBell, FiLogOut } from 'react-icons/fi';
import { 
  Menu, 
  ChevronRight, 
  Clock, 
  Calendar, 
  Globe, 
  ExternalLink,
  GraduationCap,
  Briefcase,
  MessageSquare,
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';
import { API_BASE_URL } from '../../student-app/config';

const Topbar = ({ role = 'admin', isCollapsed = false, onToggleSidebar }) => {
  const [profileImg, setProfileImg] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileDesignation, setProfileDesignation] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Real-time notifications state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [internApps, setInternApps] = useState([]);
  const [jobApps, setJobApps] = useState([]);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const notifRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const userObj = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || '{}');

  // Real-time live date and clock
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (role === 'employee') {
      const emailKey = userObj.email || userObj.username || '';
      const initialName = userObj.firstName 
        ? `${userObj.firstName} ${userObj.lastName || ''}`.trim() 
        : (userObj.name || userObj.username || 'Employee');
      
      setProfileName(initialName);
      setProfileDesignation(userObj.designation || userObj.employeeId || 'Team Member');
      if (userObj.img) setProfileImg(userObj.img);

      if (emailKey) {
        axios.get(`${API_BASE_URL}/api/auth/employees`)
          .then(res => {
            const employees = res.data || [];
            const match = employees.find(e => 
              (e.username && e.username.toLowerCase() === emailKey.toLowerCase()) ||
              (e.employeeId && e.employeeId === userObj.employeeId)
            );

            if (match) {
              if (match.img) setProfileImg(match.img);
              if (match.firstName) setProfileName(`${match.firstName} ${match.lastName || ''}`.trim());
              if (match.designation) setProfileDesignation(match.designation);

              // Sync sessionStorage
              const updatedUser = { ...userObj, ...match, name: `${match.firstName} ${match.lastName || ''}`.trim() };
              sessionStorage.setItem('user', JSON.stringify(updatedUser));
            }
          })
          .catch(console.error);
      }
    } else {
      setProfileName('Administrator');
      setProfileDesignation('Super Admin');
    }
  }, [role]);

  // Real-time notifications polling for Admin
  useEffect(() => {
    if (role === 'admin') {
      const fetchNotifications = async () => {
        try {
          // Applications (Internships & Jobs)
          const appsRes = await axios.get(`${API_BASE_URL}/api/jobs/applications`);
          const allApps = appsRes.data || [];

          const interns = allApps.filter(a => {
            const titleLower = (a.jobTitle || '').toLowerCase();
            const expLower = (a.experience || '').toLowerCase();
            return titleLower.includes('intern') || expLower.includes('student') || expLower.includes('college') || expLower.includes('batch');
          });
          const jobs = allApps.filter(a => !interns.some(ia => ia._id === a._id));

          const pendingInterns = interns.filter(a => !a.status || a.status === 'Pending' || a.status === 'Pending Review');
          const pendingJobs = jobs.filter(a => !a.status || a.status === 'Pending' || a.status === 'Pending Review');

          setInternApps(pendingInterns);
          setJobApps(pendingJobs);

          // Inquiries
          const contactRes = await axios.get(`${API_BASE_URL}/api/contact`);
          const totalInquiries = contactRes.data.length;
          const seenInquiries = parseInt(localStorage.getItem('seenInquiriesCount') || '0', 10);
          setInquiriesCount(totalInquiries > seenInquiries ? totalInquiries - seenInquiries : 0);

          // Leaves
          const leavesRes = await axios.get(`${API_BASE_URL}/api/leaves/stats`);
          setPendingLeavesCount(leavesRes.data?.pendingCount || 0);
        } catch (err) {
          console.error('Error fetching admin notifications in Topbar:', err);
        }
      };

      fetchNotifications();
    }
  }, [role, location.pathname]);

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalNotifs = internApps.length + jobApps.length + inquiriesCount + pendingLeavesCount;

  // Dynamic Page Title helper
  const getPageTitle = (pathname) => {
    const path = pathname.toLowerCase();
    if (path.includes('/dashboard')) return role === 'admin' ? 'Dashboard Overview' : 'Dashboard';
    if (path.includes('/leaves')) return role === 'admin' ? 'Employee Leaves' : 'My Leaves';
    if (path.includes('/attendance')) return role === 'admin' ? 'Employee Attendance' : 'My Attendance';
    if (path.includes('/events')) return 'Manage Events';
    if (path.includes('/employees')) return 'Manage Employees';
    if (path.includes('/certificates')) return 'Manage Certificates';
    if (path.includes('/inquiries')) return 'Client Inquiries';
    if (path.includes('/gallery')) return 'Manage Gallery';
    if (path.includes('/templates')) return 'Manage Store';
    if (path.includes('/portfolio')) return 'Manage Portfolio';
    if (path.includes('/jobs')) return 'Manage Jobs';
    if (path.includes('/internships')) return 'Manage Internships';
    if (path.includes('/testimonials')) return 'Manage Reviews';
    if (path.includes('/activity')) return 'Activity Logs';
    if (path.includes('/broadcast')) return 'Global Broadcast';
    if (path.includes('/settings')) return 'Settings';
    return role === 'admin' ? 'Administration' : 'Workspace';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="h-14 sm:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30 shrink-0 gap-2.5">
      
      {/* Left: Sidebar Toggle Button + Page Breadcrumb */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition-all flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer group shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-slate-700 group-hover:text-orange-600 transition-transform group-hover:scale-105" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 font-bold text-xs text-slate-600 shrink-0">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>{role === 'admin' ? 'Admin Portal' : 'Employee Portal'}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:block shrink-0" />
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 truncate">
            {pageTitle}
          </h2>
        </div>
      </div>

      {/* Center: Live Real-time Telemetry Clock & Date */}
      <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-emerald-600 tracking-wider">LIVE</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime}</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Right: Public Website Link, Notifications, User Profile & Logout */}
      <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
        
        {/* Quick Link to Public Live Website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition-all shadow-2xs group cursor-pointer"
          title="Open Public Website in new tab"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors" />
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-orange-500 transition-colors" />
        </a>

        {/* Interactive Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            type="button"
            onClick={() => setIsNotifOpen(prev => !prev)}
            className={`relative p-2 text-slate-500 hover:text-orange-600 transition-all cursor-pointer rounded-xl hover:bg-orange-50 border border-transparent hover:border-orange-200 ${
              isNotifOpen ? 'bg-orange-50 text-orange-600 border-orange-200' : ''
            }`}
            title="Notifications"
            aria-label="View notifications"
          >
            <FiBell size={19} className="sm:w-5 sm:h-5" />
            {totalNotifs > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white ring-2 ring-white animate-pulse">
                {totalNotifs}
              </span>
            )}
          </button>

          {/* Notifications Flyout Panel */}
          {isNotifOpen && (
            <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-16 sm:top-auto sm:mt-3 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-800">Notifications</span>
                  {totalNotifs > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700">
                      {totalNotifs} pending
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {/* 1. Internship Applications */}
                {internApps.length > 0 && (
                  <div className="p-3 bg-orange-50/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-extrabold text-orange-700 uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-orange-600" />
                        Internship Applications ({internApps.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/admin/internships?tab=applications');
                        }}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
                      >
                        View all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {internApps.slice(0, 3).map((app) => (
                        <div
                          key={app._id}
                          onClick={() => {
                            setIsNotifOpen(false);
                            navigate('/admin/internships?tab=applications');
                          }}
                          className="bg-white p-2.5 rounded-xl border border-orange-200/70 hover:border-orange-400 hover:shadow-xs cursor-pointer transition-all flex items-start gap-2.5"
                        >
                          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 font-bold text-xs">
                            {app.candidateName?.charAt(0) || 'S'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{app.candidateName}</p>
                            <p className="text-[11px] text-slate-500 truncate">{app.jobTitle || 'Industrial Internship'}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              {app.status || 'Pending Review'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Job Applications */}
                {jobApps.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        Job Applications ({jobApps.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/admin/jobs');
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                    {jobApps.slice(0, 2).map((app) => (
                      <div
                        key={app._id}
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/admin/jobs');
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-700 truncate">{app.candidateName}</span>
                        <span className="text-slate-400 text-[11px] truncate max-w-[120px]">{app.jobTitle}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Inquiries */}
                {inquiriesCount > 0 && (
                  <div 
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/admin/inquiries');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">New Client Inquiries</p>
                        <p className="text-[11px] text-slate-500">{inquiriesCount} unread message(s)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Open &rarr;</span>
                  </div>
                )}

                {/* 4. Employee Leaves */}
                {pendingLeavesCount > 0 && (
                  <div 
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/admin/leaves');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <CalendarCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Pending Leave Requests</p>
                        <p className="text-[11px] text-slate-500">{pendingLeavesCount} employee request(s) awaiting approval</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-600">Review &rarr;</span>
                  </div>
                )}

                {/* Empty State */}
                {totalNotifs === 0 && (
                  <div className="py-8 text-center px-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-bold text-slate-700">All caught up!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No pending applications or review items.</p>
                  </div>
                )}
              </div>

              {/* Bottom Quick Link */}
              <div className="px-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate('/admin/internships?tab=applications');
                  }}
                  className="w-full py-1.5 text-center text-xs font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Go to Manage Internships
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 sm:h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Dynamic Logged-in User Profile Header */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-extrabold text-slate-900 leading-tight">
              {profileName || 'Ganesh Kumar'}
            </p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {profileDesignation || 'Full Stack Engineer'}
            </p>
          </div>

          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-xs sm:text-base shadow-sm shadow-orange-600/20 shrink-0 overflow-hidden border border-orange-200">
            {profileImg ? (
              <img src={profileImg} alt={profileName} className="w-full h-full object-cover" />
            ) : (
              (profileName ? profileName.charAt(0) : 'G').toUpperCase()
            )}
          </div>

          {/* Quick Logout Button */}
          <button
            onClick={() => {
              sessionStorage.clear();
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminAuthenticated');
              localStorage.removeItem('employeeToken');
              localStorage.removeItem('user');
              window.location.href = role === 'admin' ? '/admin' : '/';
            }}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1 cursor-pointer"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
