import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FiGrid, FiUsers, FiCalendar, FiBookOpen, 
  FiBriefcase, FiActivity, FiBell, FiSettings,
  FiLogOut, FiX, FiClock, FiImage, FiAward, FiVideo
} from 'react-icons/fi';
import { API_BASE_URL } from '../../student-app/config';

const Sidebar = ({ role = 'admin', isCollapsed = false, isMobileOpen = false, setIsMobileOpen }) => {
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [internshipsCount, setInternshipsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (role === 'admin') {
      const fetchNotificationCounts = async () => {
        try {
          // 1. Fetch Client Inquiries Count
          const contactRes = await axios.get(`${API_BASE_URL}/api/contact`);
          const totalInquiries = contactRes.data.length;
          const seenInquiries = parseInt(localStorage.getItem('seenInquiriesCount') || '0', 10);
          setInquiriesCount(totalInquiries > seenInquiries ? totalInquiries - seenInquiries : 0);

          // 2. Fetch Employee Attendance Logs Count
          const attendanceRes = await axios.get(`${API_BASE_URL}/api/attendance/all`);
          const totalAttendance = attendanceRes.data.length;
          const seenAttendance = parseInt(localStorage.getItem('seenAttendanceCount') || '0', 10);
          setAttendanceCount(totalAttendance > seenAttendance ? totalAttendance - seenAttendance : 0);

          // 3. Fetch Pending Employee Leaves Count
          const leavesRes = await axios.get(`${API_BASE_URL}/api/leaves/stats`);
          const pendingLeaves = leavesRes.data?.pendingCount || 0;
          setPendingLeavesCount(pendingLeaves);

          // 4. Fetch Internship & Job Applications Count
          const appsRes = await axios.get(`${API_BASE_URL}/api/jobs/applications`);
          const allApps = appsRes.data || [];

          const internApps = allApps.filter(a => {
            const titleLower = (a.jobTitle || '').toLowerCase();
            const expLower = (a.experience || '').toLowerCase();
            return titleLower.includes('intern') || expLower.includes('student') || expLower.includes('college') || expLower.includes('batch');
          });
          const jobApps = allApps.filter(a => !internApps.some(ia => ia._id === a._id));

          // Pending applications needing admin evaluation
          const pendingInterns = internApps.filter(a => !a.status || a.status === 'Pending' || a.status === 'Pending Review');
          const pendingJobs = jobApps.filter(a => !a.status || a.status === 'Pending' || a.status === 'Pending Review');

          setInternshipsCount(pendingInterns.length);
          setJobsCount(pendingJobs.length);
        } catch (error) {
          console.error('Error fetching notification counts:', error);
        }
      };

      fetchNotificationCounts();
    }
  }, [role, location.pathname]);

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Manage Events', path: '/admin/events', icon: FiVideo },
    { name: 'Manage Employees', path: '/admin/employees', icon: FiUsers },
    { name: 'Employee Attendance', path: '/admin/attendance', icon: FiClock },
    { name: 'Employee Leaves', path: '/admin/leaves', icon: FiCalendar },
    { name: 'Manage Certificates', path: '/admin/certificates', icon: FiAward },
    { name: 'Client Inquiries', path: '/admin/inquiries', icon: FiActivity },
    { name: 'Manage Gallery', path: '/admin/gallery', icon: FiImage },
    { name: 'Manage Store', path: '/admin/templates', icon: FiBriefcase },
    { name: 'Manage Portfolio', path: '/admin/portfolio', icon: FiBriefcase },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: FiBriefcase },
    { name: 'Manage Internships', path: '/admin/internships', icon: FiBookOpen },
    { name: 'Manage Reviews', path: '/admin/testimonials', icon: FiBookOpen },
    { name: 'Activity Logs', path: '/admin/activity', icon: FiActivity },
    { name: 'Global Broadcast', path: '/admin/broadcast', icon: FiBell },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: FiGrid },
    { name: 'My Attendance', path: '/employee/attendance', icon: FiClock },
    { name: 'My Leaves', path: '/employee/leaves', icon: FiCalendar },
  ];

  const links = role === 'admin' ? adminLinks : employeeLinks;

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200 
        flex flex-col h-screen h-[100dvh] transition-all duration-300 ease-in-out shrink-0
        ${isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        
        {/* Brand Area */}
        <div className={`h-16 sm:h-20 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5 sm:px-6'} border-b border-slate-200 shrink-0 transition-all`}>
          {isCollapsed ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-xs">
              P
            </div>
          ) : (
            <img src="/logo.png" alt="Paultech Logo" className="h-8 sm:h-11 w-auto object-contain" />
          )}

          {/* Mobile Close Button */}
          <button 
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`flex-1 overflow-y-auto py-4 ${isCollapsed ? 'px-2' : 'px-3 sm:px-4'} space-y-1 custom-scrollbar`}>
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 truncate">
              Management
            </p>
          )}

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            
            let badgeCount = 0;
            let badgeType = '';
            if (link.name === 'Client Inquiries' && inquiriesCount > 0) {
              badgeCount = inquiriesCount;
              badgeType = 'inquiries';
            } else if (link.name === 'Employee Attendance' && attendanceCount > 0) {
              badgeCount = attendanceCount;
              badgeType = 'attendance';
            } else if (link.name === 'Employee Leaves' && pendingLeavesCount > 0) {
              badgeCount = pendingLeavesCount;
              badgeType = 'leaves';
            } else if (link.name === 'Manage Internships' && internshipsCount > 0) {
              badgeCount = internshipsCount;
              badgeType = 'internships';
            } else if (link.name === 'Manage Jobs' && jobsCount > 0) {
              badgeCount = jobsCount;
              badgeType = 'jobs';
            }

            return (
              <NavLink
                key={link.name}
                to={link.path}
                title={link.name}
                onClick={() => {
                  if (setIsMobileOpen) setIsMobileOpen(false);
                  
                  if (badgeType === 'inquiries') {
                    setInquiriesCount(0);
                    axios.get(`${API_BASE_URL}/api/contact`).then(res => {
                      localStorage.setItem('seenInquiriesCount', res.data.length);
                    }).catch(console.error);
                  } else if (badgeType === 'attendance') {
                    setAttendanceCount(0);
                    axios.get(`${API_BASE_URL}/api/attendance/all`).then(res => {
                      localStorage.setItem('seenAttendanceCount', res.data.length);
                    }).catch(console.error);
                  }
                }}
                className={`relative flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 sm:px-4 py-3'} rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-white shrink-0' : 'text-slate-400 group-hover:text-slate-700 shrink-0'} />
                
                {!isCollapsed && (
                  <span className="truncate flex-1">{link.name}</span>
                )}

                {/* Badge Indicator */}
                {badgeCount > 0 && (
                  isCollapsed ? (
                    <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                      isActive 
                        ? 'bg-white' 
                        : badgeType === 'leaves' 
                          ? 'bg-amber-500' 
                          : badgeType === 'internships'
                            ? 'bg-orange-500'
                            : 'bg-rose-500'
                    } animate-pulse`} />
                  ) : (
                    <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-extrabold ${
                      isActive 
                        ? 'bg-white text-orange-600' 
                        : badgeType === 'leaves' 
                          ? 'bg-amber-500 text-white' 
                          : badgeType === 'internships'
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'bg-rose-500 text-white shadow-xs'
                    }`}>
                      {badgeCount}
                    </span>
                  )
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Actions (Logout) */}
        <div className={`p-3 sm:p-4 border-t border-slate-200 shrink-0 bg-white shadow-sm pb-6 lg:pb-4 ${isCollapsed ? 'flex justify-center p-2' : ''}`}>
          <button 
            type="button"
            onClick={() => {
              sessionStorage.clear();
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminAuthenticated');
              localStorage.removeItem('employeeToken');
              localStorage.removeItem('user');
              if (role === 'admin') {
                window.location.href = '/admin';
              } else {
                window.location.href = '/';
              }
            }}
            title="Logout"
            className={`flex items-center ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'w-full gap-3 px-4 py-3'} rounded-xl text-sm font-bold text-slate-700 bg-rose-50/60 hover:bg-rose-100 hover:text-rose-600 transition-colors group border border-rose-100 cursor-pointer`}
          >
            <FiLogOut size={18} className="text-rose-500 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
