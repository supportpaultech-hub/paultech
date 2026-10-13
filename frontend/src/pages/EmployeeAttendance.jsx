import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';
import { 
  FiClock, 
  FiCalendar, 
  FiMapPin, 
  FiCheckCircle, 
  FiShield, 
  FiSearch,
  FiUserCheck,
  FiList,
  FiGrid,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';

const getTodayIsoString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStandardIsoDate = (dateStr) => {
  if (!dateStr) return '';
  const s = dateStr.toString().trim();
  
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(s)) {
    const parts = s.split(/[-/]/);
    const y = parts[0];
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}/.test(s)) {
    const parts = s.split(/[-/]/);
    const p1 = parseInt(parts[0], 10);
    const p2 = parseInt(parts[1], 10);
    const y = parts[2];
    
    if (p1 > 12) {
      return `${y}-${String(p2).padStart(2, '0')}-${String(p1).padStart(2, '0')}`;
    }
    if (p2 > 12) {
      return `${y}-${String(p1).padStart(2, '0')}-${String(p2).padStart(2, '0')}`;
    }
    return `${y}-${String(p2).padStart(2, '0')}-${String(p1).padStart(2, '0')}`;
  }

  return s;
};

const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return '-';
  const iso = getStandardIsoDate(dateStr);
  if (iso && iso.length === 10) {
    const [y, m, d] = iso.split('-');
    return `${d}-${m}-${y}`;
  }
  return dateStr;
};

