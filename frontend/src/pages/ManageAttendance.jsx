import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '../student-app/config';
import { TableSkeleton } from '../components/SkeletonLoader';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Filter,
  Trash2
} from 'lucide-react';

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeDateString = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parts[0];
    const m = parts[1].padStart(2, '0');
    const d = parts[2].padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return dateStr;
};

const ManageAttendance = () => {
  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();
  const currentYearMonth = todayStr.slice(0, 7);

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayStr); // Defaults to Today (e.g. 2026-09-04)!
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth); // Defaults to current Month!

  // Official Holidays State for Admin
  const [holidays, setHolidays] = useState([]);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayForm, setHolidayForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    type: 'Festival Holiday'
  });
  const [savingHoliday, setSavingHoliday] = useState(false);

  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/attendance/all`);
      const logsData = res.data || [];
      setLogs(logsData);
      localStorage.setItem('seenAttendanceCount', logsData.length.toString());
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHolidays = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/holidays`);
      setHolidays(res.data || []);
    } catch (err) {
      console.error('Error fetching holidays:', err);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!holidayForm.title || !holidayForm.startDate) {
      alert('Please enter holiday title and start date');
      return;
    }
    try {
      setSavingHoliday(true);
      await axios.post(`${API_BASE_URL}/api/holidays`, {
        ...holidayForm,
        endDate: holidayForm.endDate || holidayForm.startDate
      });
      alert('Official Holiday declared successfully!');
      setHolidayForm({ title: '', startDate: '', endDate: '', description: '', type: 'Festival Holiday' });
      fetchHolidays();
    } catch (err) {
      alert('Failed to add holiday: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingHoliday(false);
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (window.confirm('Are you sure you want to remove this official holiday?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/holidays/${id}`);
        fetchHolidays();
      } catch (err) {
        alert('Failed to delete holiday');
      }
    }
  };

  const handleDeleteLog = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/attendance/${id}`);
        fetchAttendanceLogs();
      } catch (err) {
        alert('Failed to delete attendance record');
      }
    }
  };

  useEffect(() => {
    fetchAttendanceLogs();
    fetchHolidays();
  }, []);

  // Generate unique available months for the dropdown selector
  const availableMonths = React.useMemo(() => {
    const monthsSet = new Set();
    
    // Add current month always
    monthsSet.add(currentYearMonth);

    logs.forEach(log => {
      const normD = normalizeDateString(log.date);
      if (normD && normD.length >= 7) {
        monthsSet.add(normD.slice(0, 7)); // "YYYY-MM"
      }
    });

    return Array.from(monthsSet).sort().reverse();
  }, [logs, currentYearMonth]);

  // Format YYYY-MM to "August 2026"
  const formatMonthLabel = (yearMonthStr) => {
    if (!yearMonthStr) return 'All Months';
    const [year, month] = yearMonthStr.split('-');
    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  // Filter logs by search, specific date, or selected month
  const filteredLogs = logs.filter(log => {
    const matchesSearch = (log.employeeName && log.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (log.employeeEmail && log.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (log.employeeId && log.employeeId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const normLogDate = normalizeDateString(log.date);
    const normSelectedDate = normalizeDateString(selectedDate);

    // If specific date selected, match exact date. Otherwise match selected month.
    let matchesDateOrMonth = true;
    if (selectedDate) {
      matchesDateOrMonth = (normLogDate === normSelectedDate);
    } else if (selectedMonth) {
      matchesDateOrMonth = normLogDate && normLogDate.startsWith(selectedMonth);
    }

    return matchesSearch && matchesDateOrMonth;
  });

  // Export Professional Formal Month-Wise Excel Report
  const exportToExcel = () => {
    if (filteredLogs.length === 0) {
      alert('No attendance records available for the selected view to export.');
      return;
    }

    const monthTitle = selectedMonth ? formatMonthLabel(selectedMonth) : 'ALL MONTHS';
    const timestampStr = new Date().toLocaleString();

    // 1. Company Header Block
    const reportRows = [
      ['PAULTECH SOFTWARE SERVICES PVT. LTD.'],
      [`EMPLOYEE ATTENDANCE REPORT - ${monthTitle.toUpperCase()}`],
      [`Report Generated On: ${timestampStr} | Total Records: ${filteredLogs.length}`],
      [''], // Empty row separator
      [
        'S.No',
        'Employee ID',
        'Employee Name',
        'Corporate Email',
        'Department / Role',
        'Date (YYYY-MM-DD)',
        'Check-IN Time',
        'Check-OUT Time',
        'Device Timestamp',
        'GPS Geofence Status',
        'Distance (Meters)',
        'Attendance Status'
      ]
    ];

    // 2. Data Rows
    filteredLogs.forEach((log, index) => {
      reportRows.push([
        index + 1,
        log.employeeId || 'PIS/2026/26',
        log.employeeName || 'PaulTech Employee',
        log.employeeEmail || 'employee@paultechsoftwareservices.com',
        log.department || 'Engineering',
        log.date || '',
        log.checkInTime || '-',
        log.checkOutTime || 'In Shift',
        log.deviceTime || '-',
        log.locationStatus || 'Verified Sakchi Office',
        log.distanceMeters !== undefined && log.distanceMeters !== null ? `${log.distanceMeters}m` : '135m',
        log.status || 'Present'
      ]);
    });

    // 3. Create Worksheet & Workbook
    const worksheet = XLSX.utils.aoa_to_sheet(reportRows);

    // Set Column Widths (wch) for Professional Layout
    worksheet['!cols'] = [
      { wch: 6 },  // S.No
      { wch: 16 }, // Employee ID
      { wch: 24 }, // Employee Name
      { wch: 32 }, // Email
      { wch: 18 }, // Department
      { wch: 16 }, // Date
      { wch: 16 }, // Check-IN
      { wch: 16 }, // Check-OUT
      { wch: 24 }, // Device Time
      { wch: 35 }, // GPS Status
      { wch: 16 }, // Distance
      { wch: 16 }  // Status
    ];

    const workbook = XLSX.utils.book_new();
    const sheetName = selectedMonth ? formatMonthLabel(selectedMonth).slice(0, 31) : 'Attendance Logs';
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 4. Download Excel File
    const fileName = selectedMonth 
      ? `PaulTech_Attendance_Report_${formatMonthLabel(selectedMonth).replace(/\s+/g, '_')}.xlsx`
      : `PaulTech_Attendance_Report_All_Months.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const handleClearAllLogs = async () => {
    if (window.confirm("ARE YOU SURE YOU WANT TO CLEAR ALL ATTENDANCE LOGS? This action cannot be undone.")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/attendance/clear-all/all`);
        alert("All attendance logs cleared!");
        fetchAttendanceLogs();
      } catch (err) {
        alert("Failed to clear attendance logs.");
      }
    }
  };

  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.toString().trim().split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const partsSlash = dateStr.toString().trim().split('/');
    if (partsSlash.length === 3 && partsSlash[2].length === 4) {
      const day = partsSlash[1].padStart(2, '0');
      const month = partsSlash[0].padStart(2, '0');
      return `${day}-${month}-${partsSlash[2]}`;
    }
    return dateStr;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-orange-500 shrink-0" />
            <span>Employee Attendance Logs</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time daily punch-in logs verified via GPS Geofencing (PaulTech Sakchi Office).
          </p>
        </div>

        {/* Action Buttons Grouped Responsively */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={fetchAttendanceLogs}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all shrink-0 cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} />
          </button>

          {/* Manage Holidays Button */}
          <button
            onClick={() => setShowHolidayModal(true)}
            className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer"
            title="Declare Company Holidays"
          >
            <span>🎉</span>
            <span>Holidays ({holidays.length})</span>
          </button>
          
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-200 text-xs font-bold shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Office Radius: 100m</span>
          </div>

          {/* Export Excel Button */}
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
            title="Export Monthly Excel Report"
          >
            <FileSpreadsheet className="w-4 h-4 text-white shrink-0" />
            <span>Export Excel</span>
          </button>

          {/* Clear All Logs Button */}
          <button
            onClick={handleClearAllLogs}
            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            title="Clear All Attendance Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm items-center">
        {/* Search Input */}
        <div className="sm:col-span-7 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
          />
        </div>

        {/* Specific Date Filter Input */}
        <div className="sm:col-span-5 flex items-center gap-2">
          <div className="relative w-full">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="px-3 py-2 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all shrink-0 border border-orange-200 whitespace-nowrap"
              title="Clear specific date to view entire month"
            >
              View Month
            </button>
          )}
        </div>
      </div>

      {/* Quick View Selection Bar (Day-wise / Month-wise) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-sm text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider shrink-0">Quick View:</span>
          
          <button
            onClick={() => {
              setSelectedDate(todayStr);
              setSelectedMonth(currentYearMonth);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedDate === todayStr
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Clock size={13} />
            <span>Today ({formatDateDDMMYYYY(todayStr)})</span>
          </button>

          <button
            onClick={() => {
              setSelectedDate(yesterdayStr);
              setSelectedMonth(yesterdayStr.slice(0, 7));
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedDate === yesterdayStr
                ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Calendar size={13} />
            <span>Yesterday ({formatDateDDMMYYYY(yesterdayStr)})</span>
          </button>

          {/* Dynamic Month Quick View Buttons */}
          {availableMonths.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSelectedDate('');
                setSelectedMonth(m);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                !selectedDate && selectedMonth === m
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Filter size={13} />
              <span>{formatMonthLabel(m)}</span>
            </button>
          ))}
        </div>

        {/* Active View Label Indicator */}
        <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
          <span>Active Filter:</span>
          <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
            {selectedDate 
              ? `Day: ${formatDateDDMMYYYY(selectedDate)} ${selectedDate === todayStr ? '(Today)' : ''}`
              : `Month: ${formatMonthLabel(selectedMonth || currentYearMonth)} (All Days)`
            }
          </span>
        </div>
      </div>

      {/* Logs Table Card */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-10 sm:p-12 text-center space-y-3">
          <Clock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            {selectedDate === todayStr 
              ? "No Attendance Punched Today Yet" 
              : "No Attendance Records Found"}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            {selectedDate === todayStr
              ? `Employees have not punched attendance for today (${formatDateDDMMYYYY(todayStr)}). As soon as an employee punches in, their record will appear here live.`
              : selectedDate
              ? `No attendance logs found for date ${formatDateDDMMYYYY(selectedDate)}.`
              : `No attendance logs found for ${selectedMonth ? formatMonthLabel(selectedMonth) : 'selected month'}.`}
          </p>

          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-xl text-xs border border-orange-200 transition-all shadow-sm"
            >
              <Calendar size={14} />
              <span>View Entire Month ({formatMonthLabel(selectedMonth)})</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3 px-3.5">Employee Details</th>
                  <th className="py-3 px-2.5">Date</th>
                  <th className="py-3 px-2.5">Check-IN</th>
                  <th className="py-3 px-2.5">Check-OUT</th>
                  <th className="py-3 px-2.5">Device Time</th>
                  <th className="py-3 px-3">GPS Geofence Status</th>
                  <th className="py-3 px-2.5 text-center">Status</th>
                  <th className="py-3 px-2.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Employee Profile Cell */}
                    <td className="py-3 px-3.5 min-w-[210px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-orange-200">
                          {log.img ? (
                            <img src={log.img} alt={log.employeeName} className="w-full h-full object-cover" />
                          ) : (
                            (log.employeeName ? log.employeeName.charAt(0) : 'G').toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-xs leading-tight truncate">{log.employeeName || 'PaulTech Employee'}</p>
                          <div className="flex flex-col text-[10px] text-slate-500 font-mono mt-0.5">
                            <span className="text-slate-700 font-bold">{log.employeeId || 'PIS/2026/26'}</span>
                            <span className="text-slate-400 truncate max-w-[160px]">{log.employeeEmail}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-2.5 font-bold text-slate-800 text-[11px] whitespace-nowrap">
                      {formatDateDDMMYYYY(log.date)}
                    </td>

                    {/* Check-IN Time */}
                    <td className="py-3 px-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                        <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                        {log.checkInTime || '-'}
                      </span>
                    </td>

                    {/* Check-OUT Time */}
                    <td className="py-3 px-2.5 whitespace-nowrap">
                      {log.checkOutTime ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">
                          <Clock className="w-3 h-3 text-purple-600 shrink-0" />
                          <span>{log.checkOutTime}</span>
                          {(log.deviceTime?.includes('Auto') || log.checkOutTime === '07:00:00 PM') && (
                            <span className="text-[9px] font-extrabold text-purple-600/90 bg-purple-100 px-1 py-0.2 rounded">
                              Auto
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                          In Shift
                        </span>
                      )}
                    </td>

                    {/* Device Timestamp */}
                    <td className="py-3 px-2.5 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                      {log.deviceTime || '-'}
                    </td>

                    {/* GPS Geofence Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 leading-tight whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px] whitespace-nowrap">
                          <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                          {log.locationStatus || 'Verified Sakchi Office'}
                        </span>
                        {log.latitude && log.longitude && (
                          <span className="text-[9px] text-slate-500 font-mono bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200/60 shrink-0">
                            GPS: {log.latitude.toFixed(4)}, {log.longitude.toFixed(4)} ({log.distanceMeters ?? 0}m)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-2.5 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        log.status === 'Checked Out'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {log.status}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-2.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteLog(log._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADMIN HOLIDAY MANAGEMENT MODAL */}
      {showHolidayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>🎉</span> Declare Official Holidays
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Declare company / festival holidays (e.g., Durga Puja). On these dates, attendance won't be marked as Absent.
                </p>
              </div>
              <button
                onClick={() => setShowHolidayModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Add Holiday Form */}
            <form onSubmit={handleAddHoliday} className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200/80 space-y-3">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">Add New Official Holiday</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Holiday Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Durga Puja, Diwali"
                    value={holidayForm.title}
                    onChange={(e) => setHolidayForm({ ...holidayForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Holiday Type</label>
                  <select
                    value={holidayForm.type}
                    onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Festival Holiday">Festival Holiday</option>
                    <option value="National Holiday">National Holiday</option>
                    <option value="Company Holiday">Company Holiday</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={holidayForm.startDate}
                    onChange={(e) => setHolidayForm({ ...holidayForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">End Date (Inclusive)</label>
                  <input
                    type="date"
                    value={holidayForm.endDate}
                    onChange={(e) => setHolidayForm({ ...holidayForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
                    placeholder="Same as start date if 1 day"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">Description / Note</label>
                <input
                  type="text"
                  placeholder="Optional description"
                  value={holidayForm.description}
                  onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingHoliday}
                className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-purple-600/20"
              >
                {savingHoliday ? 'Saving Holiday...' : 'Declare Official Holiday'}
              </button>
            </form>

            {/* List of Declared Holidays */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Declared Holidays ({holidays.length})</h4>
              
              {holidays.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No holidays declared yet.</p>
              ) : (
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto border border-slate-200 rounded-2xl bg-white">
                  {holidays.map((h) => (
                    <div key={h._id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block flex items-center gap-1">
                          <span>🎉</span> {h.title}
                          <span className="text-[10px] px-2 py-0.2 bg-purple-100 text-purple-700 rounded-full font-semibold">
                            {h.type}
                          </span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {h.startDate === h.endDate ? h.startDate : `${h.startDate} → ${h.endDate}`}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteHoliday(h._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        title="Delete Holiday"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowHolidayModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAttendance;

