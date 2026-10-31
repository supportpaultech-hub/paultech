import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { openRazorpayPopup } from '../utils/razorpay';
import { 
  GraduationCap, 
  Briefcase, 
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
  AlertCircle,
  Code2,
  Terminal,
  Cpu,
  Smartphone,
  Layers,
  Award,
  Users,
  ChevronRight,
  BookOpen,
  BarChart3,
  Database,
  CreditCard
} from 'lucide-react';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const INTERNSHIP_TRACKS = [
  // IT TRACKS
  {
    title: "Full stack using PHP",
    category: "IT",
    icon: Code2,
    color: "from-indigo-500 to-purple-600",
    skills: ["PHP 8+", "Laravel", "MySQL", "JavaScript", "REST APIs", "TailwindCSS"],
    desc: "Master modern server-side engineering with PHP and the Laravel ecosystem. Build secure relational database architectures, robust authentication, and enterprise portals."
  },
  {
    title: "Full stack using Python",
    category: "IT",
    icon: Terminal,
    color: "from-blue-500 to-emerald-500",
    skills: ["Python", "Django", "FastAPI", "PostgreSQL", "React Frontend", "REST APIs"],
    desc: "Develop full-stack web applications using Python, Django, and FastAPI with reactive modern frontends. Implement clean architecture, ORM models, and async tasks."
  },
  {
    title: "MERN stack",
    category: "IT",
    icon: Layers,
    color: "from-orange-500 to-amber-500",
    skills: ["MongoDB", "Express.js", "React.js", "Node.js", "TailwindCSS", "JWT Auth"],
    desc: "Build scalable JavaScript applications across the entire stack. Master reactive frontend state, custom RESTful backends, NoSQL schema design, and production cloud deployment."
  },
  {
    title: "Data Analytics",
    category: "IT",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-600",
    skills: ["SQL", "Power BI", "Excel Advanced", "Pandas", "Tableau", "Data Pipelines"],
    desc: "Transform raw organizational data into actionable business intelligence. Learn data cleaning, exploratory analysis, automated reporting, and executive KPI dashboards."
  },
  {
    title: "Data science",
    category: "IT",
    icon: Database,
    color: "from-emerald-500 to-teal-600",
    skills: ["Python", "NumPy & Pandas", "Statistics", "Scikit-Learn", "Data Mining", "Matplotlib"],
    desc: "Dive into statistical modeling, hypothesis testing, predictive analysis, and feature engineering to uncover deep insights from complex multi-dimensional datasets."
  },
  {
    title: "AI/ML",
    category: "IT",
    icon: Sparkles,
    color: "from-fuchsia-500 to-rose-600",
    skills: ["Machine Learning", "Deep Learning", "TensorFlow / PyTorch", "NLP", "LLM APIs", "Computer Vision"],
    desc: "Build and deploy state-of-the-art machine learning models, neural networks, and generative AI agents to solve cutting-edge computer vision and natural language challenges."
  },
  // NON-IT TRACKS
  {
    title: "Human Resources (HR)",
    category: "Non-IT",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    skills: ["Talent Acquisition", "HR Onboarding", "Employee Engagement", "Performance Review", "HR Compliance"],
    desc: "Master real-world talent acquisition, corporate onboarding, HR compliance, attendance frameworks, and organizational development strategies."
  },
  {
    title: "Marketing",
    category: "Non-IT",
    icon: Briefcase,
    color: "from-amber-500 to-orange-600",
    skills: ["Market Research", "Brand Positioning", "Campaign Planning", "B2B Communication", "Lead Generation"],
    desc: "Learn strategic brand positioning, competitive market research, corporate B2B communication, product marketing, and lead acquisition."
  },
  {
    title: "Digital Marketing",
    category: "Non-IT",
    icon: BarChart3,
    color: "from-sky-500 to-blue-600",
    skills: ["SEO Optimization", "Social Media Ads", "Google Analytics", "Content Strategy", "Email Campaigns"],
    desc: "Drive online business growth through Search Engine Optimization (SEO), Meta & Google ad management, viral content strategy, and conversion funnel analytics."
  },
  {
    title: "Finance",
    category: "Non-IT",
    icon: DollarSign,
    color: "from-emerald-600 to-teal-700",
    skills: ["Financial Modeling", "Corporate Accounting", "GST & Taxation", "Budgeting", "Financial Reporting"],
    desc: "Gain practical exposure to corporate financial modeling, ledger management, tax compliance, budget planning, and auditing workflows."
  }
];

