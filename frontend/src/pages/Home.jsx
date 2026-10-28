import React, { useRef, useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../student-app/config';
import AboutServicesShowcase from '../components/AboutServicesShowcase';
import { openRazorpayPopup } from '../utils/razorpay';
import { 
  GraduationCap, 
  Code2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Award, 
  CheckCircle,
  Building2,
  Globe,
  MapPin,
  Video,
  Check,
  X,
  FileText,
  Upload,
  Send,
  CreditCard
} from 'lucide-react';

const PRESET_DOMAINS = [
  'MERN stack',
  'FULL STACK PHP',
  'Full stack (DJANGO)',
  'WEB DESIGN',
  'Data Analytics',
  'DATA Science',
  'AI/ML',
  'Human Resources (HR)',
  'Marketing',
  'Digital Marketing',
  'Finance'
];

const StatCounter = ({ endValue, label, subtext, badge, iconType }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    return () => {
      if (counterRef.current) observer.unobserve(counterRef.current);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      let startTimestamp = null;
      const duration = 2000;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        setCount(Math.floor(easeProgress * endValue));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(endValue);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [isVisible, endValue]);

  const renderIcon = () => {
    switch (iconType) {
      case 'clients':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'projects':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'followers':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      case 'orders':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div
      ref={counterRef}
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.04)] hover:shadow-[0_22px_40px_-6px_rgba(249,115,22,0.22),0_8px_16px_-4px_rgba(15,23,42,0.06)] hover:border-orange-300/80 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden text-left"
    >
      {/* Specular Liquid Glass Sheen Overlay */}
      <div className="pointer-events-none absolute -inset-full w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-orange-50/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

      {/* Top Ambient Highlight Accent Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Ambient Soft Glow Behind Number */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl group-hover:scale-125 group-hover:bg-orange-500/20 transition-all duration-500 pointer-events-none" />

      {/* Top Row: Status Badge on Left + Glowing Tech Icon Tile on Right */}
      <div className="flex items-center justify-between w-full relative z-10 mb-4 sm:mb-6">
        {badge ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-semibold tracking-wide group-hover:bg-orange-50 group-hover:text-orange-700 group-hover:border-orange-200 transition-colors shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{badge}</span>
          </div>
        ) : <div />}

        {/* High-Tech Glowing Icon Tile */}
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-orange-50 border border-orange-200/80 text-orange-600 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-orange-500/30 group-hover:scale-110 transition-all duration-300">
          {renderIcon()}
        </div>
      </div>

      {/* Center: Big Bold Typography Count */}
      <div className="relative z-10 my-1 sm:my-3">
        <div className="flex items-baseline tracking-tight">
          <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 group-hover:text-transparent group-hover:bg-clip-text bg-gradient-to-r group-hover:from-orange-600 group-hover:via-amber-500 group-hover:to-orange-500 transition-all duration-300 font-sans">
            {count.toLocaleString()}
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold ml-1 text-orange-500 group-hover:text-amber-500 transition-colors">
            +
          </span>
        </div>
      </div>

      {/* Bottom: Label and Subtext */}
      <div className="relative z-10 mt-2 pt-2.5 border-t border-slate-100 group-hover:border-orange-100 transition-colors">
        <h4 className="text-slate-900 font-bold text-sm sm:text-base group-hover:text-orange-600 transition-colors duration-200">
          {label}
        </h4>
        {subtext && (
          <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

const Home = () => {

  const timelineRef = useRef(null);
  const isTimelineDragging = useRef(false);
  const timelineStartX = useRef(0);
  const timelineScrollLeft = useRef(0);
  const [isTimelineHovered, setIsTimelineHovered] = useState(false);
  const videoRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Apply Modal State for Internships
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [internshipMode, setInternshipMode] = useState('Offline'); // 'Offline' | 'Online'
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [lastPaymentInfo, setLastPaymentInfo] = useState(null);

  const handleOpenApplyModal = (mode = 'Offline', initialDomain = 'MERN stack') => {
    setInternshipMode(mode || 'Offline');
    setDomain(initialDomain || 'MERN stack');
    setCandidateName('');
    setCandidateEmail('');
    setCandidatePhone('');
    setCollegeName('');
    setDegreeBranch('');
    setPassingYear('2025');
    setCoverNote('');
    setResumeFile(null);
    setSubmitSuccess(false);
    setErrorMsg('');
    setDuration('2');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setIsApplyModalOpen(true);
  };

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
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

    // Launch official Razorpay Checkout Popup Modal directly
    openRazorpayPopup({
      amount: 1000,
      title: `${domain} Industrial Internship Registration`,
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
      formData.append('jobTitle', `${domain} Industrial Internship (${internshipMode})`);
      formData.append('candidateName', candidateName);
      formData.append('candidateEmail', candidateEmail);
      formData.append('candidatePhone', candidatePhone);
      formData.append('mode', internshipMode);
      formData.append('domain', domain);
      formData.append('duration', duration);
      formData.append('joining_date', joiningDate);
      formData.append('college', collegeName);
      formData.append('branch', degreeBranch);
      formData.append('graduationYear', passingYear);
      formData.append('experience', `College Student - ${degreeBranch ? degreeBranch + ', ' : ''}${collegeName || 'Fresher'} (Batch: ${passingYear})`);
      
      const combinedNotes = `Internship Mode: ${internshipMode}\nCollege: ${collegeName || 'N/A'}\nBranch: ${degreeBranch || 'N/A'}\nGraduation Year: ${passingYear}\nDomain: ${domain}\nDuration: ${duration} Months\nJoining Date: ${joiningDate}\n\nPayment Ref: ${paymentInfo.paymentId}\nPayment Method: ${paymentInfo.paymentMethod}\nRegistration Fee Paid: ₹${paymentInfo.amount}\n\nStudent Message:\n${coverNote}`;
      formData.append('coverNote', combinedNotes);
      formData.append('resume', resumeFile);

      // Payment details for backend schema
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

  const fallbackEvents = [
    {
      _id: '1',
      title: 'Mastering Full Stack MERN & AI Integration 2026',
      eventType: 'Bootcamp',
      priceType: 'Free',
      price: 0,
      date: '15th October 2026',
      time: '6:00 PM IST',
      duration: '2 Hours',
      instructor: 'Ganesh Paul (Senior Software Architect)',
      platform: 'Google Meet',
      bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      description: 'Learn how to build production-ready full stack web applications with React, Node.js, and integrate AI models natively into your software suite.'
    },
    {
      _id: '2',
      title: 'Cybersecurity & Cloud Microservices Masterclass',
      eventType: 'Webinar',
      priceType: 'Free',
      price: 0,
      date: '22nd October 2026',
      time: '5:00 PM IST',
      duration: '1.5 Hours',
      instructor: 'PaulTech Engineering Team',
      platform: 'Zoom Live',
      bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      description: 'Deep dive into zero-trust cloud architectures, Kubernetes deployments, and enterprise data encryption strategies for modern tech startups.'
    },
    {
      _id: '3',
      title: 'Data Science & Applied Machine Learning Workshop',
      eventType: 'Workshop',
      priceType: 'Paid',
      price: 499,
      date: '30th October 2026',
      time: '4:00 PM IST',
      duration: '3 Hours',
      instructor: 'Lead AI Specialist',
      platform: 'Google Meet',
      bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      description: 'Hands-on practical workshop covering Python data pipelines, pandas manipulation, predictive modeling, and deploying ML APIs to production.'
    }
  ];

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events`);
        if (res.data && res.data.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const upcoming = res.data.filter(ev => {
            if (ev.status === 'Completed') return false;
            if (!ev.date) return true;
            const evDate = new Date(ev.date.includes('T') ? ev.date : `${ev.date}T23:59:59`);
            return isNaN(evDate.getTime()) || today <= evDate;
          });
          setFeaturedEvents(upcoming.length > 0 ? upcoming.slice(0, 3) : res.data.slice(0, 3));
        } else {
          setFeaturedEvents(fallbackEvents);
        }
      } catch (err) {
        console.error('Error fetching home events:', err);
        setFeaturedEvents(fallbackEvents);
      }
    };
    fetchFeaturedEvents();
  }, []);

  useEffect(() => {
    if (!featuredEvents || featuredEvents.length === 0) return;
    // Preload images into browser cache so slide transitions are instant & lag-free
    featuredEvents.forEach((ev) => {
      if (ev?.bannerImage) {
        const img = new Image();
        img.src = ev.bannerImage;
      }
    });

    const timer = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredEvents]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/testimonials`);
        setTestimonials(res.data);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      }
    };
    fetchTestimonials();
  }, []);

  // Prepare repeated items so the marquee flows seamlessly and continuously without gaps
  const marqueeTestimonials = useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    const repeatCount = Math.max(2, Math.ceil(8 / testimonials.length));
    const list = [];
    for (let i = 0; i < repeatCount; i++) {
      testimonials.forEach((item, originalIdx) => {
        list.push({ ...item, _uniqueKey: `${item._id || originalIdx}-${i}` });
      });
    }
    return list;
  }, [testimonials]);

  const scrollTimeline = (direction) => {
    if (timelineRef.current) {
      const container = timelineRef.current;
      const firstCard = container.querySelector('[data-step-card]');
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 350;
      const scrollStep = cardWidth + 24;
      const maxScroll = container.scrollWidth - container.clientWidth;

      let target;
      if (direction === 'left') {
        target = container.scrollLeft <= 10 ? maxScroll : container.scrollLeft - scrollStep;
      } else {
        target = container.scrollLeft + container.clientWidth >= container.scrollWidth - 15 ? 0 : container.scrollLeft + scrollStep;
      }

      container.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  const handleTimelineMouseDown = (e) => {
    if (!timelineRef.current) return;
    isTimelineDragging.current = true;
    setIsTimelineHovered(true);
    timelineStartX.current = e.pageX - timelineRef.current.offsetLeft;
    timelineScrollLeft.current = timelineRef.current.scrollLeft;
  };

  const handleTimelineMouseMove = (e) => {
    if (!isTimelineDragging.current || !timelineRef.current) return;
    e.preventDefault();
    const x = e.pageX - timelineRef.current.offsetLeft;
    const walk = (x - timelineStartX.current) * 1.3;
    timelineRef.current.scrollLeft = timelineScrollLeft.current - walk;
  };

  const handleTimelineMouseUpOrLeave = () => {
    isTimelineDragging.current = false;
  };

  useEffect(() => {
    if (isTimelineHovered) return;

    const interval = setInterval(() => {
      if (timelineRef.current && window.innerWidth >= 768 && !isTimelineDragging.current) {
        const container = timelineRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const firstCard = container.querySelector('[data-step-card]');
        const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 350;
        const scrollStep = cardWidth + 24;

        if (scrollLeft + clientWidth >= scrollWidth - 25) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isTimelineHovered]);

  // Placeholder images based on the reference screenshots
  const heroImage = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80"; // Handshake

  const services = [
    {
      title: "Web Design and Development",
      desc: "Web designing is not just about making a website look pretty; it's about creating an immersive digital experience that engages users and communicates your brand effectively.",
      img: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=600&q=80",
      path: "/services"
    },
    {
      title: "Mobile Application Development",
      desc: "We build intuitive, responsive, and high-performance mobile applications for both iOS and Android platforms to help you reach your customers on the go.",
      img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
      path: "/services"
    },
    {
      title: "ERP Development",
      desc: "Streamline your enterprise operations with custom ERP software tailored to your workflow, boosting productivity, automation, and data centralization.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      path: "/services"
    },
    {
      title: "Logo Design & Branding",
      desc: "Create a strong brand identity with our professional logo design services. We craft unique, memorable logos that resonate with your target audience.",
      img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
      path: "/services"
    },
    {
      title: "Consulting",
      desc: "Our expert IT consultants provide strategic guidance to help you navigate complex technological transformations and optimize your business processes.",
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      path: "/services"
    },
    {
      title: "Digital Marketing",
      desc: "Boost your online visibility and drive conversions with our comprehensive digital marketing strategies, including SEO, social media, and PPC campaigns.",
      img: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=600&q=80",
      path: "/services"
    }
  ];

  const processSteps = [
    {
      step: "Step 1",
      title: "Requirement Analysis",
      desc: "This step focuses on understanding client and user needs. Meetings are held with stakeholders, requirements are gathered, and documented to ensure clarity of features and expectations.",
      img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80"
    },
    {
      step: "Step 2",
      title: "Planning",
      desc: "In planning, the project roadmap is created by estimating cost, time, and resources. Risks are identified and a proper plan is made to ensure the project is achievable within constraints.",
      img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80"
    },
    {
      step: "Step 3",
      title: "System Design",
      desc: "System design translates requirements into a blueprint. It covers system architecture, database design, UI wireframes, and data flow to guide developers during coding.",
      img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&q=80"
    },
    {
      step: "Step 4",
      title: "Development",
      desc: "The actual coding takes place here. Developers bring the wireframes and system architecture to life using the most appropriate and modern tech stack for optimal performance.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80"
    },
    {
      step: "Step 5",
      title: "Testing & QA",
      desc: "Rigorous testing ensures the software is bug-free and meets all requirements. We perform unit testing, integration testing, and user acceptance testing before delivery.",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"
    },
    {
      step: "Step 6",
      title: "Deployment & Support",
      desc: "The final product is launched to the live environment. We ensure smooth deployment and provide ongoing maintenance and support to handle future scaling needs.",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const stats = [
    { 
      number: 35, 
      label: "Happy Clients",
      subtext: "Worldwide Trust & Retention",
      badge: "Verified Trust",
      iconType: "clients"
    },
    { 
      number: 42, 
      label: "Done Projects",
      subtext: "Production-Ready Systems",
      badge: "Completed",
      iconType: "projects"
    },
    { 
      number: 8100, 
      label: "Followers",
      subtext: "Active Global Community",
      badge: "Global Reach",
      iconType: "followers"
    },
    { 
      number: 48, 
      label: "Orders",
      subtext: "Seamless On-Time Delivery",
      badge: "Fulfilled",
      iconType: "orders"
    }
  ];

  // Hardcoded testimonials removed. Data is fetched dynamically.

  const mous = [
    {
      name: "Netaji Subhas University, Jamshedpur",
      date: "3rd December 2024",
      img: "/images/mou/netaji-subhas-university.jpg",
      desc: "offer industrial training and internship opportunities specifically for Computer Science and Engineering students. This collaboration will provide students with real-world experience, skill enhancement, networking opportunities, and improved employability."
    },
    {
      name: "Srinath University, Jamshedpur",
      date: "27th January 2025",
      img: "/images/mou/srinath-university.jpg",
      desc: "offer industrial training and internship opportunities specifically for IT, Finance, HR & Marketing students. This collaboration will provide students with real-world experience, skill enhancement, networking opportunities, and improved employability."
    },
    {
      name: "AL KABIR POLYTECHNIC COLLEGE, Jamshedpur",
      date: "12th MARCH 2025",
      img: "/images/mou/al-kabir-polytechnic.jpg",
      desc: "offer industrial training and internship opportunities specifically for Computer Science and Engineering students. This collaboration will provide students with Real-world experience, Skill enhancement, Networking opportunities, Improved employability."
    },
    {
      name: "Arka Jain University, Jamshedpur",
      date: "11th April 2025",
      img: "/images/mou/arka-jain-university.jpg",
      desc: "offer industrial training and internship opportunities specifically for Computer Science and Engineering students. This collaboration will provide students with real-world experience, skill enhancement, networking opportunities, and improved employability."
    },
    {
      name: "Templecity Institute of Technology & Engineering (TITE), Odisha",
      date: "Academic Year 2025",
      img: "/images/mou/tite-odisha.jpg",
      desc: "provide industrial training and internship opportunities for students pursuing Computer Science and Engineering.",
      customText: "We are delighted to announce the signing of a Memorandum of Understanding (MoU) with TITE, Templecity Institute of Technology & Engineering, Odisha marking the beginning of a valuable collaboration focused on empowering the next generation of technology professionals. This strategic partnership has been established to provide industrial training and internship opportunities for students pursuing Computer Science and Engineering. By connecting academic learning with practical industry experience, the initiative aims to equip students with the skills, knowledge, and confidence required to excel in today's competitive professional environment."
    },
    {
      name: "St. Xavier's College, Dumka",
      date: "Academic Year 2025",
      img: "/images/mou/st-xaviers-college-dumka.webp",
      desc: "create a strong platform for students to learn, innovate, and prepare for successful careers in the ever-evolving technology sector.",
      customText: "We are delighted and proud to announce that we have signed a Memorandum of Understanding (MoU) with St. Xavier College, Dumka, Jharkhand. We believe that this partnership will create a strong platform for students to learn, innovate, and prepare for successful careers in the ever-evolving technology sector. By working together, we aim to nurture future-ready professionals equipped with the skills and experience needed to excel in the industry. We look forward to a fruitful and long-lasting association with St. Xavier College, Dumka."
    }
  ];

  const techRow1 = [
    { name: "Python", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "Django", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" },
    { name: "Node.js", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "PostgreSQL", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
    { name: "MongoDB", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
    { name: "Docker", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "React", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "Next.js", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
    { name: "TypeScript", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "JavaScript", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "Express.js", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" },
    { name: "Redis", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" },
    { name: "GraphQL", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg" },
    { name: "C++", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
  ];

  const techRow2 = [
    { name: "Google Cloud", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" },
    { name: "Firebase", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" },
    { name: "Tailwind CSS", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Java", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
    { name: "Spring Boot", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg" },
    { name: "Kotlin", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg" },
    { name: "Kubernetes", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg" },
    { name: "AWS", img: "/aws.svg" },
    { name: "Flutter", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg" },
    { name: "MySQL", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
    { name: "Git", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "Linux", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
    { name: "Swift", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg" },
    { name: "PHP", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" },
  ];

  const clientLogos = [
    { 
      name: "Tata Steel", 
      img: "/tata-logo.jpg",
      imgClass: "h-8 sm:h-10 md:h-11 max-w-[75%]"
    },
    { 
      name: "TCS", 
      img: "/tcs-logo.png",
      imgClass: "h-9 sm:h-11 md:h-12 max-w-[75%]"
    },
    { 
      name: "Amrit Packers and Movers", 
      img: "/amrit-packers-logo.jpg",
      imgClass: "h-9 sm:h-11 md:h-12 max-w-[80%]"
    },
    { 
      name: "Madadsathi", 
      img: "/madadsathi-logo.jpg",
      imgClass: "h-10 sm:h-12 md:h-13 max-w-[75%]"
    },
    { 
      name: "Infosys", 
      img: "/infosys-logo.svg",
      imgClass: "h-6 sm:h-7 md:h-8 max-w-[75%]"
    },
    { 
      name: "Tata Steel Foundation", 
      img: "/tsf-logo.png",
      imgClass: "h-8 sm:h-9 md:h-10 max-w-[65%] rounded-md"
    },
    { 
      name: "Wipro", 
      img: "/wipro-logo.svg",
      imgClass: "h-8 sm:h-9 md:h-10 max-w-[75%]"
    },
    { 
      name: "Suncraft Energy", 
      img: "/suncraft-logo.jpg",
      imgClass: "h-9 sm:h-11 md:h-12 max-w-[75%]"
    },
  ];

  return (
    <div className="animate-fade-in bg-white">

      {/* 1. Classic Video Hero Section */}
      <section className="relative min-h-screen min-h-[100dvh] lg:min-h-[calc(100vh-70px)] flex items-center justify-center bg-slate-950 overflow-hidden border-b border-white/10">

          {/* Background Video Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover object-center transition-all duration-700 filter brightness-100 contrast-[1.05]"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>

            {/* Ultra-Clean Light Gradient Overlay (Preserves 100% Video Clarity) */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/25 to-slate-950/80 z-10" />

            {/* Subtle Ambient Brand Glow Orbs */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none z-10"
            />
            <motion.div
              animate={{ scale: [1, 1.25, 1], x: [0, -25, 0], y: [0, 25, 0] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
              className="absolute bottom-10 right-1/3 translate-x-1/4 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none z-10"
            />
          </div>

          {/* Centered Content Container - Shifted higher on mobile with constrained text widths */}
          <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:mt-0 py-6 sm:py-20 lg:py-24 w-full flex flex-col items-center text-center">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full flex flex-col items-center text-center"
            >
              {/* Badge - Shifted higher up with delicate compact styling on mobile */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full bg-slate-950/70 border border-white/20 shadow-2xl backdrop-blur-md mb-3 sm:mb-6"
              >
                <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                <span className="text-slate-200 text-[8.5px] sm:text-xs font-medium sm:font-semibold uppercase tracking-wide sm:tracking-widest">Trusted IT Partner in Jamshedpur, India</span>
              </motion.div>

              {/* Main Title - Constrained width so it wraps beautifully into 2 lines */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-2xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-snug sm:leading-[1.15] mb-3 sm:mb-6 drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)] max-w-[280px] xs:max-w-[320px] sm:max-w-4xl mx-auto"
              >
                Engineering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-orange-400">Digital</span> Excellence
              </motion.h1>

              {/* Description - Constrained width on mobile to create comfortable 3-line flow */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xs sm:text-lg lg:text-xl text-slate-200 max-w-[300px] sm:max-w-2xl mb-5 sm:mb-8 leading-relaxed font-light drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] mx-auto"
              >
                PaulTech Software Services delivers world-class custom software, ERP solutions, and scalable mobile applications tailored for modern enterprises.
              </motion.p>

              {/* Action Buttons - Centered and full-width on mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center items-center w-full max-w-xs sm:max-w-md mx-auto"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link to="/contact" className="relative group overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all hover:from-orange-600 hover:to-orange-700 shadow-[0_0_25px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 w-full">
                    <span>Discuss Your Project</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link to="/services" className="px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold text-green-400 bg-slate-950/60 border border-green-500/40 hover:bg-green-500/20 shadow-lg transition-all flex items-center justify-center backdrop-blur-md w-full">
                    Our Capabilities
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust Indicators - Scaled down for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="mt-6 sm:mt-12 pt-3.5 sm:pt-8 border-t border-white/15 flex items-center justify-center gap-4 sm:gap-16 w-full max-w-sm sm:max-w-none mx-auto"
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-lg sm:text-4xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    10<span className="text-green-400 font-bold">+</span>
                  </span>
                  <span className="text-[9px] sm:text-xs text-slate-300 uppercase tracking-wider mt-0.5 font-semibold">
                    Years Exp.
                  </span>
                </div>
                <div className="w-px h-6 sm:h-10 bg-white/20"></div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-lg sm:text-4xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    99<span className="text-orange-400 font-bold">%</span>
                  </span>
                  <span className="text-[9px] sm:text-xs text-slate-300 uppercase tracking-wider mt-0.5 font-semibold">
                    Retention
                  </span>
                </div>
                <div className="w-px h-6 sm:h-10 bg-white/20"></div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-lg sm:text-4xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    50<span className="text-green-400 font-bold">+</span>
                  </span>
                  <span className="text-[9px] sm:text-xs text-slate-300 uppercase tracking-wider mt-0.5 font-semibold">
                    Projects
                  </span>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </section>

      {/* 2. Why PaulTech Section (Premium Layout) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center">
          <div>
            <h4 className="text-orange-500 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-1.5 sm:mb-3">About Us</h4>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 sm:mb-6 leading-tight">
              Why Choose <br /> PaulTech Software Services?
            </h2>
            <div className="w-14 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 to-green-500 mb-4 sm:mb-8 rounded-full"></div>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-slate-600 leading-relaxed text-xs sm:text-base text-justify">
                Based in the industrial hub of Jamshedpur, Jharkhand, <strong className="font-bold text-slate-900">PaulTech Software Services Pvt. Ltd.</strong> is committed to delivering customized software development, comprehensive IT solutions, and Customize Enterprise ERP Softwares that address the evolving needs of modern businesses.
              </p>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-base text-justify">
                We specialize in developing tailored, technology-driven solutions that align with each client's unique business objectives. With a strong emphasis on quality, scalability, innovation, and timely delivery, we strive to help organizations streamline operations, enhance productivity, and achieve sustainable growth.
              </p>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-base text-justify">
                Our customer-centric approach, technical expertise, and commitment to service excellence enable us to build lasting business relationships and deliver solutions that create meaningful value in today's dynamic digital landscape.
              </p>
            </div>
          </div>

          {/* Right Column: 3D PaulTech "P" Particle Scatter Showcase & Revolving Services */}
          <div className="w-full max-w-[340px] sm:max-w-md lg:max-w-none mx-auto relative flex items-center justify-center">
            <AboutServicesShowcase />
          </div>

        </div>
      </section>

      {/* 2.2 Industrial Internships (Offline vs Online) Showcase */}
      <section className="py-8 sm:py-12 md:py-14 bg-gradient-to-b from-white via-slate-50/60 to-white text-slate-800 relative overflow-hidden border-t border-slate-100">
        {/* Soft Ambient Brand Glows (Compact & Subtle) */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header (Compact & Professional) */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Launch Your Career with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600">
                Industrial Internships
              </span>
            </h2>

            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-lg mx-auto font-normal leading-relaxed">
              Work on live client codebases, master modern Git & Docker workflows, and receive 1-on-1 mentorship from experienced tech leads.
            </p>
          </div>

          {/* 2 Main Mode Boxes: Left (Offline) & Right (Online) - Extended Height to Fill Section Space */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            
            {/* LEFT BOX: Offline Internship */}
            <div className="group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-orange-400 p-6 sm:p-7 md:p-8 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.20)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[460px]">
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Specular Liquid Sheen Overlay */}
              <div className="pointer-events-none absolute -inset-full w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-orange-50/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-2xs">
                    <Building2 className="w-3.5 h-3.5 text-orange-600" />
                    <span>Offline Track</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/70">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    <span>Jamshedpur Center Lab</span>
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-orange-600 transition-colors">
                  Offline Industrial Internship
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 font-normal">
                  Work directly inside our Jamshedpur software lab alongside senior developers and build live applications.
                </p>

                {/* Features List (4 Clean Humanized Points) */}
                <div className="space-y-3 mb-5 flex-1">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="text-slate-800 font-semibold">In-Office Pair Programming:</strong> Code daily with senior devs in a real software lab.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="text-slate-800 font-semibold">Real Production Projects:</strong> Contribute to live client software, not dummy projects.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="text-slate-800 font-semibold">Daily Guidance & Reviews:</strong> Get direct 1-on-1 feedback to refine your coding skills.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="text-slate-800 font-semibold">Verified ISO Certificate:</strong> Official completion credential upon project sign-off.
                    </span>
                  </div>
                </div>

                {/* Tags Strip */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['In-Office Lab', 'Daily Standups', 'Live Sprints', 'Project Certificate'].map((tag) => (
                    <span key={tag} className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-orange-50/80 text-orange-700 border border-orange-200/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Box Footer CTA */}
              <div className="relative z-10 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>🏢 In-Person Lab Track</span>
                  <span>Batch Seats Limited</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenApplyModal('Offline')}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 group/btn transform active:scale-[0.98]"
                >
                  <span>Apply for Offline Track</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* RIGHT BOX: Online Internship */}
            <div className="group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 p-6 sm:p-7 md:p-8 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.20)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[460px]">
              {/* Top Accent Line on Hover */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Specular Liquid Sheen Overlay */}
              <div className="pointer-events-none absolute -inset-full w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-emerald-50/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-2xs">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Online Track</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/70">
                    <Video className="w-3 h-3 text-emerald-600" />
                    <span>Live Virtual Cohort</span>
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-emerald-600 transition-colors">
                  Online Industrial Internship
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 font-normal">
                  Flexible virtual training for college students across India to gain practical experience from home.
                </p>

                {/* Features List (4 Clean Humanized Points) */}
                <div className="space-y-3 mb-5 flex-1">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="text-slate-800 font-semibold">Live Mentoring Sessions:</strong> Scheduled evening & weekend interactive classes on Meet/Zoom.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="text-slate-800 font-semibold">Real Team Workflows:</strong> Learn Git branch commits, pull requests, and team code reviews.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="text-slate-800 font-semibold">Build & Deploy Apps:</strong> Ship full-stack projects you can showcase to recruiters.
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 leading-snug">
                      <strong className="text-slate-800 font-semibold">Verifiable Certificate:</strong> Earn an official ISO digital credential upon project delivery.
                    </span>
                  </div>
                </div>

                {/* Tags Strip */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['100% Remote', 'Flexible Timings', 'Live Mentoring', 'Digital Certificate'].map((tag) => (
                    <span key={tag} className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-emerald-50/80 text-emerald-700 border border-emerald-200/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Box Footer CTA */}
              <div className="relative z-10 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>🌐 100% Virtual Track</span>
                  <span>Open Across India</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenApplyModal('Online')}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group/btn transform active:scale-[0.98]"
                >
                  <span>Apply for Online Track</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2.5 Live Events Carousel Section - White Background with Sleek Dark Full-Banner Card */}
      <section className="bg-white py-6 sm:py-12 md:py-14 border-t border-slate-100 relative overflow-hidden">
        {/* Soft Ambient Brand Glows */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header (Clean & Light) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 gap-2 sm:gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-orange-600 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5 sm:mb-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span>Live Academy</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Featured Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-emerald-600">Events & Bootcamps</span>
              </h2>
            </div>
            
            <Link 
              to="/events" 
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              <span>Explore All Events</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>

          {/* Featured Event Card - Mobile Compact Header Banner & Desktop Landscape Split */}
          {featuredEvents.length > 0 && (
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 group max-w-sm sm:max-w-xl lg:max-w-none mx-auto min-h-[360px] sm:min-h-[400px] lg:min-h-[290px]">
              
              {/* Soft Ambient Dynamic Color Reflections */}
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEventIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  {/* Subtle Blurred Backdrop of Poster for Depth */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 filter blur-3xl scale-110">
                    <img
                      src={featuredEvents[activeEventIndex]?.bannerImage}
                      alt=""
                      loading="eager"
                      decoding="sync"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Responsive Layout: Mobile Poster Top, Desktop Landscape Split */}
                  <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-center p-3 sm:p-6 lg:p-10">
                    
                    {/* Poster Showcase: Top on mobile, Right column on desktop */}
                    <div className="w-full lg:col-span-5 lg:order-2 relative flex items-center justify-center">
                      <div className="relative aspect-[2.1/1] sm:aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-slate-950 group-hover:border-orange-500/40 transition-all duration-500">
                        <img
                          src={featuredEvents[activeEventIndex]?.bannerImage}
                          alt={featuredEvents[activeEventIndex]?.title}
                          loading="eager"
                          decoding="sync"
                          className="w-full h-full object-cover object-center filter brightness-100 contrast-105 group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Subtle bottom gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                        {/* Floating Badges Over Image */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex items-center gap-1 sm:gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 backdrop-blur-md text-[9px] sm:text-xs font-black uppercase tracking-wider text-slate-950 shadow-sm">
                            {featuredEvents[activeEventIndex]?.eventType}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-xs font-black uppercase tracking-wider shadow-sm ${
                            featuredEvents[activeEventIndex]?.priceType === 'Free' 
                              ? 'bg-emerald-400 text-slate-950' 
                              : 'bg-orange-500 text-white'
                          }`}>
                            {featuredEvents[activeEventIndex]?.priceType === 'Free' ? 'FREE PASS' : `₹${featuredEvents[activeEventIndex]?.price}`}
                          </span>
                        </div>

                        {/* Floating Platform Badge */}
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] sm:text-xs font-bold text-slate-200 border border-white/20 shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                          <span>{featuredEvents[activeEventIndex]?.platform || 'Live Session'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Left Side (Desktop) / Bottom (Mobile): Information & Actions */}
                    <div className="w-full lg:col-span-7 lg:order-1 flex flex-col justify-center space-y-1.5 sm:space-y-3.5">
                      
                      {/* Date & Time pill */}
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-orange-400">
                        <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>{featuredEvents[activeEventIndex]?.date} • {featuredEvents[activeEventIndex]?.time}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-sm">
                        {featuredEvents[activeEventIndex]?.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {featuredEvents[activeEventIndex]?.description}
                      </p>

                      {/* Action Buttons & Instructor */}
                      <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 pt-1">
                        <Link
                          to="/events"
                          className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                        >
                          <span>Reserve Seat Now</span>
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </Link>

                        {featuredEvents[activeEventIndex]?.instructor && (
                          <div className="text-[10px] sm:text-xs text-slate-300 font-medium flex items-center gap-1 bg-slate-800/80 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-white/10 truncate max-w-[150px] sm:max-w-[220px]">
                            <span className="text-slate-400">By:</span>
                            <span className="font-semibold text-white truncate">{featuredEvents[activeEventIndex]?.instructor}</span>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Left & Right Arrow Navigation Controls */}
              <button
                onClick={() => setActiveEventIndex((prev) => (prev === 0 ? featuredEvents.length - 1 : prev - 1))}
                className="hidden md:flex absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800/90 hover:bg-orange-500 border border-white/20 text-white items-center justify-center backdrop-blur-md transition-all z-20 shadow-xl opacity-80 hover:opacity-100"
                aria-label="Previous Slide"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              </button>

              <button
                onClick={() => setActiveEventIndex((prev) => (prev === featuredEvents.length - 1 ? 0 : prev + 1))}
                className="hidden md:flex absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800/90 hover:bg-orange-500 border border-white/20 text-white items-center justify-center backdrop-blur-md transition-all z-20 shadow-xl opacity-80 hover:opacity-100"
                aria-label="Next Slide"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
              </button>

              {/* Bottom Pagination Indicators */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 z-20 flex items-center gap-1.5 sm:gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/15 shadow-md">
                {/* Mobile Previous Button */}
                <button
                  onClick={() => setActiveEventIndex((prev) => (prev === 0 ? featuredEvents.length - 1 : prev - 1))}
                  className="w-4 h-4 text-slate-300 hover:text-white flex items-center justify-center transition-colors md:hidden"
                  aria-label="Previous Slide"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                {featuredEvents.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveEventIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeEventIndex === idx
                        ? 'w-5 sm:w-6 bg-orange-500'
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}

                {/* Mobile Next Button */}
                <button
                  onClick={() => setActiveEventIndex((prev) => (prev === featuredEvents.length - 1 ? 0 : prev + 1))}
                  className="w-4 h-4 text-slate-300 hover:text-white flex items-center justify-center transition-colors md:hidden"
                  aria-label="Next Slide"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 3. Trusted By / Client Logos - Infinite Smooth Marquee */}
      <section className="bg-slate-50 py-8 sm:py-12 border-y border-slate-200/90 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes clientMarqueeScroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-client-marquee {
            animation: clientMarqueeScroll 28s linear infinite;
          }
          .animate-client-marquee:hover {
            animation-play-state: paused;
          }
        `}} />

        {/* Ambient Left & Right Gradient Blur Overlays */}
        <div className="absolute inset-y-0 left-0 w-12 sm:w-28 md:w-44 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 sm:w-28 md:w-44 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8 text-center">
          <p className="text-sm sm:text-base md:text-lg font-bold text-slate-700 tracking-wider uppercase">
            TRUSTED BY{' '}
            <span className="text-orange-500 font-extrabold">
              INDUSTRY LEADERS
            </span>{' '}
            IN{' '}
            <span className="text-emerald-600 font-extrabold">
              JAMSHEDPUR
            </span>{' '}
            & BEYOND
          </p>
        </div>

        {/* Continuous Marquee Track */}
        <div className="relative w-full overflow-hidden flex py-1 sm:py-2">
          <div className="flex w-max animate-client-marquee py-1 items-center">
            {/* Set 1 */}
            <div className="flex items-center space-x-4 sm:space-x-6 px-2 sm:px-3">
              {clientLogos.map((client, idx) => (
                <div
                  key={`c1-${idx}`}
                  className="w-48 sm:w-56 md:w-60 h-20 sm:h-24 flex items-center justify-center p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-orange-300 hover:scale-105 transition-all duration-300 shrink-0 group cursor-pointer"
                >
                  <img
                    src={client.img}
                    alt={client.name}
                    className={`${client.imgClass || 'h-9 sm:h-11 max-w-[75%]'} w-auto object-contain filter contrast-[1.05] transition-all duration-300 group-hover:scale-105`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Set 2 (Duplicate for infinite seamless loop) */}
            <div className="flex items-center space-x-4 sm:space-x-6 px-2 sm:px-3">
              {clientLogos.map((client, idx) => (
                <div
                  key={`c2-${idx}`}
                  className="w-48 sm:w-56 md:w-60 h-20 sm:h-24 flex items-center justify-center p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-orange-300 hover:scale-105 transition-all duration-300 shrink-0 group cursor-pointer"
                >
                  <img
                    src={client.img}
                    alt={client.name}
                    className={`${client.imgClass || 'h-9 sm:h-11 max-w-[75%]'} w-auto object-contain filter contrast-[1.05] transition-all duration-300 group-hover:scale-105`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Section */}
      <section className="bg-slate-50 py-6 sm:py-12 md:py-18">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-4 sm:mb-8">
            <h4 className="text-slate-400 font-semibold tracking-widest text-[10px] sm:text-xs md:text-sm uppercase mb-1">SERVICE <span className="inline-block w-8 sm:w-12 h-[2px] bg-orange-400 ml-2 align-middle"></span></h4>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-800">THE SERVICES WE OFFER</h2>
          </div>

          {/* 2-Column Mobile Grid: Stops edge-to-edge stretching and cuts scroll height by 60% */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8 mb-6 sm:mb-10">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.path}
                className="rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group relative h-36 sm:h-56 md:h-64 lg:h-72 block border border-slate-200/80"
              >
                {/* Background Image */}
                <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                {/* Always-on bottom dark gradient for title readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-95 group-hover:from-black/95 group-hover:via-black/75"></div>

                {/* Content Container */}
                <div className="absolute inset-0 p-2.5 sm:p-5 md:p-6 flex flex-col justify-end z-10">
                  <h3 className="text-xs sm:text-lg md:text-xl font-bold text-white mb-0.5 sm:mb-2 tracking-wide leading-tight line-clamp-2">{service.title}</h3>

                  {/* Hidden content on mobile, slides up on desktop hover */}
                  <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <p className="text-slate-200 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 leading-relaxed">
                      {service.desc}
                    </p>
                    <span className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1 sm:px-5 sm:py-2 rounded text-xs shadow-lg transition-colors">
                      Read More
                    </span>
                  </div>

                  {/* Mobile mini action badge */}
                  <div className="sm:hidden flex items-center gap-1 text-[10px] text-orange-300 font-semibold mt-0.5">
                    <span>Explore</span>
                    <svg className="w-2.5 h-2.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/services" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-8 py-2 sm:py-3 rounded-md font-semibold text-xs sm:text-sm shadow-md transition-colors">
              View More
            </Link>
          </div>
        </div>
      </section>

      {/* 4.5 Software Development Process Timeline */}
      <section className="bg-[#0F172A] py-8 sm:py-10 md:py-12 relative overflow-hidden border-t border-slate-800">
        {/* Ambient Subtle Backlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-gradient-to-r from-orange-500/10 via-cyan-500/10 to-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-3 sm:mb-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 sm:mb-2">
              Our Proven <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Software Development Process</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
              See how we collaborate with new clients and manage projects seamlessly from inception to completion.
            </p>
          </div>

          {/* MOBILE VIEW: Vertical (Y-Axis) Stepper / Timeline (screens < md) */}
          <div className="md:hidden relative space-y-2.5 max-w-md mx-auto py-1">
            {/* Glowing Y-Axis Line */}
            <div className="absolute top-5 bottom-5 left-[17px] w-0.5 bg-gradient-to-b from-orange-500 via-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.7)] z-0" />

            {processSteps.map((step, index) => (
              <div key={index} className="relative z-10 flex items-start gap-2.5">
                {/* Node on the Y-Axis Line */}
                <div className="w-9 h-9 rounded-xl bg-[#0F172A] border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)] flex flex-col items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[8px] text-orange-400 font-extrabold uppercase leading-none">STEP</span>
                  <span className="text-xs font-black text-cyan-300 leading-tight">0{index + 1}</span>
                </div>

                {/* Step Card with Image, Title and Description */}
                <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-2.5 rounded-xl shadow-xl hover:border-orange-500/40 transition-all">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <img 
                      src={step.img} 
                      alt={step.title} 
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700 shadow-md shrink-0" 
                    />
                    <div className="min-w-0">
                      <h4 className="text-orange-400 font-bold text-xs sm:text-sm leading-snug truncate">{step.title}</h4>
                      <span className="text-[9px] text-cyan-300 font-semibold tracking-wide">Phase {index + 1} of 6</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-normal font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Horizontal Scrolling Timeline (screens >= md) */}
          <div 
            className="hidden md:block relative mt-3 sm:mt-5"
            onMouseEnter={() => setIsTimelineHovered(true)}
            onMouseLeave={() => {
              setIsTimelineHovered(false);
              handleTimelineMouseUpOrLeave();
            }}
          >
            {/* Left Edge Dark Gradient Fade */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#0F172A] to-transparent z-20 pointer-events-none" />
            {/* Right Edge Dark Gradient Fade */}
            <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#0F172A] to-transparent z-20 pointer-events-none" />

            {/* Left/Right Smooth Navigation Buttons */}
            <button 
              onClick={() => scrollTimeline('left')} 
              aria-label="Previous step"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/85 hover:bg-orange-500 text-white border border-cyan-400/40 hover:border-orange-400 shadow-[0_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center z-30 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button 
              onClick={() => scrollTimeline('right')} 
              aria-label="Next step"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/85 hover:bg-orange-500 text-white border border-cyan-400/40 hover:border-orange-400 shadow-[0_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center z-30 transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Timeline Scroll Container */}
            <div 
              ref={timelineRef}
              onMouseDown={handleTimelineMouseDown}
              onMouseMove={handleTimelineMouseMove}
              onMouseUp={handleTimelineMouseUpOrLeave}
              className="flex overflow-x-auto gap-4 sm:gap-6 py-2 px-10 sm:px-14 scroll-smooth cursor-grab active:cursor-grabbing select-none" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style dangerouslySetInnerHTML={{
                __html: `
                div::-webkit-scrollbar { display: none; }
              `}} />

              {/* Glowing Line behind everything */}
              <div className="absolute top-1/2 left-0 w-[3000px] h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 -translate-y-1/2 opacity-30 pointer-events-none"></div>

              {processSteps.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div 
                    key={index} 
                    data-step-card
                    className="flex-none w-[260px] sm:w-[310px] md:w-[350px] flex flex-col justify-center relative"
                  >
                    {/* Glowing Node on the line */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-5 h-5 sm:w-5.5 sm:h-5.5 bg-[#0F172A] rounded-full border-2 sm:border-3 border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)]"></div>

                    {/* Top Content */}
                    <div className="h-[105px] sm:h-[135px] md:h-[155px] flex items-end justify-center pb-3 sm:pb-4 md:pb-5">
                      {isEven ? (
                        <img 
                          src={step.img} 
                          alt={step.title} 
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-full border-2 sm:border-3 border-cyan-500/50 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105" 
                          draggable="false"
                        />
                      ) : (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-orange-400/50 p-3 sm:p-3.5 md:p-4 rounded-xl shadow-xl w-full transform transition-all duration-300 hover:-translate-y-1">
                          <h4 className="text-orange-400 font-bold mb-1 text-xs sm:text-sm md:text-[15px]">{step.step} :- {step.title}</h4>
                          <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed line-clamp-3 font-light">{step.desc}</p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Content */}
                    <div className="h-[105px] sm:h-[135px] md:h-[155px] flex items-start justify-center pt-3 sm:pt-4 md:pt-5">
                      {isEven ? (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-orange-400/50 p-3 sm:p-3.5 md:p-4 rounded-xl shadow-xl w-full transform transition-all duration-300 hover:translate-y-1">
                          <h4 className="text-orange-400 font-bold mb-1 text-xs sm:text-sm md:text-[15px]">{step.step} :- {step.title}</h4>
                          <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed line-clamp-3 font-light">{step.desc}</p>
                        </div>
                      ) : (
                        <img 
                          src={step.img} 
                          alt={step.title} 
                          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-full border-2 sm:border-3 border-cyan-500/50 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105" 
                          draggable="false"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4.8 Technologies We Use (Dual Infinite Marquee) */}
      <section className="py-8 sm:py-16 md:py-20 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-6 sm:mb-12">
          <h4 className="text-orange-500 font-semibold tracking-widest text-[11px] sm:text-xs md:text-sm uppercase mb-1 sm:mb-2">
            Tech Stack
          </h4>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-800">
            Technologies We Use
          </h2>
          <div className="w-12 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 to-green-500 mx-auto mt-2 sm:mt-4 rounded-full"></div>
        </div>

        {/* Marquee Container with Dual Rows */}
        <div className="relative w-full overflow-hidden flex flex-col gap-2.5 sm:gap-6 group/marquee">

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes marquee-left {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marquee-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0%); }
            }
            .animate-marquee-left {
              animation: marquee-left 35s linear infinite;
            }
            .animate-marquee-right {
              animation: marquee-right 35s linear infinite;
            }
            .animate-marquee-left:hover,
            .animate-marquee-right:hover {
              animation-play-state: paused;
            }
          `}} />

          {/* Left & Right Fading Gradient Overlays */}
          <div className="absolute inset-y-0 left-0 w-10 sm:w-32 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-10 sm:w-32 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* Row 1: Leftward Infinite Marquee */}
          <div className="relative w-full overflow-hidden flex py-2 sm:py-4">
            <div className="flex w-max animate-marquee-left py-1 sm:py-2">
              {/* Set 1 */}
              <div className="flex space-x-6 sm:space-x-12 md:space-x-16 px-3 sm:px-8 items-center">
                {techRow1.map((tech, index) => (
                  <div
                    key={`r1-${index}`}
                    className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 p-1 sm:p-2 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 cursor-pointer min-w-[55px] sm:min-w-[80px] md:min-w-[95px] select-none"
                  >
                    <img
                      src={tech.img}
                      alt={tech.name}
                      className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 drop-shadow-sm"
                      loading="lazy"
                    />
                    <span className="text-[11px] sm:text-xs md:text-sm font-medium text-slate-700 whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
              {/* Set 2 (Duplicate for infinite seamless loop) */}
              <div className="flex space-x-6 sm:space-x-12 md:space-x-16 px-3 sm:px-8 items-center">
                {techRow1.map((tech, index) => (
                  <div
                    key={`r1-dup-${index}`}
                    className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 p-1 sm:p-2 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 cursor-pointer min-w-[55px] sm:min-w-[80px] md:min-w-[95px] select-none"
                  >
                    <img
                      src={tech.img}
                      alt={tech.name}
                      className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 drop-shadow-sm"
                      loading="lazy"
                    />
                    <span className="text-[11px] sm:text-xs md:text-sm font-medium text-slate-700 whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Rightward (Reverse) Infinite Marquee */}
          <div className="relative w-full overflow-hidden flex py-2 sm:py-4">
            <div className="flex w-max animate-marquee-right py-1 sm:py-2">
              {/* Set 1 */}
              <div className="flex space-x-6 sm:space-x-12 md:space-x-16 px-3 sm:px-8 items-center">
                {techRow2.map((tech, index) => (
                  <div
                    key={`r2-${index}`}
                    className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 p-1 sm:p-2 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 cursor-pointer min-w-[55px] sm:min-w-[80px] md:min-w-[95px] select-none"
                  >
                    <img
                      src={tech.img}
                      alt={tech.name}
                      className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 drop-shadow-sm"
                      loading="lazy"
                    />
                    <span className="text-[11px] sm:text-xs md:text-sm font-medium text-slate-700 whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
              {/* Set 2 (Duplicate for infinite seamless loop) */}
              <div className="flex space-x-6 sm:space-x-12 md:space-x-16 px-3 sm:px-8 items-center">
                {techRow2.map((tech, index) => (
                  <div
                    key={`r2-dup-${index}`}
                    className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 p-1 sm:p-2 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 cursor-pointer min-w-[55px] sm:min-w-[80px] md:min-w-[95px] select-none"
                  >
                    <img
                      src={tech.img}
                      alt={tech.name}
                      className="h-8 w-8 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 drop-shadow-sm"
                      loading="lazy"
                    />
                    <span className="text-[11px] sm:text-xs md:text-sm font-medium text-slate-700 whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Statistics Section - Modern Tech Bento KPI Cards */}
      <section className="relative py-10 sm:py-14 md:py-18 bg-gradient-to-b from-slate-100/80 via-slate-50 to-slate-100/80 border-y border-slate-200/90 overflow-hidden">
        {/* Soft Ambient Liquid Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Professional Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Driven by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600">Excellence & Trust</span>
            </h2>
            <div className="w-14 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 to-emerald-500 mx-auto mt-3 rounded-full"></div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto font-light mt-2.5 leading-relaxed">
              Real metrics from years of production enterprise delivery, client satisfaction, and active community trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <StatCounter 
                key={index} 
                endValue={stat.number} 
                label={stat.label}
                subtext={stat.subtext}
                badge={stat.badge}
                iconType={stat.iconType}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. MoU Announcements */}
      <section className="py-8 sm:py-14 md:py-20 bg-slate-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-6 sm:mb-12 md:mb-16">
            <h4 className="text-orange-500 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-1 sm:mb-3">Partnerships</h4>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-800">MoU Announcements</h2>
            <div className="w-14 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 to-green-500 mx-auto mt-2 sm:mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-none mx-auto">
            {mous.map((mou, index) => (
              <div key={index} className="group bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl">
                {/* Landscape Image Section */}
                <div className="w-full aspect-[16/10] sm:aspect-video relative overflow-hidden bg-slate-100 max-h-48 sm:max-h-56">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={mou.img} alt={mou.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                  {/* Floating Date Badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 bg-white/95 backdrop-blur-sm border border-white/20 text-slate-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-lg shadow flex items-center gap-1 sm:gap-2">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {mou.date}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6 md:p-7 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base md:text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-snug min-h-[2.5rem] sm:min-h-[3.25rem] line-clamp-2">{mou.name}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 text-justify line-clamp-5 sm:line-clamp-6">
                      {mou.customText || (
                        <>We are proud to announce that we have signed an <strong>MoU</strong> with <strong>{mou.name.split(',')[0]}</strong> on <strong>{mou.date}</strong>, to {mou.desc}</>
                      )}
                    </p>
                  </div>

                  <div>
                    <span className="inline-flex items-center text-xs sm:text-sm font-semibold text-orange-500 group-hover:text-orange-600 transition-colors cursor-pointer">
                      Read Full Details
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 7. Testimonials Section (Dynamic & Full-Width Scrollable) */}
      <section className="py-8 sm:py-16 md:py-24 bg-white border-t border-slate-100 overflow-hidden relative">
        <div className="w-full relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center sm:text-left mb-6 sm:mb-10 md:mb-12">
            <h4 className="text-orange-500 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-1 sm:mb-2">Testimonials</h4>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-800">What Our Clients Say</h2>
            <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-gradient-to-r from-orange-500 to-green-500 mt-2 sm:mt-3 rounded-full mx-auto sm:mx-0"></div>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-slate-500">
              <p className="text-xs sm:text-sm">No testimonials available yet.</p>
            </div>
          ) : (
            <div className="relative w-full overflow-hidden group/testimonials">
              {/* Left & Right White Gradient Fade Masks for ultra-smooth edge blending */}
              <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-36 md:w-60 bg-gradient-to-r from-white via-white/95 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-36 md:w-60 bg-gradient-to-l from-white via-white/95 to-transparent z-20 pointer-events-none"></div>

              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes testimonial-marquee {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }
                .animate-testimonial-marquee {
                  display: flex;
                  width: max-content;
                  animation: testimonial-marquee 45s linear infinite;
                }
                .animate-testimonial-marquee:hover {
                  animation-play-state: paused;
                }
              `}} />

              {/* Infinite Smooth Marquee Track */}
              <div className="flex w-max animate-testimonial-marquee py-3">
                {/* Set 1 */}
                <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6 items-stretch">
                  {marqueeTestimonials.map((testimonial) => (
                    <div 
                      key={`t1-${testimonial._uniqueKey}`} 
                      className="w-[270px] sm:w-[320px] md:w-[360px] flex-shrink-0 bg-slate-50 p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col justify-between select-none"
                    >
                      {/* Quote Icon */}
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-200 transition-colors duration-300 hover:text-orange-100 pointer-events-none">
                        <svg className="w-10 h-10 sm:w-14 sm:h-14" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                        </svg>
                      </div>

                      <div>
                        {/* Star Rating */}
                        <div className="flex gap-1 mb-3 sm:mb-4 relative z-10">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm ${i < testimonial.rating ? 'text-orange-400 fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>

                        {/* Review Text */}
                        <p className="text-slate-600 italic text-xs sm:text-sm md:text-base mb-4 sm:mb-6 leading-relaxed font-light line-clamp-4 sm:line-clamp-5">
                          "{testimonial.review}"
                        </p>
                      </div>

                      {/* Client Info */}
                      <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-slate-200/60 relative z-10 mt-auto">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                          <span className="text-slate-500 font-bold text-base sm:text-lg">{testimonial.clientName?.charAt(0) || 'C'}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">{testimonial.clientName}</h4>
                          <p className="text-blue-600 text-xs sm:text-sm font-medium truncate">{testimonial.clientRole}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Set 2 (Exact duplicate for seamless infinite loop) */}
                <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6 items-stretch" aria-hidden="true">
                  {marqueeTestimonials.map((testimonial) => (
                    <div 
                      key={`t2-${testimonial._uniqueKey}`} 
                      className="w-[270px] sm:w-[320px] md:w-[360px] flex-shrink-0 bg-slate-50 p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col justify-between select-none"
                    >
                      {/* Quote Icon */}
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-200 transition-colors duration-300 hover:text-orange-100 pointer-events-none">
                        <svg className="w-10 h-10 sm:w-14 sm:h-14" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                        </svg>
                      </div>

                      <div>
                        {/* Star Rating */}
                        <div className="flex gap-1 mb-3 sm:mb-4 relative z-10">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm ${i < testimonial.rating ? 'text-orange-400 fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>

                        {/* Review Text */}
                        <p className="text-slate-600 italic text-xs sm:text-sm md:text-base mb-4 sm:mb-6 leading-relaxed font-light line-clamp-4 sm:line-clamp-5">
                          "{testimonial.review}"
                        </p>
                      </div>

                      {/* Client Info */}
                      <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-slate-200/60 relative z-10 mt-auto">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                          <span className="text-slate-500 font-bold text-base sm:text-lg">{testimonial.clientName?.charAt(0) || 'C'}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">{testimonial.clientName}</h4>
                          <p className="text-blue-600 text-xs sm:text-sm font-medium truncate">{testimonial.clientRole}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. Interactive Internship Apply Modal (Portal) */}
      {isApplyModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseApplyModal}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-6 sm:py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-300 shadow-md">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Application & Payment Successful!
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mt-1">
                    Thank you, <strong className="text-slate-900">{candidateName}</strong>! Your application and registration fee of <strong className="text-orange-600 font-bold">₹1,000</strong> for <strong className="text-slate-900">{domain} ({internshipMode} Mode)</strong> have been confirmed.
                  </p>
                </div>

                {lastPaymentInfo && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-1.5 shadow-sm">
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">Transaction ID:</span>
                      <span className="font-mono font-bold text-slate-900">{lastPaymentInfo.paymentId}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">Amount Paid:</span>
                      <span className="font-bold text-emerald-600">₹{lastPaymentInfo.amount} INR</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">Payment Mode:</span>
                      <span className="font-bold text-slate-700">{lastPaymentInfo.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-500 font-medium">Payment Status:</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600"><CheckCircle className="w-3.5 h-3.5" /> Verified & Paid</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCloseApplyModal}
                  className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
                >
                  Done & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-left">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    <span>Direct Fast-Track Admissions</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Apply for Industrial Internship
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Fill out your basic details. PSS Tech Leads will review your submission.
                  </p>
                </div>

                {/* REGISTRATION AMOUNT CARD */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-50 border border-orange-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-orange-600 tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-orange-500" /> Registration Fee
                    </div>
                    <div className="text-2xl font-black text-slate-900 mt-0.5 flex items-baseline gap-1">
                      ₹1,000 <span className="text-xs font-semibold text-slate-500">INR</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-600 font-bold leading-tight space-y-0.5">
                    <div className="text-emerald-700 flex items-center justify-end gap-1"><CheckCircle className="w-3 h-3 text-emerald-600" /> Seat Reservation</div>
                    <div className="text-slate-500 font-medium">Project Training & Offer Letter</div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                {/* INTERNSHIP MODE SELECTOR (Offline vs Online) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Internship Mode *</span>
                    <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Select Preferred Track</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setInternshipMode('Offline')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-start gap-2.5 ${
                        internshipMode === 'Offline'
                          ? 'border-orange-500 bg-orange-50/70 text-slate-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${internshipMode === 'Offline' ? 'border-orange-500' : 'border-slate-300'}`}>
                        {internshipMode === 'Offline' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-orange-600" />
                          <span>Offline</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">In-Office / Lab, Jsr</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInternshipMode('Online')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-start gap-2.5 ${
                        internshipMode === 'Online'
                          ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${internshipMode === 'Online' ? 'border-emerald-500' : 'border-slate-300'}`}>
                        {internshipMode === 'Online' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Online</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">100% Virtual Remote</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Candidate Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@gmail.com"
                      value={candidateEmail}
                      onChange={e => setCandidateEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={candidatePhone}
                      onChange={e => setCandidatePhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                {/* Domain Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Internship Domain *</span>
                    <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Production Verified</span>
                  </label>
                  <select
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-bold text-slate-800"
                  >
                    {PRESET_DOMAINS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Duration & Joining Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration *</label>
                    <select
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                    >
                      <option value="1">1 Month</option>
                      <option value="2">2 Months</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expected Joining Date *</label>
                    <input
                      type="date"
                      required
                      value={joiningDate}
                      onChange={e => setJoiningDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                {/* College & Degree */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                    <input
                      type="text"
                      placeholder="e.g. NSU / Arka Jain / NIT"
                      value={collegeName}
                      onChange={e => setCollegeName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Degree & Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech CSE / BCA / MCA"
                      value={degreeBranch}
                      onChange={e => setDegreeBranch(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year / Batch</label>
                  <select
                    value={passingYear}
                    onChange={e => setPassingYear(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Upload Resume (PDF / DOC) *</span>
                    <span className="text-[10px] text-orange-600 font-semibold uppercase tracking-wider">Mandatory</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="home-intern-resume-input"
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
                      htmlFor="home-intern-resume-input"
                      className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                        resumeFile
                          ? 'border-emerald-400 bg-emerald-50/50'
                          : 'border-slate-200 hover:border-orange-400 bg-slate-50'
                      }`}
                    >
                      {resumeFile ? (
                        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
                          <FileText className="w-5 h-5 text-emerald-600" />
                          <span className="truncate max-w-[280px]">{resumeFile.name}</span>
                          <span className="text-[10px] text-emerald-600">({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <span className="text-xs font-bold text-slate-700">Click to attach resume</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">PDF or Word document up to 10MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub / Portfolio or Short Note (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Provide your GitHub URL, notable projects, or questions..."
                    value={coverNote}
                    onChange={e => setCoverNote(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                {/* PAY BUTTON */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseApplyModal}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 flex items-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{submitting ? 'Processing Payment...' : 'Pay ₹1,000 & Submit Application'}</span>
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

export default Home;
