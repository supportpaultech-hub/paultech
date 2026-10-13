import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { DashboardSkeleton } from '../SkeletonLoader';
import ErrorBoundary from '../ErrorBoundary';

const AdminLogin = lazy(() => import('../../pages/AdminLogin'));
const Login = lazy(() => import('../../pages/Login'));

const DashboardLayout = ({ role = 'admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Clear any persistent legacy localStorage tokens to strictly enforce tab-session security
  useEffect(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('employeeToken');
  }, []);

  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return sessionStorage.getItem('adminToken') || sessionStorage.getItem('adminAuthenticated') === 'true';
  });

  const checkEmployeeAuth = () => {
    if (sessionStorage.getItem('employeeToken')) return true;
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && (user.role === 'EMPLOYEE' || user.role === 'employee')) return true;
      } catch (e) {}
    }
    return false;
  };

  const [isEmployeeAuth, setIsEmployeeAuth] = useState(checkEmployeeAuth);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Automatically close mobile sidebar when navigating to a new route
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileOpen(prev => !prev);
    } else {
      setIsCollapsed(prev => {
        const next = !prev;
        localStorage.setItem('sidebarCollapsed', String(next));
        return next;
      });
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuth(true);
    navigate('/admin/dashboard');
  };

  const handleEmployeeLoginSuccess = () => {
    setIsEmployeeAuth(true);
    navigate('/employee/dashboard');
  };

  if (role === 'admin') {
    const isAuth = sessionStorage.getItem('adminToken') || sessionStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuth && !isAdminAuth) {
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
        </Suspense>
      );
    }
  }

  if (role === 'employee') {
    const isAuth = checkEmployeeAuth();
    if (!isAuth && !isEmployeeAuth) {
      return (
        <Suspense fallback={<DashboardSkeleton />}>
          <Login onLoginSuccess={handleEmployeeLoginSuccess} />
        </Suspense>
      );
    }
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        role={role} 
        isCollapsed={isCollapsed} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header */}
        <Topbar 
          role={role} 
          isCollapsed={isCollapsed} 
          onToggleSidebar={handleToggleSidebar} 
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
