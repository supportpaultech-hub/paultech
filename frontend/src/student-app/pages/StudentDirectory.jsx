import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL, formatResumeUrl } from '../config';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  FileSpreadsheet, 
  Award, 
  GraduationCap, 
  FileText, 
  Upload, 
  X, 
  ExternalLink,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { exportToExcel } from '../utils/exportToExcel';
import CertificateModal from '../components/CertificateModal';
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

export default function StudentDirectory({ user }) {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [pendingAppsCount, setPendingAppsCount] = useState(0);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('MERN stack');
  const [customDomain, setCustomDomain] = useState('');
  const [selectedStudentForCertificate, setSelectedStudentForCertificate] = useState(null);
  const [selectedStudentForOfferLetter, setSelectedStudentForOfferLetter] = useState(null);
  const [showOfferLetterTemplateModal, setShowOfferLetterTemplateModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [savingStudent, setSavingStudent] = useState(false);

  // Form input states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDuration, setFormDuration] = useState(3);
  const [formJoiningDate, setFormJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formCollege, setFormCollege] = useState('');
  const [formBranch, setFormBranch] = useState('');
  const [formGraduationYear, setFormGraduationYear] = useState('2026');
  const [formResumeUrl, setFormResumeUrl] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [formSendWelcomeEmail, setFormSendWelcomeEmail] = useState(true);

  // Prefill state if converted from Enquiry navigation
  const [prefilledData, setPrefilledData] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingApps = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/jobs/applications`);
      const allApps = res.data || [];
      const pending = allApps.filter(a => {
        const isPending = !a.status || a.status === 'Pending' || a.status === 'Pending Review';
        const isIntern = (a.jobTitle || '').toLowerCase().includes('intern') || a.domain || (a.experience || '').toLowerCase().includes('student');
        return isPending && isIntern;
      });
      setPendingApplications(pending);
      setPendingAppsCount(pending.length);
    } catch (e) {}
  };

  const resetFormState = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setSelectedDomain('MERN stack');
    setCustomDomain('');
    setFormDuration(3);
    setFormJoiningDate(new Date().toISOString().split('T')[0]);
    setFormCollege('');
    setFormBranch('');
    setFormGraduationYear('2026');
    setFormResumeUrl('');
    setResumeFile(null);
    setFormStatus('Active');
    setFormSendWelcomeEmail(true);
  };

  const handlePrefillFromApp = (app) => {
    if (!app) return;
    setFormName(app.candidateName || '');
    setFormEmail(app.candidateEmail || '');
    setFormPhone(app.candidatePhone || '');
    const isPreset = PRESET_DOMAINS.includes(app.domain);
    setSelectedDomain(isPreset ? app.domain : (app.domain ? 'Other' : 'MERN stack'));
    setCustomDomain(isPreset ? '' : app.domain || '');
    setFormDuration(app.duration ? parseInt(app.duration, 10) : 2);
    setFormJoiningDate(app.joining_date ? new Date(app.joining_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setFormCollege(app.college || '');
    setFormBranch(app.branch || '');
    setFormGraduationYear(app.graduationYear || '2026');
    setFormResumeUrl(app.resumeUrl || '');
    setResumeFile(null);
  };

  useEffect(() => {
    fetchStudents();
    fetchPendingApps();

    // Check if navigated from Enquiry Convert action
    if (location.state?.prefillEnquiry) {
      const enquiry = location.state.prefillEnquiry;
      setEditingStudent(null);
      setPrefilledData(enquiry);
      resetFormState();
      setFormName(enquiry.name || '');
      setFormEmail(enquiry.email || '');
      setFormPhone(enquiry.phone || '');
      const isPreset = PRESET_DOMAINS.includes(enquiry.domain);
      setSelectedDomain(isPreset ? enquiry.domain : 'Other');
      setCustomDomain(isPreset ? '' : enquiry.domain || '');
      setShowModal(true);
    } else if (location.state?.prefillApplication) {
      const app = location.state.prefillApplication;
      setEditingStudent(null);
      setPrefilledData(null);
      resetFormState();
      handlePrefillFromApp(app);
      setShowModal(true);
    }
  }, [user.token, location.state]);

  const allKnownDomains = useMemo(() => {
    const customSet = new Set(PRESET_DOMAINS);
    students.forEach(s => s.domain && customSet.add(s.domain));
    return ['All', ...Array.from(customSet)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = 
        (s.name || '').toLowerCase().includes(q) || 
        (s.email || '').toLowerCase().includes(q) ||
        (s.phone || '').includes(q) ||
        (s.college || '').toLowerCase().includes(q) ||
        (s.branch || '').toLowerCase().includes(q);
      const matchDomain = domainFilter === 'All' || s.domain === domainFilter;
      return matchSearch && matchDomain;
    });
  }, [students, search, domainFilter]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setPrefilledData(null);
    resetFormState();
    setShowModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setPrefilledData(null);
    setFormName(student.name || '');
    setFormEmail(student.email || '');
    setFormPhone(student.phone || '');
    const isPreset = PRESET_DOMAINS.includes(student.domain);
    setSelectedDomain(isPreset ? student.domain : 'Other');
    setCustomDomain(isPreset ? '' : student.domain || '');
    setFormDuration(student.duration || 3);
    setFormJoiningDate(student.joining_date ? new Date(student.joining_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setFormCollege(student.college || '');
    setFormBranch(student.branch || '');
    setFormGraduationYear(student.graduationYear || '2026');
    setFormResumeUrl(student.resumeUrl || '');
    setResumeFile(null);
    setFormStatus(student.status || 'Active');
    setFormSendWelcomeEmail(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/students/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchStudents();
      } catch (err) {
        alert('Failed to delete student');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter student name');
      return;
    }

    let finalDomain = selectedDomain;
    if (selectedDomain === 'Other') {
      if (!customDomain.trim()) {
        alert('Please specify the custom domain name');
        return;
      }
      finalDomain = customDomain.trim();
    }

    setSavingStudent(true);
    const formData = new FormData();
    formData.append('name', formName.trim());
    formData.append('email', formEmail.trim());
    formData.append('phone', formPhone.trim());
    formData.append('domain', finalDomain);
    formData.append('duration', formDuration);
    formData.append('joining_date', formJoiningDate);
    formData.append('college', formCollege.trim());
    formData.append('branch', formBranch.trim());
    formData.append('graduationYear', formGraduationYear);
    
    if (formResumeUrl) {
      formData.append('resumeUrl', formResumeUrl);
    }
    if (editingStudent) {
      formData.append('status', formStatus);
    } else {
      formData.append('sendWelcomeEmail', formSendWelcomeEmail);
    }
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    try {
      if (editingStudent) {
        await axios.put(`${API_BASE_URL}/api/students/${editingStudent._id || editingStudent.id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/students`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }
      setShowModal(false);
      resetFormState();
      fetchStudents();
      fetchPendingApps();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error saving student record');
    } finally {
      setSavingStudent(false);
    }
  };

  const handleExport = () => {
    const cols = [
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'Domain', key: 'domain' },
      { label: 'Joining Date', key: 'joining_date' },
      { label: 'Duration (Months)', key: 'duration' },
      { label: 'College', key: 'college' },
      { label: 'Branch', key: 'branch' },
      { label: 'Graduation Year', key: 'graduationYear' },
      { label: 'Resume URL', key: 'resumeUrl' },
      { label: 'Status', key: 'status' }
    ];
    exportToExcel(filteredStudents, cols, 'Students_Directory');
  };

  return (
    <div>
      <div className="page-header mb-6">
        <div>
          <h1 style={{ margin: 0 }}>Student Directory</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.9rem' }}>
            Registered Interns & Active Student Management
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary" 
            style={{ color: '#107c41', borderColor: '#107c41' }}
            onClick={handleExport}
          >
            <FileSpreadsheet size={18} style={{ marginRight: '0.5rem' }} />
            Export Excel
          </button>

          <button 
            className="btn btn-secondary" 
            style={{ color: '#ea580c', borderColor: '#ea580c', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            onClick={() => setShowOfferLetterTemplateModal(true)}
            title="View / Download Blank Offer Letter Format & Domain Templates"
          >
            <span>📜</span>
            <span>Offer Letter</span>
          </button>
          
          <Link
            to="/student/applications"
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent-primary)',
              borderColor: 'var(--accent-primary)',
              textDecoration: 'none'
            }}
          >
            <GraduationCap size={18} />
            <span>Applications</span>
            {pendingAppsCount > 0 && (
              <span style={{
                background: '#f97316',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: '9999px',
                padding: '0.1rem 0.45rem'
              }}>
                {pendingAppsCount} new
              </span>
            )}
          </Link>
          
          {user.role === 'ADMIN' && (
            <button className="btn btn-primary" onClick={handleOpenAdd} style={{ color: '#ffffff' }}>
              <Plus size={18} style={{ marginRight: '0.5rem', color: '#ffffff' }} />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Add Intern</span>
            </button>
          )}
        </div>
      </div>

      <div className="glass-panel p-6 mb-6">
        <div className="search-filter-bar">
          <div className="input-group" style={{ flex: 1, margin: 0, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search by name, email, phone, college, or branch..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div className="input-group" style={{ margin: 0, width: '250px' }}>
            <select 
              className="input-field"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              {allKnownDomains.map(d => (
                <option key={d} value={d} style={{ background: 'var(--bg-secondary)' }}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table Container (Desktop Table + Mobile Cards) */}
      <div className="glass-panel data-table-container" style={{ borderRadius: '14px', overflow: 'hidden' }}>
        <table className="data-table-refined desktop-only-table">
          <thead>
            <tr>
              <th>NAME & COLLEGE</th>
              <th>DOMAIN</th>
              <th>JOINING DATE</th>
              <th>DURATION</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  No interns found matching your criteria.
                </td>
              </tr>
            ) : filteredStudents.map(student => (
              <tr key={student._id || student.id}>
                {/* Name, Contact, & Academic Details */}
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {student.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                    {student.email || 'No email'}{student.phone ? ` • ${student.phone}` : ''}
                  </div>
                  {(student.college || student.branch || student.graduationYear) && (
                    <div style={{ 
                      fontSize: '0.72rem', 
                      color: 'var(--accent-primary)', 
                      marginTop: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontWeight: 500
                    }}>
                      <Building2 size={12} />
                      <span>{student.college || ''}</span>
                      {student.branch && <span>({student.branch})</span>}
                      {student.graduationYear && <span>• Batch {student.graduationYear}</span>}
                    </div>
                  )}
                </td>

                {/* Domain Badge */}
                <td>
                  <span className="badge badge-domain">
                    {student.domain}
                  </span>
                </td>

                {/* Joining Date */}
                <td>
                  {student.joining_date ? new Date(student.joining_date).toLocaleDateString() : 'N/A'}
                </td>

                {/* Duration */}
                <td>
                  {student.duration} {student.duration === 1 ? 'month' : 'months'}
                </td>

                {/* Status */}
                <td>
                  <span 
                    className={student.status === 'Active' ? 'badge badge-active' : 'badge'} 
                    style={{ 
                      background: student.status !== 'Active' ? '#f1f5f9' : '', 
                      color: student.status !== 'Active' ? '#64748b' : '', 
                      border: student.status !== 'Active' ? '1px solid #cbd5e1' : '' 
                    }}
                  >
                    {student.status || 'Active'}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div className="flex gap-2 justify-end items-center" style={{ display: 'inline-flex' }}>
                    {/* View Resume Button (if uploaded) */}
                    {student.resumeUrl && (
                      <a
                        href={formatResumeUrl(student.resumeUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', color: 'var(--accent-primary)' }}
                        title="View / Download Resume"
                      >
                        <FileText size={16} />
                      </a>
                    )}

                    {/* Generate / Manage Certificate */}
                    <button 
                      type="button"
                      className="btn btn-secondary" 
                      style={{ padding: '0.25rem 0.5rem', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }} 
                      title="Issue / Tune Official Certificate"
                      onClick={() => setSelectedStudentForCertificate(student)}
                    >
                      <Award size={16} />
                    </button>

                    {/* View / Download Official Offer Letter */}
                    <button 
                      type="button"
                      className="btn btn-secondary" 
                      style={{ padding: '0.25rem 0.5rem', background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }} 
                      title="View / Download Official Offer Letter"
                      onClick={() => setSelectedStudentForOfferLetter(student)}
                    >
                      <FileText size={16} />
                    </button>

                    {user.role === 'ADMIN' && (
                      <>
                        {/* Edit Student */}
                        <button 
                          type="button"
                          className="btn btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem' }} 
                          title="Edit Student Details"
                          onClick={() => handleOpenEdit(student)}
                        >
                          <Edit size={16} />
                        </button>

                        {/* Delete Student */}
                        <button 
                          type="button"
                          className="btn btn-danger" 
                          style={{ padding: '0.25rem 0.5rem' }} 
                          title="Delete Student"
                          onClick={() => handleDelete(student._id || student.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile-Optimized Students Cards */}
        <div className="mobile-students-list">
          {filteredStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
              No interns found matching your criteria.
            </div>
          ) : (
            filteredStudents.map(student => (
              <div key={student._id || student.id} className="mobile-app-card">
                {/* Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                      {student.email || 'No email'}{student.phone ? ` • ${student.phone}` : ''}
                    </div>
                  </div>
                  <span 
                    className={student.status === 'Active' ? 'badge badge-active' : 'badge'} 
                    style={{ 
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.55rem',
                      background: student.status !== 'Active' ? '#f1f5f9' : '', 
                      color: student.status !== 'Active' ? '#64748b' : '', 
                      border: student.status !== 'Active' ? '1px solid #cbd5e1' : '' 
                    }}
                  >
                    {student.status || 'Active'}
                  </span>
                </div>

                {/* Domain & Academic Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span className="badge badge-domain" style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}>
                    {student.domain}
                  </span>
                  {student.college && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Building2 size={12} /> {student.college} {student.branch ? `(${student.branch})` : ''}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                  Joining: <strong style={{ color: 'var(--text-primary)' }}>{student.joining_date ? new Date(student.joining_date).toLocaleDateString() : 'N/A'}</strong> ({student.duration} {student.duration === 1 ? 'month' : 'months'})
                </div>

                {/* Mobile Action Buttons Footer */}
                <div style={{ display: 'flex', gap: '0.4rem', paddingTop: '0.55rem', borderTop: '1px solid var(--border-color)', alignItems: 'center' }}>
                  {student.resumeUrl && (
                    <a
                      href={formatResumeUrl(student.resumeUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.76rem', gap: '0.3rem' }}
                    >
                      <FileText size={14} /> Resume
                    </a>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.76rem', gap: '0.3rem', color: '#059669', borderColor: 'rgba(16, 185, 129, 0.4)', justifyContent: 'center' }}
                    onClick={() => setSelectedStudentForCertificate(student)}
                  >
                    <Award size={14} /> Cert
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.76rem', gap: '0.3rem', color: '#ea580c', borderColor: 'rgba(234, 88, 12, 0.4)', justifyContent: 'center' }}
                    onClick={() => setSelectedStudentForOfferLetter(student)}
                  >
                    <span>📜</span> Offer
                  </button>

                  {user.role === 'ADMIN' && (
                    <button
                      type="button"
                      className="icon-action-btn"
                      onClick={() => handleOpenEdit(student)}
                      title="Edit Record"
                    >
                      <Edit size={14} />
                    </button>
                  )}

                  {user.role === 'ADMIN' && (
                    <button
                      type="button"
                      className="icon-action-btn"
                      style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      onClick={() => handleDelete(student._id || student.id)}
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD / EDIT INTERN MODAL (Matches all inputs from Internship Application) */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60
        }}>
          <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '560px', maxHeight: '92vh', overflowY: 'auto', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
                  {editingStudent ? 'Edit Intern' : prefilledData ? 'Enroll Converted Enquiry' : 'Add New Intern'}
                </h2>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {editingStudent ? 'Update intern and academic profile' : 'Direct student enrollment with verified internship details'}
                </p>
              </div>
              <button 
                type="button"
                className="btn btn-secondary" 
                style={{ padding: '0.25rem 0.45rem', borderRadius: '50%' }}
                onClick={() => setShowModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-col gap-4">
              
              {/* Optional Quick-fill from Pending Application */}
              {!editingStudent && pendingApplications.length > 0 && (
                <div style={{ 
                  padding: '0.75rem 0.85rem', 
                  background: 'rgba(249, 115, 22, 0.08)', 
                  borderRadius: '10px', 
                  border: '1px dashed var(--accent-primary)',
                  marginBottom: '0.5rem'
                }}>
                  <label className="input-label" style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <Sparkles size={15} />
                    <span>Quick-Fill from Pending Internship Application</span>
                  </label>
                  <select 
                    className="input-field"
                    defaultValue=""
                    onChange={(e) => {
                      const app = pendingApplications.find(a => a._id === e.target.value);
                      if (app) handlePrefillFromApp(app);
                    }}
                  >
                    <option value="">-- Select Candidate to Auto-fill Form --</option>
                    {pendingApplications.map(app => (
                      <option key={app._id} value={app._id} style={{ background: 'var(--bg-secondary)' }}>
                        {app.candidateName} — {app.domain || 'Internship'} ({app.candidateEmail || 'No email'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Candidate Full Name */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  className="input-field" 
                  placeholder="e.g. Rahul Sharma"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required 
                />
              </div>
              
              {/* Email & Phone */}
              <div className="flex gap-4">
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label className="input-label">Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="input-field" 
                    placeholder="e.g. rahul@gmail.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label className="input-label">WhatsApp / Phone *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="input-field" 
                    placeholder="e.g. +91 9876543210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Domain Selector with "Other" Support */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Internship Domain *</label>
                <select 
                  className="input-field" 
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                >
                  {PRESET_DOMAINS.map(d => (
                    <option key={d} value={d} style={{ background: 'var(--bg-secondary)' }}>{d}</option>
                  ))}
                  <option value="Other" style={{ background: 'var(--bg-secondary)' }}>Other (Type Custom Domain)...</option>
                </select>
              </div>

              {selectedDomain === 'Other' && (
                <div className="input-group animate-fade-in" style={{ margin: 0 }}>
                  <label className="input-label" style={{ color: 'var(--accent-primary)' }}>Custom Domain Name *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Enter custom domain name..." 
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Joining Date & Duration */}
              <div className="flex gap-4">
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label className="input-label">Joining Date *</label>
                  <input 
                    type="date" 
                    name="joining_date" 
                    className="input-field" 
                    value={formJoiningDate}
                    onChange={(e) => setFormJoiningDate(e.target.value)}
                    required 
                  />
                </div>
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label className="input-label">Duration (Months) *</label>
                  <select
                    name="duration"
                    className="input-field"
                    value={formDuration}
                    onChange={(e) => setFormDuration(parseInt(e.target.value, 10))}
                  >
                    <option value="1" style={{ background: 'var(--bg-secondary)' }}>1 Month</option>
                    <option value="2" style={{ background: 'var(--bg-secondary)' }}>2 Months</option>
                    <option value="3" style={{ background: 'var(--bg-secondary)' }}>3 Months</option>
                    <option value="6" style={{ background: 'var(--bg-secondary)' }}>6 Months</option>
                  </select>
                </div>
              </div>

              {/* College & Degree Branch (Matches Internship Application) */}
              <div className="flex gap-4">
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label className="input-label">College / University</label>
                  <input 
                    type="text" 
                    name="college" 
                    className="input-field" 
                    placeholder="e.g. NSU Jamshedpur"
                    value={formCollege}
                    onChange={(e) => setFormCollege(e.target.value)}
                  />
                </div>
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label className="input-label">Degree & Branch</label>
                  <input 
                    type="text" 
                    name="branch" 
                    className="input-field" 
                    placeholder="e.g. B.Tech CSE / BCA"
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                  />
                </div>
              </div>

              {/* Graduation Year / Batch */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Graduation Year / Batch</label>
                <select
                  name="graduationYear"
                  className="input-field"
                  value={formGraduationYear}
                  onChange={(e) => setFormGraduationYear(e.target.value)}
                >
                  <option value="2024" style={{ background: 'var(--bg-secondary)' }}>2024 Passing Out</option>
                  <option value="2025" style={{ background: 'var(--bg-secondary)' }}>2025 Passing Out</option>
                  <option value="2026" style={{ background: 'var(--bg-secondary)' }}>2026 Passing Out</option>
                  <option value="2027" style={{ background: 'var(--bg-secondary)' }}>2027 Passing Out</option>
                  <option value="2028" style={{ background: 'var(--bg-secondary)' }}>2028 Passing Out</option>
                  <option value="Recent Graduate" style={{ background: 'var(--bg-secondary)' }}>Recent Graduate</option>
                </select>
              </div>

              {/* Optional Resume Upload (Not Compulsory) */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Upload Resume (PDF / DOC)</span>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Optional</span>
                </label>
                
                <div style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  textAlign: 'center',
                  background: resumeFile ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-primary)',
                  position: 'relative'
                }}>
                  <input 
                    type="file"
                    id="student-resume-file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeFile(e.target.files[0]);
                      }
                    }}
                  />
                  
                  {resumeFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                        <FileText size={20} style={{ color: '#10b981' }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {resumeFile.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            {(resumeFile.size / 1024).toFixed(0)} KB • Ready to save
                          </div>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setResumeFile(null)}
                        className="btn btn-secondary"
                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : formResumeUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                        <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Existing Resume Attached
                          </div>
                          <a 
                            href={formatResumeUrl(formResumeUrl)}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'underline' }}
                          >
                            View Current File
                          </a>
                        </div>
                      </div>
                      <label 
                        htmlFor="student-resume-file" 
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Replace
                      </label>
                    </div>
                  ) : (
                    <label 
                      htmlFor="student-resume-file"
                      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Upload size={22} style={{ color: 'var(--text-secondary)' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Click to select candidate resume (Optional)
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        Supports PDF, DOC, or DOCX formats
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Status Selector (When Editing) */}
              {editingStudent && (
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="input-label">Enrollment Status</label>
                  <select 
                    name="status" 
                    className="input-field" 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                  >
                    <option value="Active" style={{ background: 'var(--bg-secondary)' }}>Active (Enrolled)</option>
                    <option value="Completed" style={{ background: 'var(--bg-secondary)' }}>Completed</option>
                  </select>
                </div>
              )}

              {/* Welcome Email Checkbox (When Adding New) */}
              {!editingStudent && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <input 
                    type="checkbox" 
                    id="sendWelcomeEmail" 
                    name="sendWelcomeEmail" 
                    checked={formSendWelcomeEmail}
                    onChange={(e) => setFormSendWelcomeEmail(e.target.checked)}
                    style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                  />
                  <label htmlFor="sendWelcomeEmail" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                    Send welcome email with verified internship details
                  </label>
                </div>
              )}
              
              <div className="flex justify-between mt-4" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                  disabled={savingStudent}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={savingStudent}
                  style={{ minWidth: '120px' }}
                >
                  {savingStudent ? 'Saving...' : (editingStudent ? 'Update Intern' : 'Save Intern')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedStudentForCertificate && (
        <CertificateModal 
          student={selectedStudentForCertificate} 
          onClose={() => setSelectedStudentForCertificate(null)}
          onUpdate={(updatedStudent) => {
            setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
            setSelectedStudentForCertificate(updatedStudent);
          }}
        />
      )}

      {/* Offer Letter Modal for Specific Student */}
      {selectedStudentForOfferLetter && (
        <OfferLetterModal 
          student={selectedStudentForOfferLetter} 
          onClose={() => setSelectedStudentForOfferLetter(null)}
        />
      )}

      {/* Master Blank Offer Letter Modal */}
      {showOfferLetterTemplateModal && (
        <OfferLetterModal 
          initialDomain={domainFilter !== 'All' ? domainFilter : 'Human Resources (HR)'} 
          onClose={() => setShowOfferLetterTemplateModal(false)}
        />
      )}
    </div>
  );
}
