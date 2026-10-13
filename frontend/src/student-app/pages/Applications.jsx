import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL, formatResumeUrl } from '../config';
import { 
  Search, 
  CheckCircle, 
  X, 
  FileText, 
  ExternalLink, 
  Send, 
  Users, 
  FileSpreadsheet,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Clock,
  Building,
  RotateCcw,
  Sparkles,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportToExcel } from '../utils/exportToExcel';
import OfferLetterModal from '../components/OfferLetterModal';

const PRESET_DOMAINS = [
  'MERN stack', 
  'Full stack (DJANGO)', 
  'FULL STACK PHP', 
  'WEB DESIGN', 
  'Data Analytics', 
  'DATA Science', 
  'AI/ML',
  'Human Resources (HR)',
  'Marketing',
  'Digital Marketing',
  'Finance'
];

const getAvatarPalette = (name) => {
  const palettes = [
    { bg: 'rgba(249, 115, 22, 0.12)', color: '#ea580c', border: 'rgba(249, 115, 22, 0.25)' },
    { bg: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: 'rgba(16, 185, 129, 0.25)' },
    { bg: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', border: 'rgba(59, 130, 246, 0.25)' },
    { bg: 'rgba(139, 92, 246, 0.12)', color: '#7c3aed', border: 'rgba(139, 92, 246, 0.25)' },
    { bg: 'rgba(236, 72, 153, 0.12)', color: '#db2777', border: 'rgba(236, 72, 153, 0.25)' }
  ];
  const charCode = (name || 'S').charCodeAt(0);
  return palettes[charCode % palettes.length];
};

const getInitials = (name) => {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export default function Applications({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [offerLetterApp, setOfferLetterApp] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/jobs/applications`);
      const allApps = res.data || [];
      // Filter for student / internship applications
      const internApps = allApps.filter(a => {
        const titleLower = (a.jobTitle || '').toLowerCase();
        const expLower = (a.experience || '').toLowerCase();
        return titleLower.includes('intern') || a.domain || expLower.includes('student') || expLower.includes('college') || expLower.includes('batch');
      });
      setApplications(internApps);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const allKnownDomains = useMemo(() => {
    const customSet = new Set(PRESET_DOMAINS);
    applications.forEach(a => a.domain && customSet.add(a.domain));
    return ['All', ...Array.from(customSet)];
  }, [applications]);

  const stats = useMemo(() => {
    const pending = applications.filter(a => !a.status || a.status === 'Pending' || a.status === 'Pending Review').length;
    const accepted = applications.filter(a => a.status === 'Accepted').length;
    const rejected = applications.filter(a => a.status === 'Rejected').length;
    return { total: applications.length, pending, accepted, rejected };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = 
        (a.candidateName || '').toLowerCase().includes(q) ||
        (a.candidateEmail || '').toLowerCase().includes(q) ||
        (a.candidatePhone || '').includes(q) ||
        (a.college || '').toLowerCase().includes(q);

      const matchDomain = domainFilter === 'All' || a.domain === domainFilter;
      const matchStatus = 
        statusFilter === 'All' ? true :
        statusFilter === 'Pending' ? (!a.status || a.status === 'Pending' || a.status === 'Pending Review') :
        a.status === statusFilter;

      return matchSearch && matchDomain && matchStatus;
    });
  }, [applications, search, domainFilter, statusFilter]);

  const hasActiveFilters = search || domainFilter !== 'All' || statusFilter !== 'All';

  const resetFilters = () => {
    setSearch('');
    setDomainFilter('All');
    setStatusFilter('All');
  };

  const handleAccept = async (app) => {
    const candidateName = app.candidateName || 'Student';
    const email = app.candidateEmail || '';
    const domain = app.domain || 'MERN stack';
    const duration = app.duration || 2;

    const confirmMsg = `Accept ${candidateName} for ${domain} (${duration} Months)?\n\nThis will automatically:\n1. Enroll candidate into Student Directory\n2. Generate official Certificate sequence\n3. Dispatch official Offer Letter email to ${email}`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      setActionLoadingId(app._id);
      const res = await axios.put(`${API_BASE_URL}/api/jobs/applications/${app._id}/accept`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      alert(res.data?.message || `Application accepted! Student enrolled and Offer Letter dispatched to ${email}.`);
      if (selectedApp?._id === app._id) {
        setSelectedApp(null);
      }
      fetchApplications();
    } catch (err) {
      console.error('Error accepting application:', err);
      alert(err.response?.data?.error || 'Failed to accept student application.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (app) => {
    if (!window.confirm(`Are you sure you want to reject application from ${app.candidateName}?`)) return;

    try {
      setActionLoadingId(app._id);
      await axios.put(`${API_BASE_URL}/api/jobs/applications/${app._id}/reject`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (selectedApp?._id === app._id) {
        setSelectedApp(null);
      }
      fetchApplications();
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert('Failed to reject application.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleExport = () => {
    const cols = [
      { label: 'Name', key: 'candidateName' },
      { label: 'Email', key: 'candidateEmail' },
      { label: 'Phone', key: 'candidatePhone' },
      { label: 'Domain', key: 'domain' },
      { label: 'Joining Date', key: 'joining_date' },
      { label: 'Duration (Months)', key: 'duration' },
      { label: 'College', key: 'college' },
      { label: 'Branch', key: 'branch' },
      { label: 'Graduation Year', key: 'graduationYear' },
      { label: 'Status', key: 'status' }
    ];
    exportToExcel(filteredApplications, cols, 'Student_Applications');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header mb-6">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            Student Applications
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            Candidate Applications & Offer Letter Management
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn btn-excel" 
            onClick={handleExport}
          >
            <FileSpreadsheet size={18} style={{ marginRight: '0.5rem' }} />
            Export Excel
          </button>
          <Link to="/student/students" className="btn btn-primary" style={{ color: '#ffffff', textDecoration: 'none' }}>
            <Users size={18} style={{ marginRight: '0.5rem', color: '#ffffff' }} />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>Student Directory</span>
          </Link>
        </div>
      </div>



      {/* Status Filter Tab Pills */}
      <div className="filter-tabs-container">
        {[
          { id: 'All', label: 'All Applications', count: stats.total },
          { id: 'Pending', label: 'Pending Review', count: stats.pending },
          { id: 'Accepted', label: 'Accepted & Enrolled', count: stats.accepted },
          { id: 'Rejected', label: 'Rejected', count: stats.rejected }
        ].map(tab => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`filter-tab-btn ${isActive ? 'active' : ''}`}
            >
              <span>{tab.label}</span>
              <span className="filter-tab-badge">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-5 mb-6" style={{ borderRadius: '14px' }}>
        <div className="search-filter-bar">
          <div className="input-group" style={{ flex: 1, margin: 0, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search by candidate name, email, phone, or college..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', borderRadius: '10px' }}
            />
          </div>
          <div className="input-group" style={{ margin: 0, width: '240px' }}>
            <select 
              className="input-field"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{ borderRadius: '10px' }}
            >
              {allKnownDomains.map(d => (
                <option key={d} value={d} style={{ background: 'var(--bg-secondary)' }}>
                  {d === 'All' ? 'All Domains' : d}
                </option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 0.9rem', gap: '0.4rem', borderRadius: '10px' }}
              title="Reset search & filters"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          )}
        </div>
        
        {/* Results Counter Sub-bar */}
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <div>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredApplications.length}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{applications.length}</strong> applications
          </div>
          {hasActiveFilters && (
            <div style={{ color: 'var(--accent-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Filter size={13} /> Filters active
            </div>
          )}
        </div>
      </div>

      {/* Data Table Container (Desktop Table + Mobile Cards) */}
      <div className="glass-panel data-table-container" style={{ borderRadius: '14px', overflow: 'hidden' }}>
        {/* Desktop Table View */}
        <table className="data-table-refined desktop-only-table">
          <thead>
            <tr>
              <th>CANDIDATE</th>
              <th>DOMAIN</th>
              <th>JOINING DATE</th>
              <th>DURATION</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <Clock size={24} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
                    <span>Loading student applications...</span>
                  </div>
                </td>
              </tr>
            ) : filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={32} style={{ opacity: 0.4 }} />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No matching applications found</span>
                    <span style={{ fontSize: '0.82rem' }}>Try broadening your search term or domain filter.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredApplications.map(app => {
                const isAccepted = app.status === 'Accepted';
                const isRejected = app.status === 'Rejected';
                const isPending = !isAccepted && !isRejected;
                const isLoading = actionLoadingId === app._id;
                const palette = getAvatarPalette(app.candidateName);
                const initials = getInitials(app.candidateName);

                const joinDateStr = app.joining_date 
                  ? new Date(app.joining_date).toLocaleDateString()
                  : 'N/A';

                return (
                  <tr key={app._id}>
                    {/* Candidate Info with Avatar Badge */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div 
                          className="avatar-badge"
                          style={{ 
                            background: palette.bg, 
                            color: palette.color, 
                            border: `1px solid ${palette.border}` 
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                            {app.candidateName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                            {app.candidateEmail || 'No email'}{app.candidatePhone ? ` • ${app.candidatePhone}` : ''}
                          </div>
                          {app.college && (
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px', opacity: 0.85 }}>
                              {app.college} {app.branch ? `(${app.branch})` : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Domain Capsule Badge */}
                    <td>
                      <span className="badge badge-domain" style={{ fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: '8px' }}>
                        {app.domain || 'MERN stack'}
                      </span>
                    </td>

                    {/* Joining Date */}
                    <td style={{ fontSize: '0.88rem', fontWeight: 500 }}>{joinDateStr}</td>

                    {/* Duration */}
                    <td style={{ fontSize: '0.88rem' }}>{app.duration || 2} months</td>

                    {/* Status Capsule Badge with Live Dot */}
                    <td>
                      {isAccepted ? (
                        <div>
                          <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <span className="status-dot status-dot-active"></span> Active (Enrolled)
                          </span>
                          {app.offerLetterSent && (
                            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600, marginTop: '3px' }}>
                              Offer Letter Sent
                            </div>
                          )}
                        </div>
                      ) : isRejected ? (
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center' }}>
                          <span className="status-dot status-dot-rejected"></span> Rejected
                        </span>
                      ) : (
                        <span className="badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', display: 'inline-flex', alignItems: 'center' }}>
                          <span className="status-dot status-dot-pending"></span> Pending Review
                        </span>
                      )}
                    </td>

                    {/* Actions - Clean compact icon group */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {/* Quick View Details Button */}
                        <button
                          type="button"
                          className="icon-action-btn"
                          title="View Details"
                          onClick={() => setSelectedApp(app)}
                        >
                          <Eye size={16} />
                        </button>

                        {/* Resume Link Button */}
                        {app.resumeUrl && (
                          <a
                            href={formatResumeUrl(app.resumeUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="icon-action-btn"
                            style={{ color: 'var(--accent-primary)' }}
                            title="View / Download Resume"
                          >
                            <FileText size={16} />
                          </a>
                        )}

                        {/* Offer Letter Preview Button */}
                        <button
                          type="button"
                          className="icon-action-btn"
                          style={{ color: '#ea580c', borderColor: 'rgba(234, 88, 12, 0.4)', background: '#fff7ed' }}
                          title="Preview Official Offer Letter"
                          onClick={() => setOfferLetterApp(app)}
                        >
                          <span style={{ fontSize: '13px' }}>📜</span>
                        </button>

                        {/* Accept / Reject actions */}
                        {isPending && (
                          <>
                            <button
                              type="button"
                              className="btn btn-success"
                              disabled={isLoading}
                              onClick={() => handleAccept(app)}
                              style={{ 
                                padding: '0.35rem 0.75rem', 
                                fontSize: '0.8rem',
                                gap: '0.35rem',
                                borderRadius: '8px'
                              }}
                              title="Accept & Send Offer Letter"
                            >
                              <Send size={13} />
                              <span>{isLoading ? 'Sending...' : 'Accept'}</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              disabled={isLoading}
                              onClick={() => handleReject(app)}
                              style={{ 
                                padding: '0.35rem 0.55rem',
                                fontSize: '0.8rem',
                                borderRadius: '8px' 
                              }}
                              title="Reject Application"
                            >
                              <X size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Mobile-Optimized Candidate Cards List */}
        <div className="mobile-applications-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
              <Clock size={22} className="animate-spin" style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
              <div>Loading applications...</div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
              <Users size={28} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No matching applications found</div>
            </div>
          ) : (
            filteredApplications.map(app => {
              const isAccepted = app.status === 'Accepted';
              const isRejected = app.status === 'Rejected';
              const isPending = !isAccepted && !isRejected;
              const isLoading = actionLoadingId === app._id;
              const palette = getAvatarPalette(app.candidateName);
              const initials = getInitials(app.candidateName);

              const joinDateStr = app.joining_date 
                ? new Date(app.joining_date).toLocaleDateString()
                : 'N/A';

              return (
                <div key={app._id} className="mobile-app-card">
                  {/* Candidate Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div 
                        className="avatar-badge"
                        style={{ 
                          background: palette.bg, 
                          color: palette.color, 
                          border: `1px solid ${palette.border}`,
                          width: '38px',
                          height: '38px'
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                          {app.candidateName}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                          {app.candidateEmail || 'No email'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="icon-action-btn"
                        title="View Details"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye size={15} />
                      </button>

                      {app.resumeUrl && (
                        <a
                          href={formatResumeUrl(app.resumeUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="icon-action-btn"
                          style={{ color: 'var(--accent-primary)' }}
                          title="View Resume"
                        >
                          <FileText size={15} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className="badge badge-domain" style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}>
                      {app.domain || 'MERN stack'}
                    </span>
                    {isAccepted ? (
                      <span className="badge badge-active" style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}>
                        <span className="status-dot status-dot-active"></span> Active (Enrolled)
                      </span>
                    ) : isRejected ? (
                      <span className="badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}>
                        <span className="status-dot status-dot-rejected"></span> Rejected
                      </span>
                    ) : (
                      <span className="badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}>
                        <span className="status-dot status-dot-pending"></span> Pending Review
                      </span>
                    )}
                  </div>

                  {/* Joining & College Meta */}
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', marginBottom: isPending ? '0.65rem' : '0' }}>
                    <span>Joining: <strong style={{ color: 'var(--text-primary)' }}>{joinDateStr}</strong> ({app.duration || 2}m)</span>
                    {app.college && <span>🎓 {app.college}</span>}
                  </div>

                  {/* Accept / Reject Action Footer */}
                  {isPending && (
                    <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.55rem', borderTop: '1px solid var(--border-color)', marginTop: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={isLoading}
                        onClick={() => handleReject(app)}
                        style={{ flex: 1, padding: '0.45rem', fontSize: '0.78rem', justifyContent: 'center', borderRadius: '8px' }}
                      >
                        <X size={14} style={{ marginRight: '0.25rem' }} />
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn btn-success"
                        disabled={isLoading}
                        onClick={() => handleAccept(app)}
                        style={{ flex: 2, padding: '0.45rem', fontSize: '0.78rem', justifyContent: 'center', borderRadius: '8px' }}
                      >
                        <Send size={13} style={{ marginRight: '0.3rem' }} />
                        {isLoading ? 'Sending...' : 'Accept Candidate'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Application Details</h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>ID: {selectedApp._id}</span>
              </div>
              <button 
                className="icon-action-btn"
                style={{ borderRadius: '50%' }}
                onClick={() => setSelectedApp(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Candidate Info Card */}
              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '0.9rem', alignItems: 'center' }}>
                <div 
                  className="avatar-badge"
                  style={{ 
                    width: '46px',
                    height: '46px',
                    fontSize: '1rem',
                    ...getAvatarPalette(selectedApp.candidateName)
                  }}
                >
                  {getInitials(selectedApp.candidateName)}
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedApp.candidateName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={13} /> {selectedApp.candidateEmail || 'N/A'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Phone size={13} /> {selectedApp.candidatePhone || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic & Domain Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.04em' }}>DOMAIN</div>
                  <div style={{ fontWeight: 700, marginTop: '0.25rem', color: 'var(--accent-primary)', fontSize: '0.92rem' }}>
                    {selectedApp.domain || 'MERN stack'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.04em' }}>DURATION</div>
                  <div style={{ fontWeight: 700, marginTop: '0.25rem', fontSize: '0.92rem' }}>
                    {selectedApp.duration || 2} Months
                  </div>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.04em' }}>JOINING DATE</div>
                  <div style={{ fontWeight: 600, marginTop: '0.25rem', fontSize: '0.9rem' }}>
                    {selectedApp.joining_date ? new Date(selectedApp.joining_date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.04em' }}>STATUS</div>
                  <div style={{ fontWeight: 600, marginTop: '0.25rem', fontSize: '0.9rem' }}>
                    {selectedApp.status || 'Pending Review'}
                  </div>
                </div>
              </div>

              {/* College & Degree */}
              {(selectedApp.college || selectedApp.branch || selectedApp.graduationYear) && (
                <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.04em' }}>COLLEGE / ACADEMIC BACKGROUND</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '0.3rem', color: 'var(--text-primary)' }}>
                    {selectedApp.college || 'College not specified'}
                  </div>
                  {(selectedApp.branch || selectedApp.graduationYear) && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {selectedApp.branch ? `Branch: ${selectedApp.branch}` : ''}
                      {selectedApp.graduationYear ? ` • Passing Year: ${selectedApp.graduationYear}` : ''}
                    </div>
                  )}
                </div>
              )}

              {/* Cover Note */}
              {selectedApp.coverNote && (
                <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.04em' }}>NOTE / OBJECTIVES</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.3rem', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {selectedApp.coverNote}
                  </div>
                </div>
              )}

              {/* Resume button */}
              {selectedApp.resumeUrl && (
                <div>
                  <a
                    href={formatResumeUrl(selectedApp.resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center', borderRadius: '10px' }}
                  >
                    <FileText size={16} />
                    View / Download Resume
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedApp(null)}
                  style={{ borderRadius: '10px' }}
                >
                  Close
                </button>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setOfferLetterApp(selectedApp)}
                    style={{ gap: '0.4rem', borderRadius: '10px', color: '#ea580c', borderColor: '#fed7aa', background: '#fff7ed' }}
                  >
                    <span>📜</span>
                    Preview Offer Letter
                  </button>

                  {(!selectedApp.status || selectedApp.status === 'Pending' || selectedApp.status === 'Pending Review') && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleReject(selectedApp)}
                        style={{ borderRadius: '10px' }}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => handleAccept(selectedApp)}
                        style={{ gap: '0.4rem', borderRadius: '10px' }}
                      >
                        <Send size={15} />
                        Accept & Send Offer Letter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offer Letter Modal */}
      {offerLetterApp && (
        <OfferLetterModal
          student={{
            name: offerLetterApp.candidateName,
            email: offerLetterApp.candidateEmail,
            phone: offerLetterApp.candidatePhone,
            domain: offerLetterApp.domain || offerLetterApp.jobTitle,
            joining_date: offerLetterApp.joining_date,
            duration: offerLetterApp.duration
          }}
          initialDomain={offerLetterApp.domain || offerLetterApp.jobTitle}
          onClose={() => setOfferLetterApp(null)}
        />
      )}
    </div>
  );
}
