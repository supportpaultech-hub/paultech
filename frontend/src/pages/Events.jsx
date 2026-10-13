import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FiVideo, FiCalendar, FiClock, FiUser, FiUsers, 
  FiCheckCircle, FiCopy, FiExternalLink, FiSearch, 
  FiX, FiZap, FiCheck, FiLock
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'
  
  // Registration Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch events from backend', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if event date has passed
  const checkIsPastEvent = (ev) => {
    if (!ev) return false;
    if (ev.status === 'Completed') return true;
    if (!ev.date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(ev.date.includes('T') ? ev.date : `${ev.date}T23:59:59`);
    if (!isNaN(eventDate.getTime())) {
      return today > eventDate;
    }
    return false;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    try {
      setIsSubmitting(true);
      // Call API
      const res = await axios.post(`${API_BASE_URL}/api/events/register`, {
        eventId: selectedEvent._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      setRegistrationSuccess({
        meetingLink: res.data.meetingLink || selectedEvent.meetingLink,
        eventTitle: selectedEvent.title
      });

      // Update local registered count
      setEvents(prev => prev.map(ev => 
        ev._id === selectedEvent._id ? { ...ev, registeredCount: (ev.registeredCount || 0) + 1 } : ev
      ));
    } catch (err) {
      console.error('Registration failed', err);
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const upcomingCount = events.filter(ev => !checkIsPastEvent(ev)).length;
  const pastCount = events.filter(ev => checkIsPastEvent(ev)).length;

  const filteredEvents = events.filter(ev => {
    const isPast = checkIsPastEvent(ev);
    const matchesTab = activeTab === 'past' ? isPast : !isPast;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || ev.eventType === selectedFilter;
    return matchesTab && matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans pb-20">
      
      {/* 1. Hero Header */}
      <section className="bg-slate-950 py-6 sm:py-8 md:py-10 px-4 sm:px-6 text-center text-white border-b border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-emerald-500/15 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 shadow-xs backdrop-blur-md mb-2 sm:mb-2.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">PaulTech Live Academy</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2"
          >
            Live Webinars, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400">Bootcamps</span> & Workshops
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed mb-4 sm:mb-5"
          >
            Upgrade your tech skills with live interactive sessions hosted by PaulTech industry leaders and senior software engineers.
          </motion.p>

          {/* Search & Filter Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl"
          >
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search webinars, bootcamps, instructors..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Webinar', 'Bootcamp', 'Workshop'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedFilter === filter
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Events Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14">
        {/* Main Tab Controls: Upcoming vs Past Events */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Upcoming Events</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'upcoming' ? 'bg-orange-100 text-orange-600' : 'bg-slate-300 text-slate-700'
              }`}>
                {upcomingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'past'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Past Events</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'past' ? 'bg-slate-800 text-amber-400' : 'bg-slate-300 text-slate-700'
              }`}>
                {pastCount}
              </span>
            </button>
          </div>

          <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
            {filteredEvents.length} {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events Shown
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-white border border-slate-200/80 shadow-sm animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <FiVideo className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">
              No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events Found
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {activeTab === 'upcoming' 
                ? 'Check back soon for new live webinars and bootcamps!' 
                : 'There are no past events matching your current filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredEvents.map((event) => {
              const isPast = checkIsPastEvent(event);
              const isFull = (event.registeredCount || 0) >= event.totalSeats;

              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={!isPast ? { y: -4 } : {}}
                  className={`bg-white rounded-2xl sm:rounded-3xl border overflow-hidden shadow-sm transition-all flex flex-col justify-between group ${
                    isPast 
                      ? 'border-slate-300 opacity-90' 
                      : 'border-slate-200/80 hover:shadow-xl hover:border-orange-500/50'
                  }`}
                >
                  {/* Banner Header */}
                  <div className="relative h-44 sm:h-56 overflow-hidden bg-slate-100">
                    <img
                      src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'}
                      alt={event.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isPast ? 'grayscale-[25%]' : 'group-hover:scale-105'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                    {/* Event Type & Price / Past Status Badges */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-2">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 shadow-md">
                        {event.eventType}
                      </span>

                      {isPast && (
                        <span className="px-2.5 sm:px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border border-amber-400/30 shadow-md flex items-center gap-1">
                          <FiLock className="w-3 h-3" /> Event Ended
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      {isPast ? (
                        <span className="px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider bg-slate-700 text-slate-300 shadow-md">
                          CLOSED
                        </span>
                      ) : (
                        <span className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-md ${
                          event.priceType === 'Free' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-orange-600 text-white'
                        }`}>
                          {event.priceType === 'Free' ? 'FREE' : `₹${event.price}`}
                        </span>
                      )}
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug drop-shadow-md">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    {/* Event Meta Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-orange-500 shrink-0" />
                        <span className="text-slate-700">{event.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiClock className="text-emerald-600 shrink-0" />
                        <span className="text-slate-700">{event.time} ({event.duration})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiUser className="text-orange-500 shrink-0" />
                        <span className="truncate text-slate-700">{event.instructor}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiVideo className="text-emerald-600 shrink-0" />
                        <span className="text-slate-700">{event.platform}</span>
                      </div>
                    </div>

                    {/* Seat Progress Bar */}
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                        <span className="flex items-center gap-1">
                          <FiUsers className="text-slate-400" /> Seats Registered
                        </span>
                        <span className="text-slate-900 font-bold">{event.registeredCount || 0} / {event.totalSeats}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isPast 
                              ? 'bg-slate-400' 
                              : 'bg-gradient-to-r from-emerald-500 to-orange-500'
                          }`}
                          style={{ width: `${Math.min(((event.registeredCount || 0) / event.totalSeats) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Register Button */}
                    {isPast ? (
                      <button
                        disabled
                        className="w-full mt-2 sm:mt-4 py-3 sm:py-3.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs sm:text-sm cursor-not-allowed border border-slate-300 flex items-center justify-center gap-2 shadow-xs"
                      >
                        <FiLock className="w-4 h-4 text-slate-400" />
                        <span>Registration Closed (Event Ended)</span>
                      </button>
                    ) : isFull ? (
                      <button
                        disabled
                        className="w-full mt-2 sm:mt-4 py-3 sm:py-3.5 rounded-xl bg-rose-100 text-rose-600 font-bold text-xs sm:text-sm cursor-not-allowed border border-rose-200 flex items-center justify-center gap-2 shadow-xs"
                      >
                        <FiX className="w-4 h-4" />
                        <span>Registration Closed (Seats Full)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setRegistrationSuccess(null);
                          setFormData({ name: '', email: '', phone: '' });
                        }}
                        className="w-full mt-2 sm:mt-4 py-3 sm:py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{event.priceType === 'Free' ? 'Register For Free' : `Reserve Seat (₹${event.price})`}</span>
                        <FiExternalLink />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-900"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600">Event Registration</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-xs sm:max-w-sm mt-0.5">{selectedEvent.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-1.5 sm:p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6">
                {!registrationSuccess ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date & Time:</span>
                        <span className="font-semibold text-slate-900">{selectedEvent.date} | {selectedEvent.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pass Type:</span>
                        <span className="font-bold text-orange-600">{selectedEvent.priceType === 'Free' ? 'FREE PASS' : `PAID PASS (₹${selectedEvent.price})`}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all disabled:opacity-50 mt-2"
                    >
                      {isSubmitting ? 'Processing Registration...' : (selectedEvent.priceType === 'Free' ? 'Confirm Free Registration' : `Proceed to Pay ₹${selectedEvent.price}`)}
                    </button>
                  </form>
                ) : (
                  /* Success View displaying Meeting Link */
                  <div className="text-center space-y-5 py-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                      <FiCheckCircle size={32} />
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Registration Confirmed!</h4>
                      <p className="text-xs text-slate-600 mt-1">You are registered for <span className="text-orange-600 font-semibold">{registrationSuccess.eventTitle}</span></p>
                    </div>

                    {/* Unlocked Meeting Link Box */}
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Your Live Meeting Link</span>
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200">
                        <span className="text-xs font-mono text-slate-800 truncate pr-2">{registrationSuccess.meetingLink}</span>
                        <button
                          onClick={() => copyToClipboard(registrationSuccess.meetingLink)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shrink-0"
                          title="Copy Link"
                        >
                          {copiedLink ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={registrationSuccess.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>Join Live Session</span>
                        <FiExternalLink />
                      </a>

                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Events;
