import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  FiClock, 
  FiMapPin, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiNavigation,
  FiBriefcase,
  FiActivity,
  FiLogIn,
  FiLogOut,
  FiCalendar,
  FiShield,
  FiChevronRight,
  FiChevronLeft,
  FiUsers,
  FiUser,
  FiRefreshCw
} from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { API_BASE_URL } from '../student-app/config';

const StatCard = ({ title, value, icon: Icon, trend, trendIsPositive, iconBgClass, iconTextClass }) => (
  <div className="bg-white p-3 sm:p-4.5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all min-w-0 h-full">
    <div className="flex items-center justify-between gap-1.5">
      <span className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate" title={title}>{title}</span>
      <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl ${iconBgClass} shrink-0`}>
        <Icon className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 ${iconTextClass}`} />
      </div>
    </div>
    <div className="mt-2 sm:mt-3 min-w-0">
      <h3 className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight truncate" title={String(value)}>{value}</h3>
      {trend && (
        <p className={`text-[10px] sm:text-xs font-semibold mt-0.5 flex items-center gap-1 truncate ${trendIsPositive ? 'text-emerald-600' : 'text-slate-400'}`} title={trend}>
          {trend}
        </p>
      )}
    </div>
  </div>
);

const normalizeDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.toString().trim().split('-');
  if (parts.length === 3) {
    const y = parts[0];
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return dateStr;
};

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekDays = (offset = 0) => {
  const now = new Date();
  const day = now.getDay(); // 0 is Sun, 1 is Mon, ... 6 is Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday + (offset * 7));
  monday.setHours(0, 0, 0, 0);

  const weekDays = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayStr = getTodayDateString();

  for (let i = 0; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dayNum}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    weekDays.push({
      name: dayNames[i],
      fullDayName: fullDayNames[i],
      dateStr,
      label,
      isToday: dateStr === todayStr
    });
  }
  return weekDays;
};

