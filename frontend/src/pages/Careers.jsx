import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Send, 
  Mail, 
  Sparkles,
  FileText,
  Upload,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Application Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [experience, setExperience] = useState('0-2 Years');
  const [coverNote, setCoverNote] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/jobs`);
      setJobs(res.data || []);
    } catch (err) {
      console.error('Error fetching careers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApplyModal = (job) => {
    setSelectedJob(job);
    setCandidateName('');
    setCandidateEmail('');
    setCandidatePhone('');
    setExperience('0-2 Years');
    setCoverNote('');
    setResumeFile(null);
    setSubmitSuccess(false);
    setErrorMsg('');
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setSubmitSuccess(false);
    setErrorMsg('');
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!candidateName || !candidateEmail || !candidatePhone) {
      setErrorMsg('Please fill in your name, email, and phone number.');
      return;
    }

    if (!resumeFile) {
      setErrorMsg('Resume upload is COMPULSORY. Please attach your PDF or DOC resume file.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      if (selectedJob && selectedJob._id) {
        formData.append('jobId', selectedJob._id);
      }
      formData.append('jobTitle', selectedJob ? selectedJob.title : 'General Application');
      formData.append('candidateName', candidateName);
      formData.append('candidateEmail', candidateEmail);
      formData.append('candidatePhone', candidatePhone);
      formData.append('experience', experience);
      formData.append('coverNote', coverNote);
      formData.append('resume', resumeFile);

      await axios.post(`${API_BASE_URL}/api/jobs/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSubmitSuccess(true);
    } catch (err) {
      console.error('Error applying for job:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fullTimeJobs = jobs.filter(j => j.type === 'Job');

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 shadow-xs backdrop-blur-md mb-2 sm:mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              Build The Future With Us
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Full-Time Careers at <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">PaulTech</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Join our elite engineering and software architecture team. Build high-impact enterprise applications, cloud ecosystems, and intelligent systems.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Callout Banner to Dedicated Industrial Internships */}
        <div className="mb-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border border-orange-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                For Students & Freshers
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Looking for Industrial Internships & Live Projects?
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Work on live enterprise codebases, get 1-on-1 mentorship, earn ISO verified credentials, and secure Pre-Placement Offers (PPOs).
              </p>
            </div>
          </div>
          <Link
            to="/internships"
            className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:scale-105"
          >
            <span>Explore Internships</span>
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          </Link>
        </div>

        {/* Section Heading */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              Full-Time Career Openings ({fullTimeJobs.length})
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Explore competitive engineering and management positions at PaulTech Software Services.
            </p>
          </div>
        </div>

        {/* Openings Grid */}
        {loading ? (
          <CardGridSkeleton count={4} />
        ) : fullTimeJobs.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-slate-700">
              No Active Full-Time Openings Available Right Now
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mt-2 break-all">
              Check back soon or submit your general resume below for future openings.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {fullTimeJobs.map((opening) => (
              <div
                key={opening._id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6 group hover:border-orange-500/30"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 border border-orange-200">
                      <Briefcase className="w-3.5 h-3.5" />
                      Full-Time Role
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Posted recently
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                    {opening.title}
                  </h3>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      {opening.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-orange-500" />
                      {opening.experience}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      {opening.salary}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed font-light pt-1">
                    {opening.description}
                  </p>

                  {opening.requirements && opening.requirements.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-bold text-slate-700 mb-1.5">Requirements & Qualifications:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {opening.requirements.map((req, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleOpenApplyModal(opening)}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm whitespace-nowrap"
                  >
                    <span>Apply for Position</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* General Resume Box */}
        <div className="mt-12 sm:mt-16 bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-xl sm:text-3xl font-bold mb-3">Don't See a Fitting Role Right Now?</h3>
          <p className="text-slate-400 text-xs sm:text-base max-w-xl mx-auto font-light leading-relaxed mb-6">
            We are always expanding. Send your updated resume to our HR talent acquisition team or submit a general application.
          </p>
          <button
            onClick={() => handleOpenApplyModal({ title: 'General Career Application', type: 'Job' })}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all text-xs sm:text-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Submit General Resume</span>
          </button>
        </div>
      </div>

      {/* JOB APPLICATION & RESUME UPLOAD MODAL */}
      {selectedJob && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Application Submitted!</h3>
                <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{candidateName}</strong>! Your application and resume for <strong className="text-orange-600">{selectedJob.title}</strong> have been received by PaulTech HR team.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-orange-600 tracking-wider">Applying For</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">{selectedJob.title}</h3>
                </div>

                {errorMsg && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={candidatePhone}
                      onChange={(e) => setCandidatePhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience Level</label>
                  <input
                    type="text"
                    placeholder="e.g. Fresher / 1-2 Years MERN Stack"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                {/* COMPULSORY RESUME FILE UPLOAD */}
                <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200 space-y-2">
                  <label className="block text-xs font-bold text-orange-900 uppercase flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-orange-600" />
                      Upload Resume File * (COMPULSORY)
                    </span>
                    <span className="text-[10px] text-orange-700 font-mono">.pdf, .doc, .docx</span>
                  </label>

                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                  />

                  {resumeFile && (
                    <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Attached: {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Note / Key Skills (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Briefly state your technical skills and why you're a great fit..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading Resume...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Careers;
