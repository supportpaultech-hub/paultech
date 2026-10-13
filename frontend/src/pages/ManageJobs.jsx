import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2, 
  MapPin, 
  DollarSign, 
  Clock, 
  X, 
  Search, 
  CheckCircle2,
  FileText,
  ExternalLink,
  Users,
  Mail,
  Phone,
  Calendar,
  Eye,
  ChevronDown,
  Filter,
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react';

const ManageJobs = () => {
  const [activeTab, setActiveTab] = useState('openings'); // 'openings' | 'applications'

  // Jobs State
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Applications State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCoverNote, setSelectedCoverNote] = useState(null);

  // Job Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Job',
    location: 'Jamshedpur / Remote',
    experience: '0-2 Years',
    salary: 'Best in Industry',
    description: '',
    requirements: ''
  });

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await axios.get(`${API_BASE_URL}/api/jobs`);
      const fullTimeOnly = (res.data || []).filter(j => j.type === 'Job');
      setJobs(fullTimeOnly);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const res = await axios.get(`${API_BASE_URL}/api/jobs/applications`);
      const fullTimeApps = (res.data || []).filter(a => !a.jobTitle?.toLowerCase().includes('intern'));
      setApplications(fullTimeApps);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in position title and description.');
      return;
    }

    try {
      setSubmitting(true);
      const reqArray = formData.requirements
        ? formData.requirements.split('\n').map(r => r.trim()).filter(Boolean)
        : [];

      await axios.post(`${API_BASE_URL}/api/jobs`, {
        ...formData,
        type: 'Job',
        requirements: reqArray
      });

      alert('Career opening posted successfully!');
      setIsModalOpen(false);
      setFormData({
        title: '',
        type: 'Job',
        location: 'Jamshedpur / Remote',
        experience: '0-2 Years',
        salary: 'Best in Industry',
        description: '',
        requirements: ''
      });
      fetchJobs();
    } catch (err) {
      console.error('Error creating job posting:', err);
      alert('Failed to post career opening.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this career opening?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error('Error deleting job posting:', err);
      alert('Failed to delete opening.');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/jobs/applications/${appId}/status`, { status: newStatus });
      setApplications(prev => prev.map(app => app._id === appId ? { ...app, status: newStatus } : app));
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update status.');
    }
  };

  const handleDeleteApp = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate application?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/jobs/applications/${id}`);
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Failed to delete application.');
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = (j.title && j.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (j.description && j.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const searchLower = appSearchTerm.toLowerCase();
    const matchesSearch = !appSearchTerm || 
      (app.candidateName && app.candidateName.toLowerCase().includes(searchLower)) ||
      (app.candidateEmail && app.candidateEmail.toLowerCase().includes(searchLower)) ||
      (app.candidatePhone && app.candidatePhone.includes(searchLower)) ||
      (app.jobTitle && app.jobTitle.toLowerCase().includes(searchLower));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Interview Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500" />
            Careers & Full-Time Job Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage active full-time engineering and corporate openings and review candidate resumes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-xs sm:text-sm shrink-0"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-2xl shadow-sm border">
        <button
          onClick={() => setActiveTab('openings')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'openings'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Full-Time Openings
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 font-semibold">
            {jobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all relative ${
            activeTab === 'applications'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Job Applications
          <span className={`ml-1 px-2 py-0.5 text-xs rounded-full font-bold ${
            applications.length > 0 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {applications.length}
          </span>
        </button>
      </div>

      {/* TAB 1: POSTED OPENINGS */}
      {activeTab === 'openings' && (
        <div className="space-y-6">
          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search job openings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            <div className="text-xs font-semibold text-slate-500">
              Showing <span className="font-bold text-slate-800">{filteredJobs.length}</span> Active Full-Time Roles
            </div>
          </div>

          {/* Openings Grid */}
          {loadingJobs ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm font-medium">Loading career postings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No Full-Time Job Openings Posted Yet</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                Click "Post New Job" above to create your first Full-Time Job posting.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
                >
                  <div>
                    {/* Header & Badges */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                        <Briefcase className="w-3.5 h-3.5" />
                        Full-Time Job
                      </span>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Opening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {job.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-500 font-medium mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>Exp: {job.experience}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                        <span className="font-semibold text-slate-700">{job.salary}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                      {job.description}
                    </p>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Requirements:</p>
                        <div className="space-y-0.5">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <p key={idx} className="text-xs text-slate-600 flex items-center gap-1 line-clamp-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              {req}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANDIDATE APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* App Filters & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name, email, phone, title..."
                value={appSearchTerm}
                onChange={(e) => setAppSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['All', 'Pending', 'Shortlisted', 'Interview Scheduled', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Applications List / Table */}
          {loadingApps ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm font-medium">Loading candidate applications...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No Candidate Applications Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                {appSearchTerm || statusFilter !== 'All' 
                  ? 'No applications match your current filters.' 
                  : 'When candidates submit applications on the Careers page with their resumes, they will appear here.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Candidate Info</th>
                      <th className="py-3.5 px-4">Applied Position</th>
                      <th className="py-3.5 px-4">Experience</th>
                      <th className="py-3.5 px-4">Resume Document</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredApps.map((app) => {
                      const resumeFullUrl = app.resumeUrl
                        ? `${API_BASE_URL}/api/jobs/applications/${app._id}/resume`
                        : '#';

                      return (
                        <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Candidate Info */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900">{app.candidateName}</div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <a href={`mailto:${app.candidateEmail}`} className="hover:text-orange-600 underline">
                                  {app.candidateEmail}
                                </a>
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <a href={`tel:${app.candidatePhone}`} className="hover:text-orange-600">
                                  {app.candidatePhone}
                                </a>
                              </span>
                            </div>
                            {app.appliedAt && (
                              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Applied on {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            )}
                          </td>

                          {/* Applied Position */}
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                              {app.jobTitle}
                            </span>
                          </td>

                          {/* Experience */}
                          <td className="py-4 px-4 text-xs font-medium text-slate-600">
                            {app.experience || 'Fresher'}
                          </td>

                          {/* Resume Link Button */}
                          <td className="py-4 px-4">
                            {app.resumeUrl ? (
                              <a
                                href={resumeFullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-300 font-bold text-xs transition-all shadow-xs group"
                              >
                                <FileText className="w-4 h-4 text-orange-600" />
                                View Resume
                                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </a>
                            ) : (
                              <span className="text-xs text-red-500 font-medium">No Resume Attached</span>
                            )}
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-4 px-4">
                            <select
                              value={app.status || 'Pending'}
                              onChange={(e) => handleStatusChange(app._id, e.target.value)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${getStatusBadge(app.status)}`}
                            >
                              <option value="Pending">⏳ Pending</option>
                              <option value="Shortlisted">✅ Shortlisted</option>
                              <option value="Interview Scheduled">📅 Interview Scheduled</option>
                              <option value="Rejected">❌ Rejected</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right space-x-2">
                            {app.coverNote && (
                              <button
                                onClick={() => setSelectedCoverNote(app)}
                                className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors inline-flex items-center"
                                title="View Cover Note"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteApp(app._id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                              title="Delete Application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cover Note Modal */}
      {selectedCoverNote && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedCoverNote(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Cover Note / Details
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Submitted by <span className="font-semibold text-slate-700">{selectedCoverNote.candidateName}</span> for <span className="font-semibold text-orange-600">{selectedCoverNote.jobTitle}</span>
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap max-h-60 overflow-y-auto mb-5">
              {selectedCoverNote.coverNote || 'No additional note provided.'}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCoverNote(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Job Creation Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-orange-500" />
                Post Full-Time Job Opening
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Create a full-time engineering or corporate role for candidates on the Careers portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Position Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Senior Full Stack Engineer (React/Node)"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Jamshedpur / Remote"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g. 1-3 Years or 3-5 Years"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Annual Salary Package (CTC)
                </label>
                <input
                  type="text"
                  name="salary"
                  placeholder="e.g. ₹5.0 - 8.5 LPA"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Overview of roles, responsibilities, and team expectations..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Requirements (One per line)
                </label>
                <textarea
                  name="requirements"
                  rows={3}
                  placeholder="Strong knowledge of React and Node.js&#10;Good problem-solving skills&#10;Familiarity with MongoDB"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManageJobs;

