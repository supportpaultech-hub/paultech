import React, { useState, useEffect } from 'react';
import { FiActivity, FiUser, FiSettings, FiShield } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';

const timeAgo = (dateInput) => {
  const date = new Date(dateInput);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval >= 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval >= 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + " mins ago";
  return Math.floor(seconds) + " seconds ago";
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/activities`);
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching logs', err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiActivity className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0" />
            Activity Logs
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Monitor real-time system events, administrative actions, and security alerts.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 lg:p-8">
        <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
          {logs.length === 0 ? (
            <p className="text-slate-500 py-4">No activities found.</p>
          ) : logs.map((log) => (
            <div key={log._id} className="relative pl-8">
              <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${
                log.type === 'user' ? 'bg-orange-100 text-orange-600' : 
                log.type === 'system' ? 'bg-blue-100 text-blue-600' : 
                'bg-rose-100 text-rose-600'
              }`}>
                {log.type === 'user' ? <FiUser size={14} /> : log.type === 'system' ? <FiSettings size={14} /> : <FiShield size={14} />}
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900">{log.action}</h3>
                  <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">{timeAgo(log.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-600">{log.details}</p>
                <div className="mt-3 text-xs font-bold text-slate-400">
                  By: {log.user}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
