import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  MessageCircle, 
  ExternalLink, 
  ChevronDown, 
  ArrowRight, 
  Building2,
  HelpCircle
} from 'lucide-react';
import { API_BASE_URL } from '../student-app/config';

const faqs = [
  {
    q: "How soon can PaulTech start on our project?",
    a: "After our initial architecture consultation and scope finalization, we typically assemble your dedicated engineering team and begin the development sprint within 3 to 5 business days."
  },
  {
    q: "Do you sign a Non-Disclosure Agreement (NDA)?",
    a: "Absolutely. We treat all client intellectual property with the highest confidentiality. We are happy to sign a mutual NDA prior to discussing any technical or proprietary requirements."
  },
  {
    q: "What technologies does PaulTech specialize in?",
    a: "Our core expertise includes Full-Stack Web Development (React, Next.js, Node.js), Enterprise ERP & CRM systems, Mobile Apps (React Native, Flutter), Cloud DevOps (AWS, Azure, Docker, Kubernetes), and AI automation."
  },
  {
    q: "Do you provide post-deployment support and maintenance?",
    a: "Yes, every enterprise project comes with dedicated post-launch SLA support, automated uptime monitoring, security patching, and regular feature iteration packages."
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    subject: '', 
    message: '' 
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const DOMAIN_TYPOS = {
    'gamil.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gamil.co': 'gmail.com',
    'gmaill.co': 'gmail.com',
    'gmil.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
    'hotmial.com': 'hotmail.com'
  };

  const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com',
    'throwawaymail.com', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'getnada.com', 'yopmail.com', 'mohmal.com', 'dispostable.com',
    'sharklasers.com', 'crazymailing.com', 'emailondeck.com'
  ]);

  const validateEmail = (email) => {
    if (!email || !email.trim()) return 'Please enter your email address';
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) return 'Enter a valid email';

    const parts = trimmed.split('@');
    if (parts.length !== 2) return 'Enter a valid email';
    const [username, domain] = parts;

    if (DOMAIN_TYPOS[domain]) {
      return `Did you mean @${DOMAIN_TYPOS[domain]}?`;
    }

    if (DISPOSABLE_DOMAINS.has(domain)) {
      return 'Temporary / disposable emails are not allowed';
    }

    if (domain === 'gmail.com') {
      if (username.length < 6 || username.length > 30) {
        return 'Gmail username must be 6-30 characters';
      }
      if (username.startsWith('.') || username.endsWith('.')) {
        return 'Gmail username cannot start or end with a dot';
      }
      if (username.includes('..')) {
        return 'Gmail username cannot contain consecutive dots (..)';
      }
      if (!/^[a-z0-9.]+$/.test(username)) {
        return 'Gmail username can only contain letters, numbers, and dots';
      }
    }

    return '';
  };

  const validatePhone = (phone) => {
    if (!phone || !phone.trim()) return 'Please enter a 10-digit mobile number';
    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) return 'Mobile number must be exactly 10 digits';
    if (!/^[6-9]/.test(clean)) return 'Indian numbers must start with 6, 7, 8, or 9';
    return '';
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, email: val }));
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(val) }));
    }
  };

  const handlePhoneChange = (e) => {
    // Only accept numbers and restrict to 10 digits
    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: clean }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: validatePhone(clean) }));
    }
  };

  const handleEmailBlur = () => {
    if (formData.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(formData.email) }));
    }
  };

  const handlePhoneBlur = () => {
    if (formData.phone) {
      setErrors(prev => ({ ...prev, phone: validatePhone(formData.phone) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);

    if (emailErr || phoneErr) {
      setErrors({ email: emailErr, phone: phoneErr });
      return;
    }

    setErrors({});
    setStatus('sending');
    
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject,
      message: formData.message.trim()
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const resData = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setErrors({});
      } else {
        setStatus('error');
        if (resData.message) {
          if (resData.message.toLowerCase().includes('email')) {
            setErrors(prev => ({ ...prev, email: resData.message }));
          } else if (resData.message.toLowerCase().includes('mobile') || resData.message.toLowerCase().includes('phone')) {
            setErrors(prev => ({ ...prev, phone: resData.message }));
          }
        }
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      setStatus('error'); 
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. Hero Section */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-orange-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            24/7 Dedicated Client Support & Inquiries
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Let's Discuss Your Next Big Project
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed mb-4">
            Have a product in mind, need enterprise ERP implementation, or want to scale your software architecture? Our engineering team is ready to assist you.
          </p>

          {/* Quick Trust Highlights Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span>&lt; 2 Hours Response Time</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Confidential (NDA on Request)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Free Architecture Consultation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid: Direct Channels & Enterprise Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 -mt-4 sm:-mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column (5 Cols): Direct Contact Channels */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden flex flex-col justify-between h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full pointer-events-none" />

              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                  Connect Directly
                </h2>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  Reach our technical and business development team via phone, email, or visit our Jamshedpur campus.
                </p>
              </div>
              
              <div className="space-y-4 my-auto">
                
                {/* Channel 1: Phone */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50/80 hover:bg-orange-50/60 border border-slate-100 hover:border-orange-200 transition-all duration-300 group">
                  <div className="p-3 bg-orange-500 text-white rounded-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Direct Call</span>
                    <a 
                      href="tel:+917209986943" 
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-orange-600 transition-colors block"
                    >
                      +91 7209986943
                    </a>
                    <span className="text-[11px] text-slate-500">Available Mon - Sat, 10 AM - 7 PM</span>
                  </div>
                </div>

                {/* Channel 2: Email */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50/80 hover:bg-orange-50/60 border border-slate-100 hover:border-orange-200 transition-all duration-300 group">
                  <div className="p-3 bg-orange-500 text-white rounded-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Email Inquiry</span>
                    <a 
                      href="mailto:hr@paultechsoftwareservices.com" 
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-orange-600 transition-colors break-all block"
                    >
                      hr@paultechsoftwareservices.com
                    </a>
                    <span className="text-[11px] text-slate-500">Expect replies within 2 hours</span>
                  </div>
                </div>

                {/* Channel 3: Address */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50/80 hover:bg-orange-50/60 border border-slate-100 hover:border-orange-200 transition-all duration-300 group">
                  <div className="p-3 bg-orange-500 text-white rounded-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Corporate Office</span>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      34, First Floor, Pacific Height Building, Aambagan, Sakchi, Jamshedpur - 831001
                    </p>
                  </div>
                </div>

                {/* Channel 4: Hours */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="p-3 bg-slate-800 text-orange-400 rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">Working Hours</span>
                    <p className="text-sm font-medium text-slate-700">
                      Mon – Sat: <span className="font-bold text-slate-900">10:00 AM – 7:00 PM</span>
                    </p>
                    <p className="text-xs text-rose-500 font-medium">Sunday: Closed</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Right Column (7 Cols): Enterprise Inquiry Form */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/60 border border-slate-100 relative flex flex-col justify-between h-full">
              
              <div className="mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 text-orange-600 font-semibold text-xs mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>PROJECT INQUIRY FORM</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Fill out the form below with your project requirements, and our solution architects will prepare a proposal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Your Full Name <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Enter your name" 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 focus:bg-white"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required 
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Business Email / Gmail <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 focus:bg-white ${
                          errors.email 
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
                            : 'border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                        }`}
                        value={formData.email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        required 
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                </div>

                {/* Row 2: Phone & Service Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Phone Number (Strict 10-Digit Indian Mobile Number) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Mobile / WhatsApp Number <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-xs font-bold select-none">
                        <span>🇮🇳 +91</span>
                        <span className="text-slate-300 ml-1.5 mr-0.5">|</span>
                      </div>
                      <input 
                        type="tel" 
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10-digit mobile number" 
                        className={`w-full pl-20 pr-12 py-3 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 focus:bg-white tracking-wide font-medium ${
                          errors.phone 
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
                            : 'border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                        }`}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 text-[11px] font-semibold">
                        {formData.phone ? `${formData.phone.length}/10` : ''}
                      </div>
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Service Needed */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                      Service Required <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 focus:bg-white appearance-none cursor-pointer"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required 
                      >
                        <option value="" disabled>Select a Service...</option>
                        <option value="Web Design and Development">Web Application (React, Next.js, MERN)</option>
                        <option value="Mobile Application Development">Mobile Application (iOS & Android)</option>
                        <option value="Enterprise ERP & CRM Systems">Enterprise ERP & CRM Systems</option>
                        <option value="Cloud Architecture & DevOps">Cloud Architecture, DevOps & Migration</option>
                        <option value="AI Solutions & Automation">AI Solutions & Machine Learning</option>
                        <option value="Logo Design & Branding">UI/UX Design, Branding & Graphics</option>
                        <option value="Project Store & Source Code Inquiry">Project Store & Source Code Inquiry</option>
                        <option value="IT Consulting & Staff Augmentation">IT Consulting & Staff Augmentation</option>
                        <option value="Other General Inquiry">Other General Inquiry</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                    Project Details & Scope <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea 
                      placeholder="Enter your message or project requirements..." 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 focus:bg-white min-h-[130px] resize-y"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                {/* Submit Button in PaulTech Orange */}
                <div className="pt-2 flex justify-center">
                  <button 
                    type="submit" 
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto min-w-[220px] inline-flex justify-center items-center gap-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:via-orange-700 hover:to-amber-600 text-white font-semibold text-base py-3.5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-medium flex items-center gap-3 animate-fade-in shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Message sent successfully!</p>
                      <p className="text-xs text-emerald-700">Thank you for reaching out. Our solution architect will contact you within 2 hours.</p>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-sm font-medium flex items-center gap-3 animate-fade-in shadow-sm">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <p className="font-bold">Failed to send message</p>
                      <p className="text-xs text-rose-700">Please check your network connection or call us directly at +91 7209986943.</p>
                    </div>
                  </div>
                )}

              </form>

            </div>
          </div>
        </div>

        {/* Full-Width WhatsApp Instant Connect Banner */}
        <div className="mt-8 sm:mt-10 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 border border-slate-700/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-full bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5 text-center md:text-left">
              <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0 hidden sm:flex">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 sm:hidden">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Need an Instant Response?</h3>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ONLINE NOW
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Have urgent project scope questions or need immediate consultation? Skip email queues and chat directly with our senior engineering lead on WhatsApp.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/917209986943?text=Hello%20PaulTech%2C%20I%20would%20like%20to%20inquire%20about%20your%20software%20and%20IT%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:via-orange-700 hover:to-amber-600 text-white font-semibold text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Interactive Office Map Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>OFFICE LOCATION</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Visit PaulTech Software Services
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Located centrally in Sakchi, Jamshedpur with dedicated parking for clients.
              </p>
            </div>

            <a
              href="https://maps.google.com/maps?q=Paultech+Software+Services+Pvt+Ltd,+Sakchi,+Jamshedpur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-orange-200 hover:border-orange-500 text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-500 font-semibold text-xs sm:text-sm transition-all shadow-sm"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full rounded-2xl overflow-hidden h-[300px] sm:h-[400px] border border-slate-200 shadow-inner relative">
            <iframe 
              src="https://maps.google.com/maps?q=Paultech%20Software%20Services%20Pvt%20Ltd,%20Sakchi,%20Jamshedpur&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Paultech Software Services Jamshedpur Office Location"
            />
          </div>

        </div>
      </section>

      {/* 4. Client FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-orange-700 font-semibold text-xs mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMON INQUIRIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Quick answers before you initiate your consultation with our team.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-orange-600 transition-colors"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    openFaqIndex === idx ? 'transform rotate-180 text-orange-500' : ''
                  }`} 
                />
              </button>
              
              {openFaqIndex === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Contact;
