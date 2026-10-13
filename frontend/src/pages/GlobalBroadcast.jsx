import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { 
  Eye, 
  Send, 
  Power, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Radio, 
  MessageSquareQuote 
} from 'lucide-react';

const GlobalBroadcast = () => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('orange');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBroadcast();
  }, []);

  const fetchBroadcast = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/broadcast`);
      if (res.data) {
        setMessage(res.data.message || '');
        setPriority(res.data.priority || 'orange');
        setIsActive(Boolean(res.data.isActive));
      }
    } catch (err) {
      console.error('Error fetching broadcast:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`${API_BASE_URL}/api/broadcast`, {
        message,
        priority,
        isActive
      });
      alert('Global Broadcast updated successfully!');
      fetchBroadcast();
    } catch (err) {
      console.error('Error updating broadcast:', err);
      alert('Failed to update broadcast');
    } finally {
      setSaving(false);
    }
  };

  const priorityStyles = {
    orange: {
      label: 'Reminder / Warning (Orange)',
      bg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white',
      icon: <AlertTriangle className="w-4 h-4 shrink-0 text-white animate-bounce" />,
      border: 'border-orange-200'
    },
    red: {
      label: 'Urgent Alert (Red)',
      bg: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white animate-pulse',
      icon: <AlertCircle className="w-4 h-4 shrink-0 text-white" />,
      border: 'border-red-200'
    },
    blue: {
      label: 'Info Announcement (Blue)',
      bg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white',
      icon: <Info className="w-4 h-4 shrink-0 text-white" />,
      border: 'border-blue-200'
    },
    green: {
      label: 'Success Notice (Green)',
      bg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white',
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />,
      border: 'border-emerald-200'
    }
  };

  const currentPreviewStyle = priorityStyles[priority] || priorityStyles.orange;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0 animate-pulse" />
            Global Alert & Broadcast System
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Broadcast critical updates, emergency banners, and announcements to all website visitors instantly.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Loading Broadcast Config...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Edit Announcement */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <MessageSquareQuote className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Edit Announcement</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message Box */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  BROADCAST MESSAGE
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Urgent: Admissions open for 2026 Batch! Contact us today."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Alert Priority Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    ALERT PRIORITY / STYLE
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="orange">Reminder / Warning (Orange)</option>
                    <option value="red">Urgent Alert (Red)</option>
                    <option value="blue">Info Announcement (Blue)</option>
                    <option value="green">Success Notice (Green)</option>
                  </select>
                </div>

                {/* Broadcast Status Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    BROADCAST STATUS
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      isActive 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 shadow-sm' 
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    <Power className={`w-4 h-4 ${isActive ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                    {isActive ? 'ONLINE (ACTIVE)' : 'OFFLINE (DISABLED)'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {saving ? 'Updating Broadcast...' : 'Update Global Broadcast'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-5 bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Eye className="w-5 h-5 text-blue-600" />
              Live Preview
            </div>

            <p className="text-xs text-slate-500 font-medium">
              This is how the notification appears to all website visitors on page refresh:
            </p>

            {/* Live Banner Preview Box */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-center min-h-[140px]">
              <div className={`w-full p-3.5 rounded-xl ${currentPreviewStyle.bg} flex items-center justify-center gap-2.5 text-xs font-semibold shadow-md text-center`}>
                {currentPreviewStyle.icon}
                <span className="line-clamp-2">
                  {message || 'Type message in the form to preview announcement...'}
                </span>
              </div>
            </div>

            {/* Status Footer Indicator */}
            <div className="text-center pt-2">
              {isActive ? (
                <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  ● Broadcast is currently active on top banner.
                </p>
              ) : (
                <p className="text-xs font-semibold text-amber-600 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Broadcast is currently disabled.
                </p>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default GlobalBroadcast;
