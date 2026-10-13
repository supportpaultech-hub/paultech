import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Search, Plus, Edit, Trash2, HelpCircle, UserCheck, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportToExcel } from '../utils/exportToExcel';

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

export default function Enquiries({ user }) {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('MERN stack');
  const [customDomain, setCustomDomain] = useState('');

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/enquiries`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [user.token]);

  const allKnownDomains = useMemo(() => {
    const customSet = new Set(PRESET_DOMAINS);
    enquiries.forEach(e => e.domain && customSet.add(e.domain));
    return ['All', ...Array.from(customSet)];
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                          e.phone?.includes(search) ||
                          e.email?.toLowerCase().includes(search.toLowerCase());
      const matchDomain = domainFilter === 'All' || e.domain === domainFilter;
      return matchSearch && matchDomain;
    });
  }, [enquiries, search, domainFilter]);

  const handleOpenAdd = () => {
    setEditingEnquiry(null);
    setSelectedDomain('MERN stack');
    setCustomDomain('');
    setShowModal(true);
  };

  const handleOpenEdit = (enquiry) => {
    setEditingEnquiry(enquiry);
    const isPreset = PRESET_DOMAINS.includes(enquiry.domain);
    setSelectedDomain(isPreset ? enquiry.domain : 'Other');
    setCustomDomain(isPreset ? '' : enquiry.domain);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/enquiries/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchEnquiries();
      } catch (err) {
        alert('Failed to delete enquiry');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (selectedDomain === 'Other') {
      if (!customDomain.trim()) {
        alert('Please specify the custom domain');
        return;
      }
      data.domain = customDomain.trim();
    } else {
      data.domain = selectedDomain;
    }
    delete data.custom_domain;

    try {
      if (editingEnquiry) {
        await axios.put(`${API_BASE_URL}/api/enquiries/${editingEnquiry._id || editingEnquiry.id}`, data, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/enquiries`, data, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }
      setShowModal(false);
      fetchEnquiries();
    } catch (err) {
      alert('Error saving enquiry');
    }
  };

  const handleConvertToIntern = async (enquiry) => {
    try {
      await axios.put(`${API_BASE_URL}/api/enquiries/${enquiry._id || enquiry.id}`, { status: 'Converted' }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchEnquiries();
      // Redirect to Students directory with state prefilled
      navigate('/student/students', { state: { prefillEnquiry: enquiry } });
    } catch (err) {
      console.error(err);
      alert('Error converting enquiry');
    }
  };

  return (
    <div>
      <div className="page-header mb-6">
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={28} style={{ color: 'var(--accent-primary)' }} />
            Student Enquiries
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.9rem' }}>
            Manage prospective student inquiries and lead conversions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary" 
            style={{ color: '#107c41', borderColor: '#107c41' }}
            onClick={() => {
              const cols = [
                { label: 'Name', key: 'name' },
                { label: 'Phone', key: 'phone' },
                { label: 'Email', key: 'email' },
                { label: 'Domain', key: 'domain' },
                { label: 'Enquiry Date', key: 'enquiry_date' },
                { label: 'Status', key: 'status' },
                { label: 'Notes', key: 'notes' }
              ];
              exportToExcel(filteredEnquiries, cols, 'Student_Enquiries');
            }}
          >
            <FileSpreadsheet size={18} style={{ marginRight: '0.5rem' }} />
            Export Excel
          </button>
          <button className="btn btn-primary" onClick={handleOpenAdd} style={{ color: '#ffffff' }}>
            <Plus size={18} style={{ marginRight: '0.5rem', color: '#ffffff' }} />
            <span style={{ color: '#ffffff', fontWeight: 600 }}>New Enquiry</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 mb-6">
        <div className="search-filter-bar">
          <div className="input-group" style={{ flex: 1, margin: 0, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search enquiries by name, phone or email..." 
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
              {allKnownDomains.map(d => <option key={d} value={d} style={{ background: 'var(--bg-secondary)' }}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table Container (Desktop Table + Mobile Cards) */}
      <div className="glass-panel data-table-container" style={{ borderRadius: '14px', overflow: 'hidden' }}>
        <table className="data-table-refined desktop-only-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Interested Domain</th>
              <th>Enquiry Date</th>
              <th>Status</th>
              <th>Notes / Remarks</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No student enquiries found.
                </td>
              </tr>
            ) : filteredEnquiries.map(enquiry => (
              <tr key={enquiry._id || enquiry.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{enquiry.name}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>📞 {enquiry.phone}</div>
                  {enquiry.email && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>✉️ {enquiry.email}</div>}
                </td>
                <td><span className="badge badge-domain">{enquiry.domain}</span></td>
                <td>{new Date(enquiry.enquiry_date).toLocaleDateString()}</td>
                <td>
                  <span className="badge" style={{
                    background: enquiry.status === 'Converted' ? 'rgba(16, 185, 129, 0.15)' : enquiry.status === 'Closed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: enquiry.status === 'Converted' ? '#10b981' : enquiry.status === 'Closed' ? '#ef4444' : '#f59e0b',
                    border: '1px solid currentColor'
                  }}>
                    {enquiry.status}
                  </span>
                </td>
                <td className="notes-cell" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '220px' }}>
                  {enquiry.notes || '-'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {enquiry.status !== 'Converted' && user.role === 'ADMIN' && (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', borderRadius: '8px', gap: '0.3rem' }}
                        title="Convert this enquiry into an enrolled Intern"
                        onClick={() => handleConvertToIntern(enquiry)}
                      >
                        <UserCheck size={14} />
                        Convert
                      </button>
                    )}
                    {user.role === 'ADMIN' && (
                      <>
                        <button className="icon-action-btn" onClick={() => handleOpenEdit(enquiry)} title="Edit Enquiry">
                          <Edit size={15} />
                        </button>
                        <button className="icon-action-btn" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => handleDelete(enquiry._id || enquiry.id)} title="Delete Enquiry">
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile-Optimized Enquiries Cards */}
        <div className="mobile-enquiries-list">
          {filteredEnquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
              No student enquiries found.
            </div>
          ) : (
            filteredEnquiries.map(enquiry => (
              <div key={enquiry._id || enquiry.id} className="mobile-app-card">
                {/* Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {enquiry.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      📞 {enquiry.phone} {enquiry.email ? `• ✉️ ${enquiry.email}` : ''}
                    </div>
                  </div>
                  <span className="badge" style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.55rem',
                    background: enquiry.status === 'Converted' ? 'rgba(16, 185, 129, 0.15)' : enquiry.status === 'Closed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: enquiry.status === 'Converted' ? '#10b981' : enquiry.status === 'Closed' ? '#ef4444' : '#f59e0b',
                    border: '1px solid currentColor'
                  }}>
                    {enquiry.status}
                  </span>
                </div>

                {/* Domain & Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-domain" style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}>
                    {enquiry.domain}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(enquiry.enquiry_date).toLocaleDateString()}
                  </span>
                </div>

                {/* Notes Snippet */}
                {enquiry.notes && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '0.45rem 0.6rem', borderRadius: '6px', marginBottom: '0.6rem', lineHeight: 1.35 }}>
                    📝 {enquiry.notes}
                  </div>
                )}

                {/* Mobile Action Buttons Footer */}
                <div style={{ display: 'flex', gap: '0.4rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', alignItems: 'center' }}>
                  {enquiry.status !== 'Converted' && user.role === 'ADMIN' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleConvertToIntern(enquiry)}
                      style={{ flex: 1, padding: '0.45rem', fontSize: '0.78rem', justifyContent: 'center', borderRadius: '8px', gap: '0.3rem' }}
                    >
                      <UserCheck size={14} />
                      Convert to Intern
                    </button>
                  )}

                  {user.role === 'ADMIN' && (
                    <button
                      type="button"
                      className="icon-action-btn"
                      onClick={() => handleOpenEdit(enquiry)}
                      title="Edit Enquiry"
                    >
                      <Edit size={14} />
                    </button>
                  )}

                  {user.role === 'ADMIN' && (
                    <button
                      type="button"
                      className="icon-action-btn"
                      style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      onClick={() => handleDelete(enquiry._id || enquiry.id)}
                      title="Delete Enquiry"
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

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="mb-4">{editingEnquiry ? 'Edit Enquiry' : 'Record New Student Enquiry'}</h2>
            <form onSubmit={handleSave} className="flex-col gap-4">
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Student Name</label>
                <input type="text" name="name" className="input-field" defaultValue={editingEnquiry?.name} required />
              </div>
              
              <div className="flex gap-4">
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label className="input-label">Phone Number</label>
                  <input type="text" name="phone" className="input-field" defaultValue={editingEnquiry?.phone} required />
                </div>
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label className="input-label">Email (Optional)</label>
                  <input type="email" name="email" className="input-field" defaultValue={editingEnquiry?.email} />
                </div>
              </div>

              {/* Domain Dropdown with "Other" Support */}
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Interested Domain</label>
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
                  <label className="input-label" style={{ color: 'var(--accent-primary)' }}>Custom Domain Name</label>
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

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Status</label>
                <select name="status" className="input-field" defaultValue={editingEnquiry?.status || 'Pending'}>
                  <option value="Pending" style={{ background: 'var(--bg-secondary)' }}>Pending</option>
                  <option value="Converted" style={{ background: 'var(--bg-secondary)' }}>Converted (Enrolled)</option>
                  <option value="Closed" style={{ background: 'var(--bg-secondary)' }}>Closed</option>
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Notes / Remarks</label>
                <textarea 
                  name="notes" 
                  className="input-field" 
                  rows={3} 
                  placeholder="Additional inquiry details, preferred batch timings, etc."
                  defaultValue={editingEnquiry?.notes} 
                />
              </div>
              
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Enquiry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