// Custom Chart Tooltip
const CustomChartTooltip = ({ active, payload, chartView }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs min-w-[220px] max-w-[300px]">
        <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-2 mb-2">
          <div>
            <span className="font-bold text-sm text-slate-100">{data.fullDayName || data.name}</span>
            <span className="text-[11px] text-slate-400 ml-1.5 font-mono">({data.label})</span>
          </div>
          {data.isToday && (
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black rounded-md uppercase tracking-wider">
              Today
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between py-1 text-slate-300">
          <span className="text-slate-400 text-[11px]">
            {chartView === 'team' ? 'Active Team Members:' : 'My Attendance:'}
          </span>
          <span className="font-black text-orange-400 text-base">
            {data.Punches} {chartView === 'team' ? (data.Punches === 1 ? 'Person' : 'People') : (data.Punches > 0 ? 'Present' : 'Absent')}
          </span>
        </div>

        {data.attendees && data.attendees.length > 0 ? (
          <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1.5 max-h-44 overflow-y-auto pr-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {chartView === 'team' ? 'Present Members:' : 'Punch Details:'}
            </p>
            {data.attendees.map((att, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-800/70 p-1.5 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-1.5 truncate mr-2">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {att.name.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-200 truncate">{att.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold block">{att.timeIn || 'Checked In'}</span>
                  {att.timeOut && (
                    <span className="text-[9px] font-mono text-purple-300 block">Out: {att.timeOut}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 italic mt-1">No punch records on this day</p>
        )}
      </div>
    );
  }
  return null;
};

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendance, setAttendance] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [allTeamLogs, setAllTeamLogs] = useState([]);
  const [leavesList, setLeavesList] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Weekly Activity Chart and Feed View Controls
  const [chartView, setChartView] = useState('team'); // 'team' (Team Activity) by default, or 'my'
  const [recentView, setRecentView] = useState('team'); // 'team' (Team Feed) by default, or 'my'
  const [weekOffset, setWeekOffset] = useState(0); // 0 = This Week, -1 = Last Week
  const [isSyncing, setIsSyncing] = useState(false);

  // Logged-in user context
  const userObj = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || '{}');
  const employeeEmail = userObj.email || userObj.username || '';
  const employeeName = userObj.firstName 
    ? `${userObj.firstName} ${userObj.lastName || ''}`.trim() 
    : (userObj.name || userObj.username || 'Employee');

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch today's attendance record & personal history & team logs & leaves
  const fetchAttendanceData = async (showLoader = true) => {
    if (!employeeEmail) {
      setLoadingAttendance(false);
      return;
    }

    try {
      if (showLoader) {
        setIsSyncing(true);
      }
      
      const [todayRes, historyRes, leavesRes, allRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/attendance/today/${encodeURIComponent(employeeEmail)}`).catch(() => ({ data: null })),
        axios.get(`${API_BASE_URL}/api/attendance/employee-history/${encodeURIComponent(employeeEmail)}`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/leaves/my/${encodeURIComponent(employeeEmail)}`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/attendance/all`).catch(() => ({ data: [] }))
      ]);

      setAttendance(todayRes.data || null);
      setHistoryLogs(historyRes.data || []);
      setLeavesList(leavesRes.data || []);
      setAllTeamLogs(allRes.data || []);
    } catch (err) {
      console.error('Error fetching live attendance & leaves:', err);
    } finally {
      setLoadingAttendance(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData(true);

    // Live Real-Time DB Polling every 8 seconds for real-time team presence
    const pollInterval = setInterval(() => {
      fetchAttendanceData(false);
    }, 8000);

    return () => clearInterval(pollInterval);
  }, [employeeEmail]);

  // Handle Geofenced Punch IN
  const handleCheckIn = () => {
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setActionLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const deviceTimeString = new Date().toLocaleString();

          const res = await axios.post(`${API_BASE_URL}/api/attendance/check-in`, {
            employeeId: userObj.employeeId || '',
            employeeEmail,
            employeeName,
            deviceTime: deviceTimeString,
            latitude: lat,
            longitude: lng
          });

          const dist = res.data?.record?.distanceMeters;
          const distMsg = (dist !== undefined && dist !== null) ? ` (${dist}m from Sakchi Office)` : '';
          alert(`Check-IN Successful! Sakchi Office location verified.${distMsg}`);
          fetchAttendanceData(true);
        } catch (err) {
          const msg = err.response?.data?.error || 'Check-IN Failed.';
          setGpsError(msg);
        } finally {
          setActionLoading(false);
        }
      },
      (error) => {
        setActionLoading(false);
        setGpsError('GPS permission denied. Please allow location access to Punch IN.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle Punch OUT
  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const deviceTimeString = new Date().toLocaleString();

      await axios.post(`${API_BASE_URL}/api/attendance/check-out`, {
        employeeEmail,
        deviceTime: deviceTimeString
      });

      alert('Check-OUT Successful! Have a great evening.');
      fetchAttendanceData(true);
    } catch (err) {
      const msg = err.response?.data?.error || 'Check-OUT Failed.';
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Unique Team Members Present Today
  const todayTeamCount = useMemo(() => {
    const todayStr = getTodayDateString();
    const seen = new Set();
    allTeamLogs.forEach(log => {
      if (normalizeDate(log.date) === todayStr) {
        seen.add((log.employeeEmail || log.employeeId || log.employeeName || '').toLowerCase());
      }
    });
    return seen.size;
  }, [allTeamLogs]);

  // Current Target Week Days (Mon - Sat)
  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const weekRangeText = `${weekDays[0].label} - ${weekDays[5].label}${weekOffset === 0 ? ' (This Week)' : ''}`;

  // Compute Weekly Chart Data (Real-time Team Activity vs Personal)
  const chartData = useMemo(() => {
    return weekDays.map((day) => {
      let matchedLogs = [];
      if (chartView === 'team') {
        matchedLogs = allTeamLogs.filter(log => normalizeDate(log.date) === day.dateStr);
      } else {
        matchedLogs = historyLogs.filter(log => normalizeDate(log.date) === day.dateStr);
      }

      const uniqueAttendees = [];
      const seenKeys = new Set();

      matchedLogs.forEach(log => {
        const key = (log.employeeEmail || log.employeeId || log.employeeName || '').toLowerCase();
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          uniqueAttendees.push({
            name: log.employeeName || 'Employee',
            designation: log.designation || 'Staff',
            timeIn: log.checkInTime || '',
            timeOut: log.checkOutTime || '',
            status: log.status || 'Present',
            img: log.img || ''
          });
        }
      });

      return {
        name: day.name,
        fullDayName: day.fullDayName,
        dateStr: day.dateStr,
        label: day.label,
        isToday: day.isToday,
        Punches: uniqueAttendees.length,
        totalPunches: matchedLogs.length,
        attendees: uniqueAttendees
      };
    });
  }, [weekDays, chartView, allTeamLogs, historyLogs]);

  // Weekly Stats Summary
  const weekTotalPunches = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.Punches, 0);
  }, [chartData]);

  const peakDay = useMemo(() => {
    return chartData.reduce((max, curr) => (curr.Punches > max.Punches ? curr : max), chartData[0] || { name: 'Mon', Punches: 0 });
  }, [chartData]);

  // Available distinct dates in team logs (most recent first)
  const availableDates = useMemo(() => {
    const datesSet = new Set();
    allTeamLogs.forEach(l => {
      if (l.date) datesSet.add(normalizeDate(l.date));
    });
    return Array.from(datesSet).sort().reverse();
  }, [allTeamLogs]);

  // Selected single day for Recent Activity (defaults to today if present, or latest day with activity)
  const [selectedDayDate, setSelectedDayDate] = useState('');

  const activeDay = useMemo(() => {
    if (selectedDayDate && availableDates.includes(selectedDayDate)) {
      return selectedDayDate;
    }
    const todayStr = getTodayDateString();
    if (availableDates.includes(todayStr)) {
      return todayStr;
    }
    return availableDates[0] || todayStr;
  }, [selectedDayDate, availableDates]);

  // Filter team logs strictly for one single day (so check-in & check-out belong to the same day)
  const singleDayTeamLogs = useMemo(() => {
    return allTeamLogs.filter(log => normalizeDate(log.date) === activeDay);
  }, [allTeamLogs, activeDay]);

  return (
    <div className="animate-fade-in space-y-4 sm:space-y-6 pb-12">
      
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiBriefcase className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500 shrink-0" />
            My Workspace Dashboard
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{employeeName}</span>! Punch daily attendance & track team activity.
          </p>
        </div>

        <a
          href="/employee/leaves"
          className="w-full sm:w-auto px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition-all border border-orange-200/80 flex items-center justify-center gap-1.5 shrink-0 shadow-sm active:scale-95"
        >
          <FiCalendar className="w-4 h-4 text-orange-500" />
          <span>My Leaves & Apply</span>
        </a>
      </div>

      {/* Attendance Punch-IN / Punch-OUT Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
          {/* Left: Clock & Status */}
          <div className="space-y-2 sm:space-y-3 text-center lg:text-left w-full lg:w-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[10px] sm:text-xs font-semibold text-orange-400">
              <FiNavigation className="animate-spin text-orange-400 shrink-0" size={12} />
              <span className="truncate">GPS Geofenced Office Attendance (Sakchi, Jamshedpur)</span>
            </div>

            <div className="flex items-baseline justify-center lg:justify-start gap-2.5">
              <span className="text-2xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white">
                {currentTime.toLocaleTimeString()}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] sm:text-xs flex items-center justify-center lg:justify-start gap-1 font-medium">
              <FiMapPin className="text-orange-400 shrink-0" size={13} />
              <span>Location Radius: 250m within Sakchi Office</span>
            </p>
          </div>

          {/* Right: Interactive Action Button */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-2.5">
            {loadingAttendance ? (
              <div className="px-6 py-3 bg-white/10 rounded-xl sm:rounded-2xl text-slate-300 text-xs font-medium animate-pulse w-full sm:w-auto text-center">
                Checking today's status...
              </div>
            ) : !attendance ? (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <FiLogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                {actionLoading ? 'Verifying GPS Location...' : 'PUNCH IN (START DAY)'}
              </button>
            ) : attendance.status === 'Present' ? (
              <div className="flex flex-col items-center lg:items-end gap-2 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <div className="px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl sm:rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 w-full sm:w-auto justify-center">
                    <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Checked IN at {attendance.checkInTime}</span>
                    {attendance.distanceMeters !== undefined && attendance.distanceMeters !== null && (
                      <span className="ml-1 px-2 py-0.5 bg-emerald-400/20 text-emerald-200 text-[10px] font-black rounded-md border border-emerald-400/30">
                        {attendance.distanceMeters}m away
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleCheckOut}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-bold text-xs rounded-xl sm:rounded-2xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    <FiLogOut className="w-4 h-4" />
                    {actionLoading ? 'Checking OUT...' : 'PUNCH OUT'}
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                  <FiClock className="text-amber-400 w-3.5 h-3.5" />
                  <span>Punch OUT manually before 7:00 PM or automatic Punch-OUT at 07:00 PM</span>
                </p>
              </div>
            ) : (
              <div className="px-5 py-2.5 bg-slate-800/80 border border-white/20 rounded-xl sm:rounded-2xl text-slate-300 text-xs font-bold flex items-center gap-2 w-full sm:w-auto justify-center">
                <FiCheckCircle className="w-4 h-4 text-purple-400" />
                <span>
                  Shift Completed ({attendance.deviceTime?.includes('Auto') || attendance.checkOutTime === '07:00:00 PM' ? 'Auto Checked OUT at 07:00 PM' : `Checked OUT at ${attendance.checkOutTime}`})
                </span>
              </div>
            )}

            {/* GPS Error Notification */}
            {gpsError && (
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-[11px] sm:text-xs flex items-center gap-2 max-w-md w-full">
                <FiAlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{gpsError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        <StatCard 
          title="My Today Status" 
          value={attendance ? attendance.status : 'Not Punched'} 
          icon={FiClock} 
          trend={attendance ? `In: ${attendance.checkInTime}` : 'Punch IN required'} 
          trendIsPositive={Boolean(attendance)}
          iconBgClass="bg-amber-50"
          iconTextClass="text-amber-600"
        />
        <StatCard 
          title="Team Present Today" 
          value={`${todayTeamCount} Active`} 
          icon={FiUsers} 
          trend={todayTeamCount > 0 ? 'Live in Sakchi Office' : 'Waiting for punches'} 
          trendIsPositive={todayTeamCount > 0}
          iconBgClass="bg-emerald-50"
          iconTextClass="text-emerald-600"
        />
        <StatCard 
          title="Total Present Days" 
          value={`${historyLogs.length} Days`} 
          icon={FiActivity} 
          trend="Personal History" 
          trendIsPositive={true}
          iconBgClass="bg-indigo-50"
          iconTextClass="text-indigo-600"
        />
        <StatCard 
          title="Leaves / Time Off" 
          value={`${leavesList.length} Applied`} 
          icon={FiCalendar} 
          trend={`${leavesList.filter(l => l.status === 'Approved').length} Approved`} 
          trendIsPositive={true}
          iconBgClass="bg-orange-50"
          iconTextClass="text-orange-600"
        />
      </div>

      {/* Main Content Area: Weekly Attendance Activity & Live Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Dynamic Attendance Chart Area */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            {/* Top Bar: Title & Real-time Live Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <FiActivity className="text-orange-500" />
                  Weekly Attendance Activity
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {chartView === 'team'
                    ? 'Real-time punch distribution of all employees for the week.'
                    : 'Your personal daily punch records for the week.'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Live DB Sync</span>
                </div>

                <button
                  onClick={() => fetchAttendanceData(true)}
                  disabled={isSyncing}
                  title="Click to refresh live attendance data"
                  className="p-1.5 text-slate-500 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 rounded-lg border border-slate-200 transition-all active:scale-95 cursor-pointer"
                >
                  <FiRefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-orange-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Filter Bar: Team vs My Toggle & Week Navigator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200/70 mb-4">
              {/* Toggle Switch */}
              <div className="w-full sm:w-auto grid grid-cols-2 sm:flex p-1 bg-white rounded-xl border border-slate-200 shadow-xs text-xs font-semibold">
                <button
                  onClick={() => setChartView('team')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    chartView === 'team'
                      ? 'bg-orange-500 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FiUsers className="w-3.5 h-3.5" />
                  <span>All Employees</span>
                </button>
                <button
                  onClick={() => setChartView('my')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    chartView === 'my'
                      ? 'bg-orange-500 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FiUser className="w-3.5 h-3.5" />
                  <span>My Punches</span>
                </button>
              </div>

              {/* Week Navigation */}
              <div className="flex items-center justify-between sm:justify-end gap-1.5 text-xs w-full sm:w-auto">
                <button
                  onClick={() => setWeekOffset(prev => prev - 1)}
                  className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-all active:scale-95 cursor-pointer"
                  title="Previous Week"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-bold text-slate-800 text-[11px] sm:text-xs px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs whitespace-nowrap text-center flex-1 sm:flex-initial">
                  {weekRangeText}
                </span>

                <button
                  onClick={() => setWeekOffset(prev => prev + 1)}
                  disabled={weekOffset >= 0}
                  className={`p-1.5 rounded-lg border transition-all ${
                    weekOffset >= 0
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border-slate-200 active:scale-95 cursor-pointer'
                  }`}
                  title="Next Week"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>

                {weekOffset !== 0 && (
                  <button
                    onClick={() => setWeekOffset(0)}
                    className="ml-1 px-2 py-1 text-[10px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Current Week
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4 text-center">
              <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100 min-w-0">
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block truncate">Total Punches</span>
                <span className="text-xs sm:text-base font-extrabold text-slate-800 truncate block">{weekTotalPunches}</span>
              </div>
              <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100 min-w-0">
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block truncate">Today Active</span>
                <span className="text-xs sm:text-base font-extrabold text-emerald-600 truncate block">{todayTeamCount} Present</span>
              </div>
              <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100 min-w-0">
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block truncate">Week Peak Day</span>
                <span className="text-xs sm:text-base font-extrabold text-orange-600 truncate block">
                  {peakDay.Punches > 0 ? `${peakDay.name} (${peakDay.Punches})` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Recharts BarChart */}
          <div className="w-full h-[240px] sm:h-[280px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={34}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={({ x, y, payload }) => {
                    const entry = chartData.find(d => d.name === payload.value);
                    const isToday = entry?.isToday;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={0}
                          dy={12}
                          textAnchor="middle"
                          fill={isToday ? '#EA580C' : '#64748B'}
                          fontWeight={isToday ? 'bold' : 'normal'}
                          fontSize={11}
                        >
                          {payload.value}
                        </text>
                        {isToday && (
                          <circle cx={0} cy={18} r={2.5} fill="#EA580C" />
                        )}
                      </g>
                    );
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomChartTooltip chartView={chartView} />} />
                <Bar dataKey="Punches" name="Active Members" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isToday ? '#EA580C' : entry.Punches > 0 ? '#FB923C' : '#E2E8F0'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Recent Activity - Single-Day Team Feed vs My Activity */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm flex flex-col">
          
          {/* Top Header */}
          <div className="mb-3.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FiClock className="text-orange-500 w-5 h-5 shrink-0" />
              <span>Recent Activity</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Live single-day punch records.</p>
          </div>

          {/* Controls Card: Feed Tabs & Date Picker */}
          <div className="bg-slate-50/80 p-2 rounded-2xl border border-slate-200/70 mb-4 space-y-2">
            {/* Toggle Feed Tabs */}
            <div className="grid grid-cols-2 p-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs text-xs font-semibold">
              <button
                onClick={() => setRecentView('team')}
                className={`py-1.5 rounded-lg transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                  recentView === 'team'
                    ? 'bg-orange-500 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FiUsers className="w-3.5 h-3.5 shrink-0" />
                <span>Team Feed</span>
              </button>
              <button
                onClick={() => setRecentView('my')}
                className={`py-1.5 rounded-lg transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                  recentView === 'my'
                    ? 'bg-orange-500 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FiUser className="w-3.5 h-3.5 shrink-0" />
                <span>My Activity</span>
              </button>
            </div>

            {/* Date Selector Row */}
            {recentView === 'team' && availableDates.length > 0 && (
              <div className="flex items-center justify-between px-1.5 pt-0.5 text-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <FiCalendar className="text-orange-500 w-3.5 h-3.5 shrink-0" />
                  <span>Date:</span>
                </span>
                <select
                  value={activeDay}
                  onChange={(e) => setSelectedDayDate(e.target.value)}
                  className="text-xs font-extrabold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer shadow-2xs max-w-[210px] truncate"
                >
                  {availableDates.map(d => (
                    <option key={d} value={d}>
                      {d === getTodayDateString() ? `Today (${d})` : d}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3 sm:space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
            {recentView === 'team' ? (
              singleDayTeamLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No attendance records logged for {activeDay === getTodayDateString() ? 'today' : activeDay}.
                </div>
              ) : (
                singleDayTeamLogs.map((log, idx) => {
                  const initials = (log.employeeName || 'EM')
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div 
                      key={log._id || idx} 
                      className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2.5"
                    >
                      {/* Header: Avatar, Name, Designation & Status Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {log.img ? (
                            <img 
                              src={log.img} 
                              alt={log.employeeName} 
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-200 shrink-0" 
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-orange-200 shrink-0 shadow-2xs">
                              {initials}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">
                              {log.employeeName}
                            </h4>
                            <p className="text-slate-500 text-[10px] truncate">
                              {log.designation || 'Staff'} {log.employeeId ? `• ${log.employeeId}` : ''}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                          log.status === 'Checked Out'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {log.status === 'Checked Out' ? 'OUT' : 'IN'}
                        </span>
                      </div>

                      {/* Check-IN and Check-OUT times for this day */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Check IN</span>
                          <span className="text-[11px] font-mono font-bold text-emerald-700 block">
                            {log.checkInTime || '-'}
                          </span>
                        </div>

                        <div className="bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Check OUT</span>
                          <span className={`text-[11px] font-mono font-bold block ${log.checkOutTime ? 'text-purple-700' : 'text-slate-400'}`}>
                            {log.checkOutTime ? log.checkOutTime : 'In Shift'}
                          </span>
                        </div>
                      </div>

                      {/* Location and Date footer */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/40">
                        <span className="font-medium text-slate-500">
                          {log.date === getTodayDateString() ? 'Today' : log.date}
                        </span>
                        <span className="text-emerald-600 flex items-center gap-1 font-medium truncate max-w-[150px]">
                          <FiMapPin size={10} className="shrink-0" />
                          <span className="truncate">{log.locationStatus ? log.locationStatus.split('(')[0].trim() : 'Sakchi Office'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              // My Personal Activity Feed
              <div className="space-y-3">
                {/* Today's Shift status */}
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-slate-900 text-xs">Today's Shift</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {attendance 
                      ? `Checked IN at ${attendance.checkInTime} (${attendance.status})`
                      : 'No punch recorded yet today'}
                  </p>
                  {attendance?.checkOutTime && (
                    <p className="text-[11px] text-purple-700 font-semibold mt-1">
                      Checked OUT at {attendance.checkOutTime}
                    </p>
                  )}
                </div>

                {historyLogs.slice(0, 5).map((log, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                      <span>{log.date}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                        log.status === 'Checked Out' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      IN: {log.checkInTime || '-'} • OUT: {log.checkOutTime || 'In Shift'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Employee Personal Recent Attendance Table */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FiCalendar className="text-orange-500" /> My Recent Attendance Logs
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">Showing your personal daily punch records.</p>
          </div>

          <a 
            href="/employee/attendance" 
            className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1 border border-orange-200"
          >
            <span>View Full History</span>
            <FiChevronRight size={14} />
          </a>
        </div>

        {historyLogs.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            No attendance history recorded yet. Punch IN above to start recording!
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check-IN</th>
                    <th className="py-3 px-4">Check-OUT</th>
                    <th className="py-3 px-4">Device Timestamp</th>
                    <th className="py-3 px-4">GPS Geofence Status</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {historyLogs.slice(0, 3).map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          <FiClock className="text-emerald-600" />
                          {log.checkInTime || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.checkOutTime ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">
                            <FiClock className="text-purple-600" />
                            {log.checkOutTime}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                            In Shift
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                        {log.deviceTime || '-'}
                      </td>
                      <td className="py-3 px-4 text-[10px] text-emerald-700 font-semibold">
                        <span className="flex items-center gap-1">
                          <FiMapPin className="text-emerald-500" />
                          {log.locationStatus || 'Verified Sakchi Office'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          log.status === 'Checked Out'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          <FiCheckCircle />
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {historyLogs.slice(0, 3).map((log) => (
                <div key={log._id} className="py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{log.date}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      log.status === 'Checked Out'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {log.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Check-IN</span>
                      <span className="font-bold text-emerald-700">{log.checkInTime || '-'}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] block">Check-OUT</span>
                      <span className="font-bold text-purple-700">{log.checkOutTime || 'In Shift'}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <FiMapPin size={11} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{log.locationStatus || 'Verified Sakchi Office Radius'}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default EmployeeDashboard;
