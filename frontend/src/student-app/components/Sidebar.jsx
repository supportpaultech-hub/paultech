import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, HelpCircle, FileSpreadsheet, LogOut, X, Sun, Moon, GraduationCap } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { exportToExcel } from '../utils/exportToExcel';

export default function Sidebar({ user, onLogout, isOpen, onClose, darkMode, onToggleDarkMode }) {
  const location = useLocation();
  const [pendingAppsCount, setPendingAppsCount] = useState(0);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/jobs/applications`);
        const pending = (res.data || []).filter(a => {
          const isPending = !a.status || a.status === 'Pending' || a.status === 'Pending Review';
          const isIntern = (a.jobTitle || '').toLowerCase().includes('intern') || a.domain || (a.experience || '').toLowerCase().includes('student');
          return isPending && isIntern;
        }).length;
        setPendingAppsCount(pending);
      } catch (e) {}
    };
    fetchPending();
  }, [location.pathname]);

  const handleExportAll = async () => {
    try {
      const [studentsRes, enquiriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/students`, { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get(`${API_BASE_URL}/api/enquiries`, { headers: { Authorization: `Bearer ${user.token}` } })
      ]);

      const studentCols = [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Domain', key: 'domain' },
        { label: 'Joining Date', key: 'joining_date' },
        { label: 'Duration (Months)', key: 'duration' },
        { label: 'Status', key: 'status' }
      ];

      exportToExcel(studentsRes.data, studentCols, 'Students_Record');
    } catch (err) {
      alert('Error exporting data');
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile Close Button */}
      <button 
        className="sidebar-close-btn" 
        onClick={onClose}
        title="Close navigation menu"
      >
        <X size={20} />
      </button>

      {/* Sidebar Header Section */}
      <div className="sidebar-header" style={{ marginBottom: '1.25rem', flexShrink: 0 }}>
        <div style={{ 
          background: '#ffffff', 
          padding: '0.75rem 1rem', 
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/logo.png" 
            alt="PaulTech Software Services" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              display: 'block'
            }} 
          />
        </div>
        <div className="badge badge-domain" style={{ marginTop: '0.75rem', textTransform: 'none', width: '100%', justifyContent: 'center' }}>
          {user.role === 'ADMIN' ? 'Mrs. Daljeet Paul' : user.role}
        </div>
      </div>
      
      {/* Scrollable Navigation Items */}
      <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link 
          to="/student/dashboard" 
          onClick={onClose}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', 
            borderRadius: 'var(--radius-md)',
            background: (isActive('/student/dashboard') || isActive('/student') || isActive('/student/')) ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
            color: (isActive('/student/dashboard') || isActive('/student') || isActive('/student/')) ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: (isActive('/student/dashboard') || isActive('/student') || isActive('/student/')) ? 600 : 500,
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <LayoutDashboard size={19} />
          Dashboard
        </Link>

        <Link 
          to="/student/applications" 
          onClick={onClose}
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0.9rem', 
            borderRadius: 'var(--radius-md)',
            background: isActive('/student/applications') ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
            color: isActive('/student/applications') ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: isActive('/student/applications') ? 600 : 500,
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <GraduationCap size={19} />
            <span>Applications</span>
          </div>
          {pendingAppsCount > 0 && (
            <span style={{
              background: '#f97316',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              minWidth: '18px',
              textAlign: 'center'
            }}>
              {pendingAppsCount}
            </span>
          )}
        </Link>

        <Link 
          to="/student/students" 
          onClick={onClose}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', 
            borderRadius: 'var(--radius-md)',
            background: isActive('/student/students') ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
            color: isActive('/student/students') ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: isActive('/student/students') ? 600 : 500,
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={19} />
          Students
        </Link>

        <Link 
          to="/student/enquiries" 
          onClick={onClose}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', 
            borderRadius: 'var(--radius-md)',
            background: isActive('/student/enquiries') ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
            color: isActive('/student/enquiries') ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: isActive('/student/enquiries') ? 600 : 500,
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <HelpCircle size={19} />
          Enquiries
        </Link>

        <button 
          onClick={() => {
            handleExportAll();
            onClose();
          }}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem', 
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            color: '#107c41',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '0.88rem',
            transition: 'all 0.2s ease'
          }}
          title="Export records to Excel sheet"
        >
          <FileSpreadsheet size={19} />
          Export Excel
        </button>
      </nav>

      {/* Fixed Sidebar Footer Section (Dark Mode & Logout) */}
      <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '0.75rem', flexShrink: 0, borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button 
          className="theme-toggle-btn" 
          onClick={onToggleDarkMode}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          style={{ margin: 0 }}
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button className="btn btn-secondary" onClick={onLogout} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}