const UNIVERSITY_PARTNERS = [
  "Netaji Subhas University",
  "Srinath University",
  "Al Kabir Polytechnic College",
  "Arka Jain University",
  "Templecity Institute of Technology & Engineering (TITE)",
  "St. Xavier's College, Dumka"
];

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

const Internships = () => {
  // Modal State
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [trainingMode, setTrainingMode] = useState('Offline');
  const [domain, setDomain] = useState('MERN stack');
  const [duration, setDuration] = useState('2');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [collegeName, setCollegeName] = useState('');
  const [degreeBranch, setDegreeBranch] = useState('');
  const [passingYear, setPassingYear] = useState('2025');
  const [coverNote, setCoverNote] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleOpenApplyModal = (internship, initialMode = 'Offline') => {
    setSelectedInternship(internship);
    setCandidateName('');
    setCandidateEmail('');
    setCandidatePhone('');
    setTrainingMode(initialMode || 'Offline');
    setCollegeName('');
    setDegreeBranch('');
    setPassingYear('2025');
    setCoverNote('');
    setResumeFile(null);
    setSubmitSuccess(false);
    setErrorMsg('');

    // Preselect domain matching internship title
    const titleLower = (internship?.title || '').toLowerCase();
    let matchedDomain = 'MERN stack';
    if (titleLower.includes('php')) matchedDomain = 'FULL STACK PHP';
    else if (titleLower.includes('django') || titleLower.includes('python')) matchedDomain = 'Full stack (DJANGO)';
    else if (titleLower.includes('analytic')) matchedDomain = 'Data Analytics';
    else if (titleLower.includes('science')) matchedDomain = 'DATA Science';
    else if (titleLower.includes('ai') || titleLower.includes('machine') || titleLower.includes('ml')) matchedDomain = 'AI/ML';
    else if (titleLower.includes('human') || titleLower.includes('hr')) matchedDomain = 'Human Resources (HR)';
    else if (titleLower.includes('digital')) matchedDomain = 'Digital Marketing';
    else if (titleLower.includes('marketing')) matchedDomain = 'Marketing';
    else if (titleLower.includes('finance')) matchedDomain = 'Finance';
    else if (titleLower.includes('design') || titleLower.includes('web') || titleLower.includes('ui')) matchedDomain = 'WEB DESIGN';
    setDomain(matchedDomain);
    setDuration('2');
    setJoiningDate(new Date().toISOString().split('T')[0]);
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [lastPaymentInfo, setLastPaymentInfo] = useState(null);

  const handleCloseModal = () => {
    setSelectedInternship(null);
    setSubmitSuccess(false);
    setErrorMsg('');
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!candidateName || !candidateEmail || !candidatePhone) {
      setErrorMsg('Please fill in your name, email, and phone number.');
      return;
    }

    if (!resumeFile) {
      setErrorMsg('Resume upload is mandatory. Please attach your PDF or DOC resume file.');
      return;
    }

    setSubmitting(true);

    openRazorpayPopup({
      amount: 1000,
      title: `${selectedInternship?.title || domain} Internship Registration`,
      candidateName,
      candidateEmail,
      candidatePhone,
      onSuccess: (paymentInfo) => {
        handlePaymentSuccess(paymentInfo);
      },
      onFailure: (errText) => {
        setSubmitting(false);
        setErrorMsg(errText || 'Payment failed. Please try again.');
      },
      onDismiss: () => {
        setSubmitting(false);
      }
    });
  };

  const handlePaymentSuccess = async (paymentInfo) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      if (selectedInternship && selectedInternship._id) {
        formData.append('jobId', selectedInternship._id);
      }
      formData.append('jobTitle', selectedInternship ? selectedInternship.title : 'General Industrial Internship');
      formData.append('candidateName', candidateName);
      formData.append('candidateEmail', candidateEmail);
      formData.append('candidatePhone', candidatePhone);
      formData.append('mode', trainingMode);
      formData.append('domain', domain);
      formData.append('duration', duration);
      formData.append('joining_date', joiningDate);
      formData.append('college', collegeName);
      formData.append('branch', degreeBranch);
      formData.append('graduationYear', passingYear);
      formData.append('experience', `College Student - ${degreeBranch ? degreeBranch + ', ' : ''}${collegeName || 'Fresher'} (Batch: ${passingYear})`);
      
      const combinedNotes = `College: ${collegeName || 'N/A'}\nBranch: ${degreeBranch || 'N/A'}\nGraduation Year: ${passingYear}\nDomain: ${domain}\nDuration: ${duration} Months\nJoining Date: ${joiningDate}\n\nPayment Ref: ${paymentInfo.paymentId}\nPayment Method: ${paymentInfo.paymentMethod}\nRegistration Fee Paid: ₹${paymentInfo.amount}\n\nStudent Message:\n${coverNote}`;
      formData.append('coverNote', combinedNotes);
      formData.append('resume', resumeFile);

      // Payment fields for backend schema
      formData.append('registrationFee', '1000');
      formData.append('paymentStatus', 'Completed');
      formData.append('paymentId', paymentInfo.paymentId);
      formData.append('paymentMethod', paymentInfo.paymentMethod);

      await axios.post(`${API_BASE_URL}/api/jobs/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setLastPaymentInfo(paymentInfo);
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Error submitting internship application after payment:', err);
      setErrorMsg(err.response?.data?.error || 'Payment was completed, but failed to save application. Please contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Compact & Proportional to other pages */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-orange-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            College Approved Industrial Training
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Industrial Internships
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed mb-4">
            Bridge the gap between college theory and production engineering. Build live client software, earn ISO-verified credentials, and unlock Pre-Placement Offers (PPOs).
          </p>

          <div className="flex flex-row items-center justify-center gap-2.5 max-w-sm mx-auto">
            <a
              href="#tracks-section"
              className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition-all text-xs sm:text-sm"
            >
              <span>Explore Tracks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => handleOpenApplyModal({ title: 'General Industrial Internship', type: 'Internship' })}
              className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl backdrop-blur-md transition-all text-xs sm:text-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Apply Directly</span>
            </button>
          </div>
        </div>
      </section>

      {/* University Partners Compact Trust Strip */}
      <div className="bg-slate-900/90 py-2.5 px-4 text-center border-b border-white/5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-slate-400 text-[11px] sm:text-xs">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
            MoU Partners:
          </span>
          {UNIVERSITY_PARTNERS.map((univ, i) => (
            <span key={i} className="text-slate-300 font-medium">
              🎓 {univ}
            </span>
          ))}
        </div>
      </div>

      {/* 4 Core Value Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/80">
            Why Intern With Us
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2.5">
            Engineered for Maximum Career Impact
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2">
            We don't teach from slides. You ship real code, handle real user traffic, and learn actual industry DevOps pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-md shadow-orange-500/20">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Live Production Code</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              No textbook toys. Write scalable code deployed on production cloud servers with GitHub PR workflows.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Architect Mentorship</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Get 1-on-1 code reviews, architectural feedback, and weekly sprints guided directly by senior engineers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">QR Verified Credential</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Earn an anti-tamper digital certificate instantly verifiable online by recruiters worldwide on our portal.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Fast-Track PPO Pathway</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Top performing interns receive direct Pre-Placement Offers (PPO) for full-time software engineering roles.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Tracks Showcase - 3 Column Layout */}
      <section id="tracks-section" className="bg-slate-50/70 py-10 sm:py-14 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/80">
              Curriculum & Management Tracks
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Specialized Industrial Tracks
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
              Choose the specialized track that aligns with your career goals and college curriculum.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === 'All'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                All Tracks ({INTERNSHIP_TRACKS.length})
              </button>
              <button
                onClick={() => setActiveCategory('IT')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'IT'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                IT & Software Tracks ({INTERNSHIP_TRACKS.filter(t => t.category === 'IT').length})
              </button>
              <button
                onClick={() => setActiveCategory('Non-IT')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'Non-IT'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Non-IT & Management Tracks ({INTERNSHIP_TRACKS.filter(t => t.category === 'Non-IT').length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {INTERNSHIP_TRACKS
              .filter(track => activeCategory === 'All' || track.category === activeCategory)
              .map((track, idx) => {
                const TrackIcon = track.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-orange-400/40 hover:-translate-y-1 group relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${track.color} text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
                            <TrackIcon className="w-5 h-5" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                            {track.title}
                          </h3>
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 border ${
                          track.category === 'IT'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {track.category}
                        </span>
                      </div>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                        {track.desc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {track.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200/70">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenApplyModal({ title: `${track.title} Intern`, type: 'Internship' })}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Apply for this Track</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Direct Application CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Fast-Track Onboarding
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Kickstart Your Career?</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Select your preferred domain above or submit a direct application. Verified candidates receive official PaulTech offer letters and direct onboarding into client projects.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleOpenApplyModal({ title: 'General Industrial Internship', type: 'Internship' })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit Direct Application</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION MODAL */}
      {selectedInternship && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 relative my-auto max-h-[95vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Application & Payment Successful!</h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you <strong className="text-slate-900">{candidateName}</strong>! Your application for <strong className="text-slate-900">{selectedInternship?.title}</strong> and registration fee of <strong className="text-orange-600 font-bold">₹1,000</strong> have been confirmed.
                </p>

                {lastPaymentInfo && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto text-left text-xs space-y-1 shadow-xs">
                    <div className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500 font-medium">Transaction ID:</span>
                      <span className="font-mono font-bold text-slate-900">{lastPaymentInfo.paymentId}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500 font-medium">Amount Paid:</span>
                      <span className="font-bold text-emerald-600">₹{lastPaymentInfo.amount} INR</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span className="text-slate-500 font-medium">Payment Mode:</span>
                      <span className="font-bold text-slate-700">{lastPaymentInfo.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-500 font-medium">Status:</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Verified & Paid</span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleCloseModal}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md"
                  >
                    Done & Return
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3">
                {/* Clean Compact Header */}
                <div className="pr-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    Apply for {selectedInternship.title}
                  </h3>
                </div>

                {/* Price Bar */}
                <div className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-50/80 via-amber-50/40 to-slate-50 border border-orange-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-700 font-bold">Registration Fee:</span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-xs border border-orange-400">
                      ₹1,000 <span className="text-[10px] font-bold text-orange-100">INR</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold bg-white/90 px-2.5 py-1 rounded-md border border-slate-200/70 shadow-2xs hidden sm:block">
                    Includes seat reservation, training & offer letter
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* 2-Column Grid Layout for Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={candidateName}
                      onChange={e => setCandidateName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={candidatePhone}
                      onChange={e => setCandidatePhone(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@gmail.com"
                      value={candidateEmail}
                      onChange={e => setCandidateEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>

                  {/* Domain Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Internship Domain *</label>
                    <select
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:bg-white font-medium text-slate-800"
                    >
                      {PRESET_DOMAINS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mode Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Internship Mode *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTrainingMode('Offline')}
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all text-xs font-semibold ${
                          trainingMode === 'Offline'
                            ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        🏢 Offline (Jamshedpur)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTrainingMode('Online')}
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all text-xs font-semibold ${
                          trainingMode === 'Online'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        🌐 Online (Remote)
                      </button>
                    </div>
                  </div>

                  {/* Duration & Joining Date */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-0.5">Duration *</label>
                      <select
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 font-medium"
                      >
                        <option value="1">1 Month</option>
                        <option value="2">2 Months</option>
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-0.5">Joining Date *</label>
                      <input
                        type="date"
                        required
                        value={joiningDate}
                        onChange={e => setJoiningDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* College / University */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">College / University</label>
                    <input
                      type="text"
                      placeholder="e.g. NSU Jamshedpur"
                      value={collegeName}
                      onChange={e => setCollegeName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>

                  {/* Degree & Branch */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Degree & Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech CSE / BCA"
                      value={degreeBranch}
                      onChange={e => setDegreeBranch(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Graduation Year / Batch</label>
                    <select
                      value={passingYear}
                      onChange={e => setPassingYear(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 font-medium"
                    >
                      <option value="2025">2025 Passing Out</option>
                      <option value="2026">2026 Passing Out</option>
                      <option value="2027">2027 Passing Out</option>
                      <option value="2028">2028 Passing Out</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Upload Resume (PDF / DOC) *</label>
                    <div className="relative">
                      <input
                        type="file"
                        id="intern-resume-input"
                        accept=".pdf,.doc,.docx"
                        required
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setResumeFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="intern-resume-input"
                        className={`flex items-center gap-2 px-3 py-1.5 border border-dashed rounded-lg cursor-pointer transition-all ${
                          resumeFile
                            ? 'border-emerald-400 bg-emerald-50/60'
                            : 'border-slate-300 hover:border-orange-400 bg-slate-50'
                        }`}
                      >
                        {resumeFile ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold truncate">
                            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[160px]">{resumeFile.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                            <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>Attach PDF / DOC resume</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">GitHub / Portfolio or Note (Optional)</label>
                  <input
                    type="text"
                    placeholder="GitHub URL, notable projects, or career goals..."
                    value={coverNote}
                    onChange={e => setCoverNote(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{submitting ? 'Processing...' : 'Pay ₹1,000 & Apply Now'}</span>
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

export default Internships;
