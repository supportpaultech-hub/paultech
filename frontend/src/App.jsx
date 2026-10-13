import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './student-app/config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EventPopupModal from './components/EventPopupModal';
import DashboardLayout from './components/dashboard/DashboardLayout';
import { PageSkeleton, DashboardSkeleton } from './components/SkeletonLoader';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages (Lazy Loaded for Fast Initial Bundle & Quick Page Load)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Careers = lazy(() => import('./pages/Careers'));
const Internships = lazy(() => import('./pages/Internships'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Team = lazy(() => import('./pages/Team'));
const Clients = lazy(() => import('./pages/Clients'));
const Store = lazy(() => import('./pages/Store'));
const Gallery = lazy(() => import('./pages/Gallery'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));
const Events = lazy(() => import('./pages/Events'));
const MaintenanceMode = lazy(() => import('./pages/MaintenanceMode'));

// Student App (Lazy Loaded Standalone Module)
const StudentApp = lazy(() => import('./student-app/App'));

// Admin & Dashboard Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ManageEmployees = lazy(() => import('./pages/ManageEmployees'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const EmployeeAttendance = lazy(() => import('./pages/EmployeeAttendance'));
const ClientInquiries = lazy(() => import('./pages/ClientInquiries'));
const ManageJobs = lazy(() => import('./pages/ManageJobs'));
const ManageInternships = lazy(() => import('./pages/ManageInternships'));
const ActivityLogs = lazy(() => import('./pages/ActivityLogs'));
const GlobalBroadcast = lazy(() => import('./pages/GlobalBroadcast'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const ManageTestimonials = lazy(() => import('./pages/ManageTestimonials'));
const ManageTemplates = lazy(() => import('./pages/ManageTemplates'));
const ManagePortfolio = lazy(() => import('./pages/ManagePortfolio'));
const ManageAttendance = lazy(() => import('./pages/ManageAttendance'));
const ManageLeaves = lazy(() => import('./pages/ManageLeaves'));
const EmployeeLeaves = lazy(() => import('./pages/EmployeeLeaves'));
const ManageGallery = lazy(() => import('./pages/ManageGallery'));
const ManageCertificates = lazy(() => import('./pages/ManageCertificates'));
const ManageEvents = lazy(() => import('./pages/ManageEvents'));

// Layout wrapper for public facing website
const MainLayout = () => {
  const [settings, setSettings] = useState(() => ({
    maintenanceMode: localStorage.getItem('maintenanceMode') === 'true',
    maintenanceMessage: '',
    maintenanceEstimatedEndTime: ''
  }));
  const location = useLocation();

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/settings`);
      if (res.data) {
        setSettings(res.data);
        localStorage.setItem('maintenanceMode', String(res.data.maintenanceMode));
      }
    } catch (e) {
      // Retain fallback state
    }
  };

  useEffect(() => {
    fetchSettings();
    const handleStorageChange = () => {
      setSettings(prev => ({
        ...prev,
        maintenanceMode: localStorage.getItem('maintenanceMode') === 'true'
      }));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isAdminLoggedIn = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const role = localStorage.getItem('role') || sessionStorage.getItem('role') || user.role;
      return Boolean(token && (role === 'admin' || role === 'ADMIN'));
    } catch (e) {
      return false;
    }
  };

  const isAdmin = isAdminLoggedIn();
  const isAuthRoute = location.pathname === '/login' || 
                      location.pathname === '/admin-login' || 
                      location.pathname === '/admin/login';

  // If maintenance mode is active AND the visitor is not an authenticated admin AND not on an admin login page:
  if (settings.maintenanceMode && !isAdmin && !isAuthRoute) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <MaintenanceMode settings={settings} onRefresh={fetchSettings} />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      {settings.maintenanceMode && isAdmin && (
        <div className="bg-rose-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between sticky top-0 z-[999] shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>MAINTENANCE MODE IS ACTIVE: Public visitors see the Under Maintenance screen. You are viewing the live site as an Admin.</span>
          </div>
          <Link to="/admin/settings" className="underline hover:text-rose-100 ml-4 shrink-0 font-extrabold">
            Turn Off in Settings →
          </Link>
        </div>
      )}
      <Navbar />
      <EventPopupModal />
      <main className="flex-grow">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};


function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Services />} />
            <Route path="/events" element={<Events />} />
            <Route path="/webinars" element={<Events />} />
            <Route path="/bootcamps" element={<Events />} />
            <Route path="/store" element={<Store />} />
            <Route path="/projects" element={<Portfolio />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internship" element={<Internships />} />
            <Route path="/certificate" element={<VerifyCertificate />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          {/* Student App Portal Route (Standalone Module) */}
          <Route 
            path="/student/*" 
            element={
              <Suspense fallback={<PageSkeleton />}>
                <StudentApp />
              </Suspense>
            } 
          />

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<DashboardLayout role="admin" />}>
            <Route index element={<Suspense fallback={<DashboardSkeleton />}><AdminDashboard /></Suspense>} />
            <Route path="dashboard" element={<Suspense fallback={<DashboardSkeleton />}><AdminDashboard /></Suspense>} />
            <Route path="employees" element={<Suspense fallback={<DashboardSkeleton />}><ManageEmployees /></Suspense>} />
            <Route path="events" element={<Suspense fallback={<DashboardSkeleton />}><ManageEvents /></Suspense>} />
            <Route path="attendance" element={<Suspense fallback={<DashboardSkeleton />}><ManageAttendance /></Suspense>} />
            <Route path="leaves" element={<Suspense fallback={<DashboardSkeleton />}><ManageLeaves /></Suspense>} />
            <Route path="certificates" element={<Suspense fallback={<DashboardSkeleton />}><ManageCertificates /></Suspense>} />
            <Route path="inquiries" element={<Suspense fallback={<DashboardSkeleton />}><ClientInquiries /></Suspense>} />
            <Route path="gallery" element={<Suspense fallback={<DashboardSkeleton />}><ManageGallery /></Suspense>} />
            <Route path="jobs" element={<Suspense fallback={<DashboardSkeleton />}><ManageJobs /></Suspense>} />
            <Route path="internships" element={<Suspense fallback={<DashboardSkeleton />}><ManageInternships /></Suspense>} />
            <Route path="templates" element={<Suspense fallback={<DashboardSkeleton />}><ManageTemplates /></Suspense>} />
            <Route path="portfolio" element={<Suspense fallback={<DashboardSkeleton />}><ManagePortfolio /></Suspense>} />
            <Route path="projects" element={<Suspense fallback={<DashboardSkeleton />}><ManagePortfolio /></Suspense>} />
            <Route path="testimonials" element={<Suspense fallback={<DashboardSkeleton />}><ManageTestimonials /></Suspense>} />
            <Route path="activity" element={<Suspense fallback={<DashboardSkeleton />}><ActivityLogs /></Suspense>} />
            <Route path="broadcast" element={<Suspense fallback={<DashboardSkeleton />}><GlobalBroadcast /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<DashboardSkeleton />}><AdminSettings /></Suspense>} />
          </Route>
          
          {/* Employee Dashboard Routes */}
          <Route path="/employee" element={<DashboardLayout role="employee" />}>
            <Route index element={<Suspense fallback={<DashboardSkeleton />}><EmployeeDashboard /></Suspense>} />
            <Route path="dashboard" element={<Suspense fallback={<DashboardSkeleton />}><EmployeeDashboard /></Suspense>} />
            <Route path="attendance" element={<Suspense fallback={<DashboardSkeleton />}><EmployeeAttendance /></Suspense>} />
            <Route path="leaves" element={<Suspense fallback={<DashboardSkeleton />}><EmployeeLeaves /></Suspense>} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