const formatMonthLabel = (yearMonthStr) => {
  if (!yearMonthStr) return 'All Months';
  const [year, month] = yearMonthStr.split('-');
  const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

const EmployeeAttendance = () => {
  const todayIso = getTodayIsoString();
  const currentYearMonth = todayIso.slice(0, 7);

  const [historyLogs, setHistoryLogs] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  // Logged-in user context
  const userObj = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || '{}');
  const employeeEmail = userObj.email || userObj.username || '';
  const employeeName = userObj.firstName 
    ? `${userObj.firstName} ${userObj.lastName || ''}`.trim() 
    : (userObj.name || userObj.username || 'Employee');

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const [historyRes, leavesRes, holidaysRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/attendance/employee-history/${employeeEmail}`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/leaves/my/${employeeEmail}`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/holidays`).catch(() => ({ data: [] }))
      ]);
      setHistoryLogs(historyRes.data || []);
      setLeaves(leavesRes.data || []);
      setHolidays(holidaysRes.data || []);
    } catch (err) {
      console.error('Error fetching employee attendance history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceHistory();
  }, [employeeEmail]);

  // Generate available months dropdown options
  const availableMonths = useMemo(() => {
    const monthsSet = new Set();
    monthsSet.add(currentYearMonth);

    // Past 12 months from today
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthsSet.add(ym);
    }

    // Add any month from history logs
    historyLogs.forEach(log => {
      const iso = getStandardIsoDate(log.date);
      if (iso && iso.length >= 7) {
        monthsSet.add(iso.slice(0, 7));
      }
    });

    return Array.from(monthsSet).sort().reverse();
  }, [historyLogs, currentYearMonth]);

  // Map history logs by ISO date YYYY-MM-DD
  const historyLogsMap = useMemo(() => {
    const map = {};
    historyLogs.forEach(log => {
      const iso = getStandardIsoDate(log.date);
      if (iso) {
        map[iso] = log;
      }
    });
    return map;
  }, [historyLogs]);

  // Map approved leaves by ISO date
  const approvedLeavesMap = useMemo(() => {
    const map = {};
    leaves.forEach(l => {
      if (l.status === 'Approved' && l.startDate && l.endDate) {
        let cur = new Date(l.startDate);
        const end = new Date(l.endDate);
        while (cur <= end) {
          const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
          map[iso] = l;
          cur.setDate(cur.getDate() + 1);
        }
      }
    });
    return map;
  }, [leaves]);

  // Map official holidays by ISO date
  const officialHolidaysMap = useMemo(() => {
    const map = {};
    holidays.forEach(h => {
      if (h.startDate && h.endDate) {
        let cur = new Date(h.startDate);
        const end = new Date(h.endDate);
        while (cur <= end) {
          const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
          map[iso] = h;
          cur.setDate(cur.getDate() + 1);
        }
      }
    });
    return map;
  }, [holidays]);

  // Filter logs for List View
  const filteredLogs = useMemo(() => {
    return historyLogs.filter(log => {
      const isoDate = getStandardIsoDate(log.date);
      const matchesSearch = (log.date && log.date.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (log.status && log.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (log.checkInTime && log.checkInTime.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesDateOrMonth = true;
      if (selectedDate) {
        matchesDateOrMonth = (isoDate === selectedDate);
      } else if (selectedMonth) {
        matchesDateOrMonth = isoDate && isoDate.startsWith(selectedMonth);
      }

      return matchesSearch && matchesDateOrMonth;
    });
  }, [historyLogs, searchTerm, selectedDate, selectedMonth]);

  // Calculate Monthly Stats for Selected Month
  const monthStats = useMemo(() => {
    const activeMonthStr = selectedMonth || currentYearMonth;
    let presentCount = 0;
    let weekOffCount = 0;
    let holidayCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    if (activeMonthStr) {
      const [yStr, mStr] = activeMonthStr.split('-');
      const year = parseInt(yStr, 10);
      const monthIndex = parseInt(mStr, 10) - 1;
      const totalDays = new Date(year, monthIndex + 1, 0).getDate();

      for (let d = 1; d <= totalDays; d++) {
        const dayIso = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, monthIndex, d).getDay();
        const log = historyLogsMap[dayIso];
        const leave = approvedLeavesMap[dayIso];
        const holiday = officialHolidaysMap[dayIso];

        if (log) {
          presentCount++;
        } else if (dayOfWeek === 0) {
          weekOffCount++;
        } else if (holiday) {
          holidayCount++;
        } else if (leave) {
          leaveCount++;
        } else if (dayIso < todayIso) {
          absentCount++;
        }
      }
    }

    return { presentCount, weekOffCount, holidayCount, absentCount, leaveCount };
  }, [selectedMonth, currentYearMonth, historyLogsMap, approvedLeavesMap, officialHolidaysMap, todayIso]);

  // Calendar Grid Data
  const calendarGrid = useMemo(() => {
    const activeMonthStr = selectedMonth || currentYearMonth;
    const [yStr, mStr] = activeMonthStr.split('-');
    const year = parseInt(yStr, 10);
    const monthIndex = parseInt(mStr, 10) - 1;

    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, monthIndex, 0).getDate();

    const cells = [];

    // Padding cells for previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDay = prevMonthTotalDays - i;
      cells.push({
        type: 'padding',
        dayNumber: prevDay,
        isCurrentMonth: false
      });
    }

    // Days for current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, monthIndex, d);
      const dayOfWeek = dateObj.getDay();
      const dayIso = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const log = historyLogsMap[dayIso];
      const leave = approvedLeavesMap[dayIso];
      const holiday = officialHolidaysMap[dayIso];
      const isSunday = (dayOfWeek === 0);
      const isToday = (dayIso === todayIso);
      const isPast = (dayIso < todayIso);
      const isFuture = (dayIso > todayIso);

      let statusType = 'normal';
      if (log) {
        statusType = 'present';
      } else if (isSunday) {
        statusType = 'weekoff';
      } else if (holiday) {
        statusType = 'holiday';
      } else if (leave) {
        statusType = 'leave';
      } else if (isPast) {
        statusType = 'absent';
      } else {
        statusType = 'future';
      }

      cells.push({
        type: 'day',
        dayNumber: d,
        dateIso: dayIso,
        dateObj,
        dayOfWeek,
        isSunday,
        isToday,
        isPast,
        isFuture,
        isCurrentMonth: true,
        log,
        leave,
        holiday,
        statusType
      });
    }

    // Padding cells for next month
    const remainingSlots = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remainingSlots; i++) {
      cells.push({
        type: 'padding',
        dayNumber: i,
        isCurrentMonth: false
      });
    }

    return { cells, year, monthIndex, daysInMonth };
  }, [selectedMonth, currentYearMonth, historyLogsMap, approvedLeavesMap, officialHolidaysMap, todayIso]);

  // Handle Month Navigation Arrow Buttons
  const handlePrevMonth = () => {
    const activeMonthStr = selectedMonth || currentYearMonth;
    const [yStr, mStr] = activeMonthStr.split('-');
    let y = parseInt(yStr, 10);
    let m = parseInt(mStr, 10) - 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    setSelectedMonth(`${y}-${String(m).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const activeMonthStr = selectedMonth || currentYearMonth;
    const [yStr, mStr] = activeMonthStr.split('-');
    let y = parseInt(yStr, 10);
    let m = parseInt(mStr, 10) + 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setSelectedMonth(`${y}-${String(m).padStart(2, '0')}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiUserCheck className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500 shrink-0" />
            My Attendance History
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Complete record of daily GPS-verified punch logs for <span className="font-semibold text-slate-800">{employeeName}</span>.
          </p>
        </div>

        {/* Monthly Summary Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <div className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <FiShield className="text-emerald-600 w-4 h-4 shrink-0" />
            <span>Present: <strong className="text-emerald-800 text-sm">{monthStats.presentCount}</strong> days</span>
          </div>

          <div className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 animate-pulse"></span>
            <span>Week Off (Sun): <strong className="text-rose-800 text-sm">{monthStats.weekOffCount}</strong></span>
          </div>

          {monthStats.holidayCount > 0 && (
            <div className="px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <span className="text-sm">🎉</span>
              <span>Holidays: <strong className="text-purple-900 text-sm">{monthStats.holidayCount}</strong></span>
            </div>
          )}

          {monthStats.absentCount > 0 && (
            <div className="px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <FiAlertCircle className="text-amber-600 w-4 h-4 shrink-0" />
              <span>Absent: <strong className="text-amber-900 text-sm">{monthStats.absentCount}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Left: View Mode Toggles & Month Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle Buttons */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FiList className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FiGrid className="w-3.5 h-3.5" />
                <span>Calendar View</span>
              </button>
            </div>

            {/* Month Filter Selector with Arrow Nav */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                title="Previous Month"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none px-2 py-0.5 cursor-pointer"
              >
                <option value="">All Months</option>
                {availableMonths.map(ym => (
                  <option key={ym} value={ym}>
                    {formatMonthLabel(ym)}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                title="Next Month"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Search & Date Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <FiSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search status or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
            </div>

            {/* Specific Date Picker */}
            <div className="relative w-full sm:w-44 flex items-center gap-1">
              <div className="relative w-full">
                <FiCalendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setSelectedDate(newDate);
                    if (newDate) {
                      setSelectedMonth(newDate.slice(0, 7));
                    }
                  }}
                  className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {(selectedDate || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedDate('');
                    setSearchTerm('');
                  }}
                  className="p-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all shrink-0"
                  title="Clear filters"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content: Loading / Calendar View / List View */}
      {loading ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-xs font-medium">Loading attendance records...</p>
        </div>
      ) : viewMode === 'calendar' ? (
        /* CALENDAR VIEW */
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
          
          {/* Calendar View Header & Color Legend */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FiCalendar className="text-orange-500" />
                {selectedMonth ? formatMonthLabel(selectedMonth) : 'Calendar View'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly grid breakdown. Click any day for detailed GPS geofence punch logs.
              </p>
            </div>

            {/* Color Coding Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-rose-700 font-extrabold">Sunday (Week Off)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-purple-700 font-bold">Official Holiday</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>On Leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span>Absent</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid Header (Sun - Sat) */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => (
              <div 
                key={dayName} 
                className={`py-2 rounded-xl text-xs font-extrabold tracking-wider uppercase ${
                  idx === 0 
                    ? 'bg-rose-100/80 text-rose-700 border border-rose-200/70' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                }`}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
            {calendarGrid.cells.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div 
                    key={`pad-${idx}`} 
                    className="min-h-[85px] sm:min-h-[105px] p-2 rounded-2xl bg-slate-50/40 border border-slate-100 opacity-40 select-none"
                  >
                    <span className="text-xs font-semibold text-slate-400">{cell.dayNumber}</span>
                  </div>
                );
              }

              const { dayNumber, isSunday, isToday, statusType, log, leave, holiday } = cell;

              // Card styling depending on status
              let bgStyle = 'bg-slate-50/70 border-slate-200/70 hover:border-slate-300';
              let badgeStyle = 'bg-slate-200 text-slate-700';
              let badgeText = 'No Log';

              if (statusType === 'present') {
                bgStyle = 'bg-emerald-50/90 border-emerald-200 hover:bg-emerald-100/90 hover:border-emerald-300 shadow-xs';
                badgeStyle = 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold';
                badgeText = log.status === 'Checked Out' ? 'Checked Out' : 'Present';
              } else if (statusType === 'weekoff') {
                // Sunday explicitly RED weekoff as requested
                bgStyle = 'bg-rose-50/90 border-rose-200 hover:bg-rose-100/90 hover:border-rose-300 shadow-xs';
                badgeStyle = 'bg-rose-100 text-rose-700 border border-rose-300 font-black';
                badgeText = 'Week Off';
              } else if (statusType === 'holiday') {
                // Official Holiday
                bgStyle = 'bg-purple-50/90 border-purple-200 hover:bg-purple-100/90 shadow-xs';
                badgeStyle = 'bg-purple-100 text-purple-800 border border-purple-300 font-extrabold';
                badgeText = 'Holiday';
              } else if (statusType === 'leave') {
                bgStyle = 'bg-blue-50/90 border-blue-200 hover:bg-blue-100/90 shadow-xs';
                badgeStyle = 'bg-blue-100 text-blue-800 border border-blue-300 font-bold';
                badgeText = 'On Leave';
              } else if (statusType === 'absent') {
                bgStyle = 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-100/60';
                badgeStyle = 'bg-amber-100 text-amber-800 border border-amber-200 font-bold';
                badgeText = 'Absent';
              } else if (statusType === 'future') {
                bgStyle = 'bg-white border-slate-200/60 text-slate-400 hover:bg-slate-50';
                badgeStyle = 'bg-slate-100 text-slate-500 font-medium';
                badgeText = 'Upcoming';
              }

              return (
                <div
                  key={`day-${dayNumber}`}
                  onClick={() => setSelectedDayDetails(cell)}
                  className={`min-h-[85px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${bgStyle} ${
                    isToday ? 'ring-2 ring-orange-500 ring-offset-1 font-bold' : ''
                  }`}
                >
                  {/* Top Row: Date Number & Badges */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-extrabold ${
                      isSunday ? 'text-rose-700' : 'text-slate-800'
                    }`}>
                      {dayNumber}
                      {isToday && (
                        <span className="ml-1 text-[9px] px-1.5 py-0.2 bg-orange-500 text-white font-black rounded-full uppercase">
                          Today
                        </span>
                      )}
                    </span>

                    {/* Status Pill */}
                    <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md ${badgeStyle}`}>
                      {badgeText}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="mt-1 space-y-1">
                    {statusType === 'present' && log && (
                      <div className="space-y-0.5 text-[10px] font-bold text-emerald-800">
                        <div className="flex items-center gap-1 truncate">
                          <FiClock className="text-emerald-600 shrink-0 w-3 h-3" />
                          <span className="truncate">{log.checkInTime || '-'}</span>
                        </div>
                        {log.checkOutTime && (
                          <div className="flex items-center gap-1 text-purple-700 truncate">
                            <FiCheckCircle className="text-purple-600 shrink-0 w-3 h-3" />
                            <span className="truncate">{log.checkOutTime}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {statusType === 'weekoff' && (
                      <div className="text-[10px] sm:text-xs font-black text-rose-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        Sunday
                      </div>
                    )}

                    {statusType === 'holiday' && holiday && (
                      <div className="text-[10px] font-black text-purple-800 truncate flex items-center gap-1">
                        <span>🎉</span>
                        <span className="truncate">{holiday.title}</span>
                      </div>
                    )}

                    {statusType === 'leave' && leave && (
                      <div className="text-[10px] font-bold text-blue-700 truncate">
                        {leave.leaveType || 'Approved Leave'}
                      </div>
                    )}

                    {statusType === 'absent' && (
                      <div className="text-[10px] font-semibold text-amber-700">
                        No Punch Log
                      </div>
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="mt-1 text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity text-right">
                    Click details &rarr;
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : filteredLogs.length === 0 ? (
        /* NO RECORDS LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center">
          <FiClock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-slate-800">No Attendance History Found</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto mt-1">
            No punch logs recorded for {selectedMonth ? formatMonthLabel(selectedMonth) : 'selected date filters'}.
          </p>
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Check-IN</th>
                  <th className="py-3.5 px-4">Check-OUT</th>
                  <th className="py-3.5 px-4">Device Timestamp</th>
                  <th className="py-3.5 px-4">GPS Geofence Status</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs whitespace-nowrap">
                      {formatDateDDMMYYYY(log.date)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs">
                        <FiClock className="text-emerald-600 shrink-0" />
                        {log.checkInTime || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.checkOutTime ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs">
                          <FiClock className="text-purple-600 shrink-0" />
                          {log.checkOutTime}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                          In Shift
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                      {log.deviceTime || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-emerald-700 font-semibold whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <FiMapPin className="text-emerald-500 shrink-0" />
                        <span className="text-[11px] font-bold">{log.locationStatus || 'Verified Sakchi Office'}</span>
                        {log.distanceMeters !== undefined && log.distanceMeters !== null && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg border border-emerald-200 shrink-0">
                            {log.distanceMeters}m away
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
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
            {filteredLogs.map((log) => (
              <div key={log._id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{formatDateDDMMYYYY(log.date)}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    log.status === 'Checked Out'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {log.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">Check-IN Time</span>
                    <span className="font-bold text-emerald-700 text-xs">{log.checkInTime || '-'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-medium">Check-OUT Time</span>
                    <span className="font-bold text-purple-700 text-xs">{log.checkOutTime || 'In Shift'}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <FiMapPin size={12} className="text-emerald-500 shrink-0" />
                    {log.locationStatus || 'Verified Sakchi Office Radius'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{log.deviceTime ? log.deviceTime.split(',')[1] : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAY DETAILS MODAL */}
      {selectedDayDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Day Punch Details</span>
                <h3 className="text-lg font-bold text-slate-900">
                  {formatDateDDMMYYYY(selectedDayDetails.dateIso)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Status Highlight Banner */}
            <div className="py-3 px-4 rounded-2xl text-center font-bold text-sm flex items-center justify-center gap-2 shadow-xs">
              {selectedDayDetails.statusType === 'present' && (
                <div className="w-full bg-emerald-100 text-emerald-800 py-2.5 rounded-2xl border border-emerald-200 flex items-center justify-center gap-2">
                  <FiCheckCircle className="text-emerald-600 w-5 h-5" />
                  <span>Present (Checked In & Verified)</span>
                </div>
              )}
              {selectedDayDetails.statusType === 'weekoff' && (
                <div className="w-full bg-rose-100 text-rose-700 py-2.5 rounded-2xl border border-rose-200 flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Sunday - Official Week Off</span>
                </div>
              )}
              {selectedDayDetails.statusType === 'holiday' && (
                <div className="w-full bg-purple-100 text-purple-900 py-2.5 rounded-2xl border border-purple-200 flex items-center justify-center gap-2">
                  <span className="text-lg">🎉</span>
                  <span>Official Holiday: {selectedDayDetails.holiday?.title || 'Festival Holiday'}</span>
                </div>
              )}
              {selectedDayDetails.statusType === 'leave' && (
                <div className="w-full bg-blue-100 text-blue-800 py-2.5 rounded-2xl border border-blue-200 flex items-center justify-center gap-2">
                  <FiInfo className="text-blue-600 w-5 h-5" />
                  <span>On Approved Leave</span>
                </div>
              )}
              {selectedDayDetails.statusType === 'absent' && (
                <div className="w-full bg-amber-100 text-amber-900 py-2.5 rounded-2xl border border-amber-200 flex items-center justify-center gap-2">
                  <FiAlertCircle className="text-amber-600 w-5 h-5" />
                  <span>Absent (No Punch Record Found)</span>
                </div>
              )}
              {selectedDayDetails.statusType === 'future' && (
                <div className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-2xl border border-slate-200 flex items-center justify-center gap-2">
                  <FiClock className="text-slate-500 w-5 h-5" />
                  <span>Upcoming Day</span>
                </div>
              )}
            </div>

            {/* Attendance Log Details Card if Present */}
            {selectedDayDetails.log ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Check-IN Time</span>
                    <span className="font-extrabold text-emerald-700 text-sm">{selectedDayDetails.log.checkInTime || '-'}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Check-OUT Time</span>
                    <span className="font-extrabold text-purple-700 text-sm">{selectedDayDetails.log.checkOutTime || 'In Shift'}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">GPS Geofence Status</span>
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <FiMapPin className="text-emerald-500" />
                      {selectedDayDetails.log.locationStatus || 'Verified Sakchi Office'}
                    </span>
                    {selectedDayDetails.log.distanceMeters !== undefined && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg">
                        {selectedDayDetails.log.distanceMeters}m away
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">Device Timestamp</span>
                  <span className="font-mono text-slate-600 font-medium">{selectedDayDetails.log.deviceTime || '-'}</span>
                </div>
              </div>
            ) : selectedDayDetails.holiday ? (
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 space-y-2 text-xs">
                <span className="text-purple-900 font-bold block flex items-center gap-1">
                  <span>🎉</span> {selectedDayDetails.holiday.title}
                </span>
                <p className="text-purple-800 font-medium">Type: {selectedDayDetails.holiday.type || 'Festival Holiday'}</p>
                {selectedDayDetails.holiday.description && (
                  <p className="text-purple-700">{selectedDayDetails.holiday.description}</p>
                )}
                <p className="text-purple-600 text-[11px] font-mono">
                  Dates: {formatDateDDMMYYYY(selectedDayDetails.holiday.startDate)} to {formatDateDDMMYYYY(selectedDayDetails.holiday.endDate)}
                </p>
              </div>
            ) : selectedDayDetails.leave ? (
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-2 text-xs">
                <span className="text-blue-900 font-bold block">Leave Details:</span>
                <p className="text-blue-800 font-medium">Type: {selectedDayDetails.leave.leaveType}</p>
                <p className="text-blue-800 font-medium">Reason: {selectedDayDetails.leave.reason || 'N/A'}</p>
              </div>
            ) : null}

            {/* Modal Close Footer */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;


