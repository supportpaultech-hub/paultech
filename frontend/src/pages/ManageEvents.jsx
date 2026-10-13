import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiPlus, FiEdit2, FiTrash2, FiVideo, FiCalendar, 
  FiClock, FiUsers, FiDollarSign, FiX, FiCheck, 
  FiExternalLink, FiSearch, FiEye, FiDownload,
  FiBell, FiToggleLeft, FiToggleRight, FiSliders, FiZap, FiAlertCircle
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Attendees Modal
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    eventType: 'Webinar',
    date: '',
    time: '',
    duration: '2 Hours',
    priceType: 'Free',
    price: 0,
    platform: 'Google Meet',
    meetingLink: '',
    bannerImage: '',
    totalSeats: 100,
    isPopup: false,
    popupDurationType: 'always',
    popupEndDate: '',
    popupFrequency: 'session'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      instructor: '',
      eventType: 'Webinar',
      date: new Date().toISOString().split('T')[0],
      time: '07:00 PM IST',
      duration: '2 Hours',
      priceType: 'Free',
      price: 0,
      platform: 'Google Meet',
      meetingLink: '',
      bannerImage: '',
      totalSeats: 100,
      isPopup: false,
      popupDurationType: 'always',
      popupEndDate: '',
      popupFrequency: 'session'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      instructor: event.instructor || '',
      eventType: event.eventType || 'Webinar',
      date: event.date || '',
      time: event.time || '',
      duration: event.duration || '2 Hours',
      priceType: event.priceType || 'Free',
      price: event.price || 0,
      platform: event.platform || 'Google Meet',
      meetingLink: event.meetingLink || '',
      bannerImage: event.bannerImage || '',
      totalSeats: event.totalSeats || 100,
      isPopup: event.isPopup || false,
      popupDurationType: event.popupDurationType || 'always',
      popupEndDate: event.popupEndDate || '',
      popupFrequency: event.popupFrequency || 'session'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await axios.put(`${API_BASE_URL}/api/events/${editingEvent._id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/events`, formData);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error('Failed to save event', err);
      alert('Error saving event: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleTogglePopup = async (eventItem) => {
    const newStatus = !eventItem.isPopup;
    try {
      await axios.put(`${API_BASE_URL}/api/events/${eventItem._id}`, {
        ...eventItem,
        isPopup: newStatus
      });
      fetchEvents();
    } catch (err) {
      console.error('Failed to toggle popup status', err);
      alert('Error updating popup status: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  const fetchAttendees = async (event) => {
    setSelectedEventForAttendees(event);
    try {
      setLoadingAttendees(true);
      const res = await axios.get(`${API_BASE_URL}/api/events/${event._id}/registrations`);
      setAttendees(res.data || []);
    } catch (err) {
      console.error('Failed to fetch attendees', err);
      setAttendees([]);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const activePopupEvent = events.find(e => e.isPopup === true);

  return (
    <div className="animate-fade-in space-y-6 pb-12 font-sans">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiVideo className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0" />
            Manage Events & Webinars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Host live Webinars, Bootcamps, and manage attendee registrations & site-wide popups</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-xs sm:text-sm shrink-0"
        >
          <FiPlus className="w-5 h-5" />
          <span>Host New Event</span>
        </button>
      </div>

      {/* Active Popup Control Banner Widget */}
      {activePopupEvent ? (
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-white p-4 sm:p-5 rounded-2xl border border-orange-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500 text-white shrink-0 mt-0.5 shadow-md shadow-orange-500/30">
              <FiBell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider">
                  ACTIVE SITE-WIDE POPUP
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {activePopupEvent.popupDurationType === 'until_date' && activePopupEvent.popupEndDate
                    ? `Ends: ${new Date(activePopupEvent.popupEndDate).toLocaleString()}`
                    : activePopupEvent.popupDurationType === 'until_event'
                    ? `Expires on Event Date (${activePopupEvent.date})`
                    : 'Always Active'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-1">{activePopupEvent.title}</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Frequency: <span className="font-semibold text-orange-600 uppercase">{activePopupEvent.popupFrequency === 'always' ? 'On Every Page Visit' : activePopupEvent.popupFrequency === 'once_daily' ? 'Once Per Day' : 'Once Per Session'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => handleOpenEditModal(activePopupEvent)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all"
            >
              Edit Config
            </button>
            <button
              onClick={() => handleTogglePopup(activePopupEvent)}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-all flex items-center gap-1.5"
            >
              <FiToggleRight size={16} />
              <span>Turn OFF Popup</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="text-slate-400 w-4 h-4" />
            <span>No active site-wide popup set right now. Toggle ON the popup switch on any event below to activate it for website visitors.</span>
          </div>
        </div>
      )}

      {/* Events List / Grid */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-slate-400 font-medium">
          Loading Events...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
          <FiVideo className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Events Created Yet</h3>
          <p className="text-sm text-slate-500 mt-1 mb-5">Click below to create your first Webinar or Bootcamp.</p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02]"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add First Event</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event._id}
              className={`bg-white rounded-2xl border ${
                event.isPopup ? 'border-orange-400 ring-2 ring-orange-500/10' : 'border-slate-200/80'
              } p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-orange-500/40`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-extrabold uppercase">
                      {event.eventType}
                    </span>
                    {event.isPopup && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[9px] font-bold uppercase flex items-center gap-1">
                        <FiBell className="w-3 h-3 text-orange-600 animate-pulse" /> POPUP ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-orange-600">
                    {event.priceType === 'Free' ? 'FREE' : `₹${event.price}`}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">{event.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-normal">{event.description}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500"><FiCalendar className="text-slate-400" /> Date:</span>
                  <span className="font-semibold text-slate-800">{event.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500"><FiClock className="text-slate-400" /> Time:</span>
                  <span className="font-semibold text-slate-800">{event.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500"><FiUsers className="text-slate-400" /> Registered:</span>
                  <span className="font-bold text-emerald-600">{event.registeredCount || 0} / {event.totalSeats}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500"><FiVideo className="text-slate-400" /> Platform:</span>
                  <span className="font-semibold text-sky-600 truncate max-w-[140px]">{event.platform}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                {/* Quick Popup Switch Button */}
                <button
                  onClick={() => handleTogglePopup(event)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    event.isPopup 
                      ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' 
                      : 'bg-slate-100 text-slate-600 border-slate-200/60 hover:bg-slate-200'
                  }`}
                  title={event.isPopup ? "Click to Turn Off Popup" : "Click to Turn On Site-Wide Popup"}
                >
                  {event.isPopup ? <FiToggleRight className="w-4 h-4 text-orange-600" /> : <FiToggleLeft className="w-4 h-4 text-slate-400" />}
                  <span>{event.isPopup ? 'Popup ON' : 'Popup OFF'}</span>
                </button>

                <button
                  onClick={() => fetchAttendees(event)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1 border border-slate-200/60"
                >
                  <FiEye className="text-orange-500" /> Attendees
                </button>
                <button
                  onClick={() => handleOpenEditModal(event)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 transition-all border border-slate-200/60"
                  title="Edit"
                >
                  <FiEdit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-all border border-slate-200/60"
                  title="Delete"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-900">{editingEvent ? 'Edit Event' : 'Host New Event / Webinar'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Master Full-Stack Development & AI"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details about what topics will be covered..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  >
                    <option value="Webinar">Webinar</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Live Class">Live Class</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Instructor / Host</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    placeholder="Host name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Event Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 07:00 PM IST"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Price Type</label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                {formData.priceType === 'Paid' && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="e.g. 299"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Platform</label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    placeholder="e.g. Google Meet / Zoom"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Meeting Link (Google Meet / Zoom URL) *</label>
                  <input
                    type="text"
                    required
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/xyz-abc-123"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>

              {/* Advanced Site-Wide Popup Controls */}
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiBell className="text-orange-600 w-5 h-5" />
                    <label htmlFor="isPopupCheck" className="text-xs sm:text-sm font-bold text-slate-900 cursor-pointer select-none">
                      Show as Site-Wide Announcement Popup for Website Visitors
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    id="isPopupCheck"
                    checked={formData.isPopup || false}
                    onChange={(e) => setFormData({ ...formData, isPopup: e.target.checked })}
                    className="w-5 h-5 rounded text-orange-600 bg-white border-slate-300 focus:ring-orange-500 cursor-pointer"
                  />
                </div>

                {formData.isPopup && (
                  <div className="pt-3 border-t border-orange-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Popup Active Duration / Schedule</label>
                      <select
                        value={formData.popupDurationType || 'always'}
                        onChange={(e) => setFormData({ ...formData, popupDurationType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500"
                      >
                        <option value="always">Always Active (Until manually turned off)</option>
                        <option value="until_event">Active Until Event Date</option>
                        <option value="until_date">Active Until Custom End Date & Time</option>
                      </select>
                    </div>

                    {formData.popupDurationType === 'until_date' && (
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Custom Expiry Date & Time</label>
                        <input
                          type="datetime-local"
                          value={formData.popupEndDate || ''}
                          onChange={(e) => setFormData({ ...formData, popupEndDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Visitor Display Frequency</label>
                      <select
                        value={formData.popupFrequency || 'session'}
                        onChange={(e) => setFormData({ ...formData, popupFrequency: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500"
                      >
                        <option value="session">Once per Browser Session (Recommended)</option>
                        <option value="once_daily">Once per Day per User</option>
                        <option value="always">On Every Page Visit / Reload</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all"
                >
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendees Drawer / Modal */}
      {selectedEventForAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">Attendee Registrations</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedEventForAttendees.title}</h3>
              </div>
              <button onClick={() => setSelectedEventForAttendees(null)} className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              {loadingAttendees ? (
                <div className="text-center py-10 text-slate-400">Loading Registrations...</div>
              ) : attendees.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No attendees registered yet for this event.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase bg-slate-50">
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-3">Email</th>
                        <th className="py-3 px-3">Phone</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendees.map((a) => (
                        <tr key={a._id} className="hover:bg-slate-50 text-slate-700">
                          <td className="py-3 px-3 font-bold text-slate-900">{a.name}</td>
                          <td className="py-3 px-3 text-slate-600">{a.email}</td>
                          <td className="py-3 px-3 text-slate-600">{a.phone}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200 text-[11px]">
                              {a.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageEvents;
