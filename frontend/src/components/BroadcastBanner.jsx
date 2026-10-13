import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';

const BroadcastBanner = () => {
  const [broadcast, setBroadcast] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/broadcast`);
        setBroadcast(res.data);
      } catch (err) {
        console.error('Error fetching global broadcast:', err);
      }
    };

    fetchBroadcast();
  }, []);

  if (!broadcast || !broadcast.isActive || dismissed) {
    return null;
  }

  // Priority Styles mapping
  const priorityStyles = {
    orange: {
      bg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-orange-500/20',
      icon: <AlertTriangle className="w-4 h-4 shrink-0 text-white animate-bounce" />,
      badge: 'Reminder / Announcement'
    },
    red: {
      bg: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-red-600/30 animate-pulse',
      icon: <AlertCircle className="w-4 h-4 shrink-0 text-white" />,
      badge: 'Urgent Alert'
    },
    blue: {
      bg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-blue-600/20',
      icon: <Info className="w-4 h-4 shrink-0 text-white" />,
      badge: 'Notice'
    },
    green: {
      bg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-600/20',
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />,
      badge: 'Update'
    }
  };

  const style = priorityStyles[broadcast.priority] || priorityStyles.orange;

  return (
    <div className={`relative z-[60] w-full py-2.5 px-4 ${style.bg} shadow-md transition-all`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2.5 mx-auto">
          {style.icon}
          <span className="font-bold tracking-wide uppercase text-[11px] px-2 py-0.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm hidden sm:inline-block">
            {style.badge}
          </span>
          <span className="leading-snug text-center sm:text-left font-semibold">
            {broadcast.message}
          </span>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors shrink-0"
          title="Dismiss Alert"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default BroadcastBanner;
