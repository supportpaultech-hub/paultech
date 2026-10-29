import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, formatResumeUrl } from '../student-app/config';
import { 
  GraduationCap, 
  Trash2, 
  Search, 
  FileText, 
  ExternalLink, 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  Eye, 
  Clock, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { exportToExcel } from '../student-app/utils/exportToExcel';

const ManageInternships = () => {
  // Applications State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await axios.get(`${API_BASE_URL}/api/jobs/applications`);
      // Filter strictly for internship applications or candidates who applied for an internship track
      const internApps = (res.data || []).filter(a => {
        const titleLower = (a.jobTitle || '').toLowerCase();
        const expLower = (a.experience || '').toLowerCase();
        return titleLower.includes('intern') || a.domain || expLower.includes('student') || expLower.includes('college') || expLower.includes('batch');
      });
      setApplications(internApps);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDeleteApp = async (id) => {
    if (!window.confirm('Are you sure you want to delete this intern application?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/jobs/applications/${id}`);
      setApplications(prev => prev.filter(app => app._id !== id));
      if (selectedApp?._id === id) setSelectedApp(null);
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Failed to delete application.');
    }
  };

  const handleExport = () => {
    const cols = [
      { label: 'Applicant Name', key: 'candidateName' },
      { label: 'Email', key: 'candidateEmail' },
      { label: 'Phone', key: 'candidatePhone' },
      { label: 'Domain', key: 'domain' },
      { label: 'Mode', key: 'mode' },
      { label: 'Joining Date', key: 'joining_date' },
      { label: 'Duration (Months)', key: 'duration' },
      { label: 'College', key: 'college' },
      { label: 'Branch', key: 'branch' },
      { label: 'Graduation Year', key: 'graduationYear' },
      { label: 'Status', key: 'status' }
    ];
    exportToExcel(filteredApps, cols, 'Student_Internship_Applications');
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = 
      statusFilter === 'All' ? true :
      statusFilter === 'Pending' ? (!app.status || app.status === 'Pending' || app.status === 'Pending Review') :
      statusFilter === 'Accepted' ? app.status === 'Accepted' :
      statusFilter === 'Rejected' ? app.status === 'Rejected' :
      app.status === statusFilter;

    const searchLower = appSearchTerm.toLowerCase();
    const matchesSearch = !appSearchTerm || 
      (app.candidateName && app.candidateName.toLowerCase().includes(searchLower)) ||
      (app.candidateEmail && app.candidateEmail.toLowerCase().includes(searchLower)) ||
      (app.candidatePhone && app.candidatePhone.includes(searchLower)) ||
      (app.domain && app.domain.toLowerCase().includes(searchLower)) ||
      (app.college && app.college.toLowerCase().includes(searchLower)) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  const pendingCount = applications.filter(a => !a.status || a.status === 'Pending' || a.status === 'Pending Review').length;
  const acceptedCount = applications.filter(a => a.status === 'Accepted').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500" />
            Student Internship Applications
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review candidate applications submitted through official Industrial Internship Tracks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-emerald-700 font-semibold px-4 py-2.5 rounded-xl border border-emerald-600/30 shadow-xs transition-all text-xs sm:text-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Info Banner for Main Admin */}
      <div className="flex items-start gap-3 bg-amber-50/80 border border-amber-200/80 p-4 rounded-xl text-amber-900 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Main Admin Review:</span> All internship applications arrive here for centralized monitoring. 
          Final candidate approval, student enrollment, and official <strong>Offer Letter dispatch</strong> are processed by <strong>Student Admin (Mrs. Daljeet Paul)</strong> in the Student Portal.
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, college, domain..."
            value={appSearchTerm}
            onChange={(e) => setAppSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'All', label: `All (${applications.length})` },
            { id: 'Pending', label: `Pending (${pendingCount})` },
            { id: 'Accepted', label: `Enrolled (${acceptedCount})` },
            { id: 'Rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Content */}
      {loadingApps ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm font-medium">Loading candidate applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Student Applications Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
            Student submissions through the Industrial Internships tracks will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {app.candidateName}
                  </h3>

                  {/* Domain Capsule */}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                    {app.domain || 'MERN stack'}
                  </span>

                  {/* Mode Badge (Offline vs Online) */}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    app.mode === 'Online'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {app.mode === 'Online' ? '🌐 Online' : '🏢 Offline'}
                  </span>

                  {/* Status Badge */}
                  {app.status === 'Accepted' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Enrolled (Offer Sent)
                    </span>
                  ) : app.status === 'Rejected' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                      Rejected
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Pending Review
                    </span>
                  )}

                  {app.offerLetterSent && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ Offer Letter Dispatched
                    </span>
                  )}
                </div>

                {/* Candidate Contact */}
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {app.candidateEmail}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {app.candidatePhone}
                  </span>
                  {app.joining_date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Joining: {new Date(app.joining_date).toLocaleDateString()}
                    </span>
                  )}
                  {app.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Duration: {app.duration} Months
                    </span>
                  )}
                </div>

                {/* College / Academic Details */}
                {(app.college || app.branch || app.graduationYear) && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{app.college || 'College not specified'}</span>
                    {app.branch && <span>• {app.branch}</span>}
                    {app.graduationYear && <span className="text-slate-400">(Passing: {app.graduationYear})</span>}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {app.resumeUrl && (
                  <a
                    href={app._id ? `${API_BASE_URL}/api/jobs/applications/${app._id}/resume` : formatResumeUrl(app.resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-orange-500" />
                    <span>Resume</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}

                <button
                  onClick={() => setSelectedApp(app)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => handleDeleteApp(app._id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto lg:ml-0"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {selectedApp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Application Details</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
                <div className="text-base font-bold text-slate-900">{selectedApp.candidateName}</div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Email:</strong> {selectedApp.candidateEmail}</div>
                  <div><strong>Phone:</strong> {selectedApp.candidatePhone}</div>
                  <div><strong>Domain / Track:</strong> {selectedApp.domain || 'MERN stack'}</div>
                  <div><strong>Duration:</strong> {selectedApp.duration || 2} Months</div>
                  <div><strong>Joining Date:</strong> {selectedApp.joining_date ? new Date(selectedApp.joining_date).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>

              {(selectedApp.college || selectedApp.branch || selectedApp.graduationYear) && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800">Academic Background:</div>
                  <div><strong>College:</strong> {selectedApp.college || 'N/A'}</div>
                  <div><strong>Branch:</strong> {selectedApp.branch || 'N/A'}</div>
                  <div><strong>Graduation Year:</strong> {selectedApp.graduationYear || 'N/A'}</div>
                </div>
              )}

              {selectedApp.coverNote && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  <div className="text-xs font-bold text-slate-800 mb-1">Student Notes / Message:</div>
                  <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">{selectedApp.coverNote}</p>
                </div>
              )}

              {selectedApp.resumeUrl && (
                <div>
                  <a
                    href={formatResumeUrl(selectedApp.resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View / Download Resume</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInternships;
