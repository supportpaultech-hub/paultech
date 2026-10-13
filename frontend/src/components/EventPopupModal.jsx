import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiX, FiVideo, FiCalendar, FiClock, FiZap, FiArrowRight } from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';

const EventPopupModal = () => {
  const [popupEvent, setPopupEvent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchPopupEvent();
  }, []);

  const isPopupValid = (ev) => {
    if (!ev || !ev.isPopup || ev.status === 'Completed') return false;

    const now = new Date();

    // Check Duration Expiry
    if (ev.popupDurationType === 'until_date' && ev.popupEndDate) {
      const expiry = new Date(ev.popupEndDate);
      if (now > expiry) return false;
    } else if (ev.popupDurationType === 'until_event' && ev.date) {
      const eventDate = new Date(ev.date + 'T23:59:59');
      if (now > eventDate) return false;
    }

    return true;
  };

  const fetchPopupEvent = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      if (res.data && res.data.length > 0) {
        // Find an explicit event marked as popup that passes duration validity
        const activePopup = res.data.find(ev => ev.isPopup === true && isPopupValid(ev));
        if (activePopup) {
          checkAndShow(activePopup);
        }
      }
    } catch (err) {
      console.error('Failed to load popup event', err);
    }
  };

  const checkAndShow = (eventItem) => {
    const freq = eventItem.popupFrequency || 'session';

    if (freq === 'session') {
      const isDismissed = sessionStorage.getItem(`event_popup_dismissed_${eventItem._id}`);
      if (isDismissed) return;
    } else if (freq === 'once_daily') {
      const lastShownDate = localStorage.getItem(`event_popup_daily_${eventItem._id}`);
      const todayStr = new Date().toDateString();
      if (lastShownDate === todayStr) return;
    }
    // freq === 'always' -> Always show on every page visit

    setPopupEvent(eventItem);
    // Slight delay for smooth entrance after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  };

  const handleClose = () => {
    if (popupEvent) {
      const freq = popupEvent.popupFrequency || 'session';
      if (freq === 'session') {
        sessionStorage.setItem(`event_popup_dismissed_${popupEvent._id}`, 'true');
      } else if (freq === 'once_daily') {
        localStorage.setItem(`event_popup_daily_${popupEvent._id}`, new Date().toDateString());
      }
    }
    setIsVisible(false);
  };

  if (!popupEvent || !isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative bg-slate-900 border border-white/20 rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_80px_rgba(249,115,22,0.25)] text-slate-100 max-h-[92vh] overflow-y-auto"
        >
          {/* Top Close Button (X) */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-slate-950/80 hover:bg-orange-500 hover:text-white text-slate-300 transition-all border border-white/15 shadow-lg active:scale-95"
            aria-label="Close Announcement"
          >
            <FiX size={18} />
          </button>

          {/* Banner Image Header */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img 
              src={popupEvent.bannerImage} 
              alt={popupEvent.title}
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                <FiZap /> NEW LIVE EVENT
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-950/80 text-orange-400 text-[10px] font-extrabold uppercase border border-orange-500/40 backdrop-blur-md">
                {popupEvent.eventType}
              </span>
            </div>
          </div>

          {/* Body Info */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug drop-shadow-md">
                {popupEvent.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mt-2 line-clamp-2">
                {popupEvent.description}
              </p>
            </div>

            {/* Event Time & Host Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <FiCalendar className="text-orange-400" />
                <span>{popupEvent.date}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <FiClock className="text-green-400" />
                <span>{popupEvent.time}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center gap-3">
              <Link
                to="/events"
                onClick={handleClose}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Register & View Event</span>
                <FiArrowRight />
              </Link>

              <button
                onClick={handleClose}
                className="px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventPopupModal;
