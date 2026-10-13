import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  Users, 
  Code, 
  Activity, 
  HelpCircle, 
  UserCheck, 
  ArrowUpRight, 
  Layers, 
  X,
  Sparkles,
  BarChart3,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('interns'); // 'interns' | 'enquiries'
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedDomainModal, setSelectedDomainModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, enquiryRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/students`, { headers: { Authorization: `Bearer ${user.token}` } }),
          axios.get(`${API_BASE_URL}/api/enquiries`, { headers: { Authorization: `Bearer ${user.token}` } })
        ]);
        setStudents(studentRes.data);
        setEnquiries(enquiryRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user.token]);

  // Statistics
  const stats = useMemo(() => {
    const totalEnquiries = enquiries.length;
    const convertedCount = enquiries.filter(e => e.status === 'Converted').length;
    const conversionRate = totalEnquiries > 0 ? Math.round((convertedCount / totalEnquiries) * 100) : 0;
    
    return {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.status === 'Active').length,
      totalEnquiries,
      conversionRate
    };
  }, [students, enquiries]);

  // Domain Distribution based on active tab
  const domainData = useMemo(() => {
    const counts = {};
    PRESET_DOMAINS.forEach(d => { counts[d] = 0; });

    const sourceData = activeTab === 'interns' ? students : enquiries;

    sourceData.forEach(item => {
      if (item.domain) {
        counts[item.domain] = (counts[item.domain] || 0) + 1;
      }
    });

    return Object.keys(counts).map(domain => ({
      name: domain,
      count: counts[domain] || 0
    }));
  }, [students, enquiries, activeTab]);

  const maxCount = useMemo(() => {
    const counts = domainData.map(d => d.count);
    return Math.max(...counts, 1);
  }, [domainData]);

  // Records for selected domain modal
  const selectedDomainItems = useMemo(() => {
    if (!selectedDomainModal) return [];
    if (activeTab === 'interns') {
      return students.filter(s => s.domain === selectedDomainModal);
    } else {
      return enquiries.filter(e => e.domain === selectedDomainModal);
    }
  }, [selectedDomainModal, activeTab, students, enquiries]);

  const colors = [
    'linear-gradient(135deg, #0078d4 0%, #00bcd4 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    'linear-gradient(135deg, #64748b 0%, #475569 100%)'
  ];

  return (
    <div>
      {/* Top Header & Quick Actions */}
      <div className="page-header mb-6">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            Welcome back, {user.role === 'ADMIN' ? 'Mrs. Daljeet Paul' : 'Developer'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', borderRadius: '10px' }}
            onClick={() => navigate('/student/enquiries')}
          >
            <HelpCircle size={16} style={{ marginRight: '0.4rem' }} />
            View Enquiries
          </button>
          <button 
            className="btn btn-primary" 
            style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', borderRadius: '10px' }}
            onClick={() => navigate('/student/students')}
          >
            <Users size={16} style={{ marginRight: '0.4rem' }} />
            Manage Students
          </button>
        </div>
      </div>
      
      {/* Executive Metric Cards Row */}
      <div className="stats-grid-4">
        
        <div className="stat-card-refined" style={{ '--card-accent': 'linear-gradient(90deg, #0078d4, #00bcd4)' }}>
          <div>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(0, 120, 212, 0.1)', color: '#0078d4' }}>
              <Users size={18} />
            </div>
            <div className="stat-title">Total Interns</div>
            <div className="stat-value">{stats.totalStudents}</div>
          </div>
        </div>

        <div className="stat-card-refined" style={{ '--card-accent': 'linear-gradient(90deg, #10b981, #059669)' }}>
          <div>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
              <Activity size={18} />
            </div>
            <div className="stat-title">Active Interns</div>
            <div className="stat-value">{stats.activeStudents}</div>
          </div>
        </div>

        <div className="stat-card-refined" style={{ '--card-accent': 'linear-gradient(90deg, #f59e0b, #d97706)' }}>
          <div>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
              <HelpCircle size={18} />
            </div>
            <div className="stat-title">Enquiries</div>
            <div className="stat-value">{stats.totalEnquiries}</div>
          </div>
        </div>

        <div className="stat-card-refined" style={{ '--card-accent': 'linear-gradient(90deg, #8b5cf6, #6d28d9)' }}>
          <div>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed' }}>
              <UserCheck size={18} />
            </div>
            <div className="stat-title">Conversion Rate</div>
            <div className="stat-value">{stats.conversionRate}%</div>
          </div>
        </div>

      </div>

      {/* Main 2-Column Compact Layout */}
      <div className="dashboard-grid">
        
        {/* Left Column: Interactive Domain Distribution Bar Chart */}
        <div className="dashboard-card">
          <div className="domain-header-row">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={18} style={{ color: 'var(--accent-primary)' }} /> Domain Distribution
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>
                Click any domain bar to inspect registered records
              </span>
            </div>
            
            {/* Non-wrapping Segmented Tab Switcher */}
            <div className="domain-tab-switcher">
              <button 
                onClick={() => setActiveTab('interns')}
                className={`domain-tab-btn ${activeTab === 'interns' ? 'active' : ''}`}
              >
                Interns
              </button>
              <button 
                onClick={() => setActiveTab('enquiries')}
                className={`domain-tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
              >
                Enquiries
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {domainData.map((item, index) => {
              const percentage = maxCount > 0 && item.count > 0 ? Math.round((item.count / maxCount) * 100) : 0;
              const isHovered = hoveredBar === index;
              
              return (
                <div 
                  key={item.name}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  onClick={() => setSelectedDomainModal(item.name)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    background: isHovered ? 'rgba(249, 115, 22, 0.04)' : 'transparent',
                    border: isHovered ? '1px solid rgba(249, 115, 22, 0.15)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  title="Click to view details"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                    <span style={{ color: isHovered ? 'var(--accent-primary)' : 'var(--text-primary)', fontWeight: isHovered ? 600 : 500, transition: 'color 0.2s' }}>
                      {item.name}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                      {item.count} {activeTab === 'interns' ? (item.count === 1 ? 'Intern' : 'Interns') : (item.count === 1 ? 'Enquiry' : 'Enquiries')}
                    </span>
                  </div>

                  <div style={{ 
                    height: '8px', 
                    width: '100%', 
                    background: 'var(--border-color)', 
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${item.count > 0 ? percentage : 2}%`,
                      background: colors[index % colors.length],
                      borderRadius: '9999px',
                      opacity: item.count > 0 ? 1 : 0.4,
                      transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isHovered ? '0 0 12px rgba(249, 115, 22, 0.4)' : 'none'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Quick Recent Activity Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '1.4rem',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: 700 }}>Recent Enquiries</h4>
              <button 
                onClick={() => navigate('/student/enquiries')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                View all <ArrowUpRight size={14} />
              </button>
            </div>

            {enquiries.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem 0' }}>
                No enquiries recorded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {enquiries.slice(0, 4).map(enquiry => (
                  <div key={enquiry._id || enquiry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{enquiry.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '1px' }}>{enquiry.domain || 'General'}</div>
                    </div>
                    <span className="badge" style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      background: enquiry.status === 'Converted' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      color: enquiry.status === 'Converted' ? '#059669' : '#d97706',
                      border: enquiry.status === 'Converted' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      {enquiry.status || 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.06) 0%, rgba(234, 88, 12, 0.08) 100%)',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            boxShadow: '0 4px 14px rgba(249, 115, 22, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Interactive Quick View</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Click on any domain row in the chart to instantly filter and inspect student records!
            </p>
          </div>

        </div>

      </div>

      {/* Interactive Click Detail Modal */}
      {selectedDomainModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedDomainModal}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {activeTab === 'interns' ? 'Enrolled Interns' : 'Student Enquiries'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedDomainModal(null)} 
                className="icon-action-btn"
                style={{ borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
              {selectedDomainItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  No records found under {selectedDomainModal}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {selectedDomainItems.map((item) => (
                    <div key={item._id || item.id} style={{ padding: '0.85rem', background: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {item.email || item.phone || 'No contact'}
                          {item.college && <span style={{ marginLeft: '6px', color: 'var(--accent-primary)', fontWeight: 500 }}>• 🎓 {item.college}</span>}
                        </div>
                      </div>
                      <span className="badge badge-active" style={{ fontSize: '0.72rem', borderRadius: '6px' }}>
                        {item.status || 'Enrolled'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
