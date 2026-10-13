import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiTrash2, 
  FiEye, 
  FiRefreshCw, 
  FiUser, 
  FiInfo, 
  FiCheck, 
  FiX, 
  FiMessageSquare,
  FiBriefcase
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';
import { TableSkeleton } from '../components/SkeletonLoader';

const StatCard = ({ title, value, subtitle, icon: Icon, bgClass, textClass, badgeText, badgeClass }) => (
  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{title}</span>
      <div className={`p-2.5 rounded-xl ${bgClass}`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${textClass}`} />
      </div>
    </div>
    <div className="mt-2">
      <div className="flex items-baseline gap-2">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        {badgeText && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {badgeText}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
    </div>
  </div>
);

const getLeaveTypeBadgeClass = (type) => {
  switch (type) {
    case 'Sick Leave':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Casual Leave':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Emergency Leave':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Earned Leave':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Maternity/Paternity Leave':
      return 'bg-pink-50 text-pink-700 border-pink-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Approved':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <FiCheckCircle className="text-emerald-500" />
          Approved
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <FiXCircle className="text-rose-500" />
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
          <FiClock className="text-amber-500" />
          Pending Approval
        </span>
      );
  }
};

const MONTHS = [
  { value: 'All', label: 'All Months', short: 'All' },
  { value: '01', label: 'January', short: 'Jan' },
  { value: '02', label: 'February', short: 'Feb' },
  { value: '03', label: 'March', short: 'Mar' },
  { value: '04', label: 'April', short: 'Apr' },
  { value: '05', label: 'May', short: 'May' },
  { value: '06', label: 'June', short: 'Jun' },
  { value: '07', label: 'July', short: 'Jul' },
  { value: '08', label: 'August', short: 'Aug' },
  { value: '09', label: 'September', short: 'Sep' },
  { value: '10', label: 'October', short: 'Oct' },
  { value: '11', label: 'November', short: 'Nov' },
  { value: '12', label: 'December', short: 'Dec' }
];

const ManageLeaves = () => {
  const currentYearStr = new Date().getFullYear().toString();
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({
    totalLeaves: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    onLeaveToday: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedYear, setSelectedYear] = useState(currentYearStr);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modal State for viewing details / rejecting with remarks
  const [selectedLeaveForModal, setSelectedLeaveForModal] = useState(null);
  const [rejectRemark, setRejectRemark] = useState('');
  const [isRejectingModal, setIsRejectingModal] = useState(false);

  const fetchLeavesData = async () => {
    try {
      setIsLoading(true);
      const [leavesRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/leaves/all`),
        axios.get(`${API_BASE_URL}/api/leaves/stats`)
      ]);
      setLeaves(leavesRes.data || []);
      setStats(statsRes.data || {
        totalLeaves: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        onLeaveToday: 0
      });
    } catch (err) {
      console.error('Error fetching leaves data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeavesData();
  }, []);

  // Quick Approve
  const handleApprove = async (leave) => {
    try {
      setActionLoadingId(leave._id);
      await axios.put(`${API_BASE_URL}/api/leaves/${leave._id}/status`, {
        status: 'Approved',
        adminRemarks: 'Approved by Administration',
        reviewedBy: 'Admin'
      });
      await fetchLeavesData();
    } catch (err) {
      alert('Failed to approve leave: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Reject Modal
  const openRejectModal = (leave) => {
    setSelectedLeaveForModal(leave);
    setRejectRemark('');
    setIsRejectingModal(true);
  };

  // Confirm Rejection
  const handleConfirmReject = async () => {
    if (!selectedLeaveForModal) return;
    try {
      setActionLoadingId(selectedLeaveForModal._id);
      await axios.put(`${API_BASE_URL}/api/leaves/${selectedLeaveForModal._id}/status`, {
        status: 'Rejected',
        adminRemarks: rejectRemark || 'Declined as per company operational requirements',
        reviewedBy: 'Admin'
      });
      setIsRejectingModal(false);
      setSelectedLeaveForModal(null);
      await fetchLeavesData();
    } catch (err) {
      alert('Failed to reject leave: ' + (err.response?.data?.error || err.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Leave Record
  const handleDeleteLeave = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this leave record?')) {
      try {
        setActionLoadingId(id);
        await axios.delete(`${API_BASE_URL}/api/leaves/${id}`);
        await fetchLeavesData();
      } catch (err) {
        alert('Failed to delete leave record');
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  // Generate unique years for year dropdown
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    const curYear = new Date().getFullYear();
    yearsSet.add(curYear.toString());
    yearsSet.add((curYear - 1).toString());

    leaves.forEach(l => {
      if (l.startDate && l.startDate.length >= 4) {
        yearsSet.add(l.startDate.slice(0, 4));
      }
      if (l.endDate && l.endDate.length >= 4) {
        yearsSet.add(l.endDate.slice(0, 4));
      }
    });

    return Array.from(yearsSet).sort().reverse();
  }, [leaves]);

  // Filtered leaves by search, status, selected year, and selected month
  const filteredLeaves = useMemo(() => {
    return leaves.filter(l => {
      const matchSearch = 
        (l.employeeName && l.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.employeeEmail && l.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.employeeId && l.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.reason && l.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.designation && l.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (l.leaveType && l.leaveType.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'All' || l.status === statusFilter;

      // Match Year
      let matchYear = true;
      if (selectedYear !== 'All') {
        matchYear = (l.startDate && l.startDate.startsWith(selectedYear)) ||
                    (l.endDate && l.endDate.startsWith(selectedYear));
      }

      // Match Month
      let matchMonth = true;
      if (selectedMonth !== 'All') {
        if (selectedYear !== 'All') {
          const targetPrefix = `${selectedYear}-${selectedMonth}`;
          matchMonth = (l.startDate && l.startDate.startsWith(targetPrefix)) ||
                       (l.endDate && l.endDate.startsWith(targetPrefix));
        } else {
          matchMonth = (l.startDate && l.startDate.slice(5, 7) === selectedMonth) ||
                       (l.endDate && l.endDate.slice(5, 7) === selectedMonth);
        }
      }

      return matchSearch && matchStatus && matchYear && matchMonth;
    });
  }, [leaves, searchTerm, statusFilter, selectedYear, selectedMonth]);

  // Period label helper for display and Excel export
  const getSelectedPeriodLabel = () => {
    if (selectedYear === 'All' && selectedMonth === 'All') return 'ALL TIME';
    if (selectedMonth === 'All') return `YEAR ${selectedYear}`;
    const mObj = MONTHS.find(m => m.value === selectedMonth);
    const mName = mObj ? mObj.label.toUpperCase() : selectedMonth;
    return selectedYear === 'All' ? `${mName} (ALL YEARS)` : `${mName} ${selectedYear}`;
  };

  // Export to Excel
  const exportToExcel = () => {
    if (filteredLeaves.length === 0) {
      alert('No leave records to export for the selected filter.');
      return;
    }

    const timestampStr = new Date().toLocaleString();
    const periodTitle = getSelectedPeriodLabel();
    const rows = [
      ['PAULTECH SOFTWARE SERVICES (OPC) PRIVATE LIMITED'],
      [`EMPLOYEE LEAVE REPORT - ${periodTitle}`],
      [`Report Generated On: ${timestampStr} | Total Records: ${filteredLeaves.length}`],
      [''],
      [
        'S.No',
        'Employee ID',
        'Employee Name',
        'Corporate Email',
        'Role / Designation',
        'Leave Type',
        'Start Date',
        'End Date',
        'Total Days',
        'Status',
        'Reason',
        'Admin Remarks',
        'Applied Date',
        'Reviewed By'
      ]
    ];

    filteredLeaves.forEach((l, index) => {
      rows.push([
        index + 1,
        l.employeeId || 'N/A',
        l.employeeName || 'N/A',
        l.employeeEmail || 'N/A',
        l.designation || l.role || 'Team Member',
        l.leaveType || 'Casual Leave',
        l.startDate || '',
        l.endDate || '',
        l.totalDays || 1,
        l.status || 'Pending',
        l.reason || '',
        l.adminRemarks || '',
        l.appliedAt ? new Date(l.appliedAt).toLocaleDateString() : '',
        l.reviewedBy || 'N/A'
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 14 },
      { wch: 22 },
      { wch: 26 },
      { wch: 16 },
      { wch: 16 },
      { wch: 13 },
      { wch: 13 },
      { wch: 12 },
      { wch: 12 },
      { wch: 32 },
      { wch: 26 },
      { wch: 14 },
      { wch: 14 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Leaves');
    const safeYearStr = selectedYear === 'All' ? 'AllYears' : selectedYear;
    const safeMonthStr = selectedMonth === 'All' ? 'AllMonths' : selectedMonth;
    XLSX.writeFile(workbook, `PaulTech_Employee_Leaves_${safeYearStr}_${safeMonthStr}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiCalendar className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500 shrink-0" />
            Employee Leave Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review and approve leave applications, monitor active leaves, and audit company absence records.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchLeavesData}
            disabled={isLoading}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200 flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-500' : ''}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <button
            onClick={exportToExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Total Requests"
          value={stats.totalLeaves}
          subtitle="All recorded leaves"
          icon={FiCalendar}
          bgClass="bg-blue-50"
          textClass="text-blue-600"
        />
        <StatCard
          title="Pending Approval"
          value={stats.pendingCount}
          subtitle="Action needed"
          icon={FiClock}
          bgClass="bg-amber-50"
          textClass="text-amber-600"
          badgeText={stats.pendingCount > 0 ? 'Review Now' : 'Clear'}
          badgeClass={stats.pendingCount > 0 ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-600'}
        />
        <StatCard
          title="Approved Leaves"
          value={stats.approvedCount}
          subtitle="Granted leaves"
          icon={FiCheckCircle}
          bgClass="bg-emerald-50"
          textClass="text-emerald-600"
        />
        <StatCard
          title="Rejected"
          value={stats.rejectedCount}
          subtitle="Declined requests"
          icon={FiXCircle}
          bgClass="bg-rose-50"
          textClass="text-rose-600"
        />
        <StatCard
          title="On Leave Today"
          value={stats.onLeaveToday}
          subtitle="Currently out of office"
          icon={FiUser}
          bgClass="bg-purple-50"
          textClass="text-purple-600"
          badgeText={stats.onLeaveToday > 0 ? 'Active' : '0 Out'}
          badgeClass={stats.onLeaveToday > 0 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}
        />
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Bar */}
          <div className="lg:col-span-5 relative">
            <FiSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by employee name, email, ID, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
            />
          </div>

          {/* Year & Month Dual Selector */}
          <div className="lg:col-span-5 flex items-center gap-2">
            {/* Year Selector */}
            <div className="w-32 shrink-0">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                title="Select Year"
              >
                <option value="All">All Years</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div className="flex-1">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                title="Select Month"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label} {m.value !== 'All' && selectedYear !== 'All' ? `(${selectedYear})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter count indicator */}
          <div className="lg:col-span-2 text-right">
            <span className="text-xs font-semibold text-slate-500">
              Showing <span className="text-orange-600 font-bold">{filteredLeaves.length}</span> of {leaves.length} records
            </span>
          </div>
        </div>

        {/* Quick Month-Wise Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1.5 border-t border-slate-100 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <FiCalendar size={13} className="text-orange-500" />
            <span>Month:</span>
          </span>
          {MONTHS.map((m) => {
            const isSelected = selectedMonth === m.value;
            // Count leaves for this month in selected year
            const monthCount = leaves.filter(l => {
              if (m.value === 'All') {
                return selectedYear === 'All' || (l.startDate && l.startDate.startsWith(selectedYear));
              }
              const targetPrefix = selectedYear !== 'All' ? `${selectedYear}-${m.value}` : `-${m.value}-`;
              return selectedYear !== 'All'
                ? ((l.startDate && l.startDate.startsWith(targetPrefix)) || (l.endDate && l.endDate.startsWith(targetPrefix)))
                : ((l.startDate && l.startDate.slice(5, 7) === m.value) || (l.endDate && l.endDate.slice(5, 7) === m.value));
            }).length;

            return (
              <button
                key={m.value}
                onClick={() => setSelectedMonth(m.value)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25 scale-105'
                    : monthCount > 0
                    ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{m.short}</span>
                {monthCount > 0 && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white text-orange-600' : 'bg-orange-200 text-orange-800'
                  }`}>
                    {monthCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <FiFilter size={12} /> Status:
          </span>
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
              {status === 'Pending' && stats.pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                  {stats.pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Leave Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={6} />
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FiCalendar size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Leave Records Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'All' || selectedMonth
                ? 'No leaves match your applied filter criteria. Try clearing search or filters.'
                : 'No employee has applied for leave yet. Leave applications will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Leave Type</th>
                    <th className="py-3.5 px-4">Duration & Dates</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Applied On</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLeaves.map((leave) => {
                    const isProcessing = actionLoadingId === leave._id;
                    return (
                      <tr key={leave._id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Employee Name, Image, Emp ID & Role */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-orange-200 shadow-sm">
                              {leave.img ? (
                                <img src={leave.img} alt={leave.employeeName} className="w-full h-full object-cover" />
                              ) : (
                                <span>{(leave.employeeName ? leave.employeeName.charAt(0) : 'E').toUpperCase()}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs leading-tight">{leave.employeeName}</p>
                              <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold border border-slate-200/80 shrink-0">
                                  {leave.employeeId || 'N/A'}
                                </span>
                                <span className="font-semibold text-orange-600 truncate">
                                  {leave.designation || leave.role || 'Team Member'}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{leave.employeeEmail}</p>
                            </div>
                          </div>
                        </td>

                        {/* Leave Type */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${getLeaveTypeBadgeClass(leave.leaveType)}`}>
                            {leave.leaveType}
                          </span>
                        </td>

                        {/* Duration & Dates */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-900 text-xs">
                              {leave.startDate} <span className="text-slate-400 font-normal">to</span> {leave.endDate}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600">
                              <FiClock size={11} />
                              {leave.totalDays} {leave.totalDays === 1 ? 'Day' : 'Days'} Total
                            </span>
                          </div>
                        </td>

                        {/* Reason */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-slate-600 text-xs line-clamp-2" title={leave.reason}>
                            {leave.reason}
                          </p>
                          {leave.adminRemarks && (
                            <p className="text-[10px] text-emerald-700 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                              Remark: {leave.adminRemarks}
                            </p>
                          )}
                        </td>

                        {/* Applied On */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px] font-medium">
                          {leave.appliedAt ? new Date(leave.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {getStatusBadge(leave.status)}
                        </td>

                        {/* Admin Action Buttons */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Approve Button */}
                            {leave.status !== 'Approved' && (
                              <button
                                onClick={() => handleApprove(leave)}
                                disabled={isProcessing}
                                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
                                title="Approve Leave"
                              >
                                <FiCheck size={13} />
                                <span>Approve</span>
                              </button>
                            )}

                            {/* Reject Button */}
                            {leave.status !== 'Rejected' && (
                              <button
                                onClick={() => openRejectModal(leave)}
                                disabled={isProcessing}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                title="Reject Leave"
                              >
                                <FiX size={13} />
                                <span>Reject</span>
                              </button>
                            )}

                            {/* View Full Details */}
                            <button
                              onClick={() => {
                                setSelectedLeaveForModal(leave);
                                setIsRejectingModal(false);
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FiEye size={14} />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteLeave(leave._id)}
                              disabled={isProcessing}
                              className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Record"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block lg:hidden divide-y divide-slate-100">
              {filteredLeaves.map((leave) => {
                const isProcessing = actionLoadingId === leave._id;
                return (
                  <div key={leave._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-orange-200">
                          {leave.img ? (
                            <img src={leave.img} alt={leave.employeeName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{(leave.employeeName ? leave.employeeName.charAt(0) : 'E').toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{leave.employeeName}</h4>
                          <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                            <span className="px-1.5 py-0.2 bg-slate-100 font-mono font-bold text-slate-800 rounded border border-slate-200">
                              {leave.employeeId || 'N/A'}
                            </span>
                            <span className="text-orange-600 font-semibold">
                              {leave.designation || leave.role || 'Team Member'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(leave.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getLeaveTypeBadgeClass(leave.leaveType)}`}>
                        {leave.leaveType}
                      </span>
                      <span className="text-slate-700 font-semibold text-[11px]">
                        {leave.startDate} → {leave.endDate}
                      </span>
                      <span className="text-orange-600 font-extrabold text-[10px] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                        {leave.totalDays} {leave.totalDays === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Reason</span>
                      <p className="text-xs text-slate-700 font-medium">{leave.reason}</p>
                      {leave.adminRemarks && (
                        <p className="text-[10px] text-emerald-700 font-bold mt-1.5">
                          Admin Note: {leave.adminRemarks}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {leave.status !== 'Approved' && (
                        <button
                          onClick={() => handleApprove(leave)}
                          disabled={isProcessing}
                          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                        >
                          <FiCheck size={14} />
                          Approve
                        </button>
                      )}

                      {leave.status !== 'Rejected' && (
                        <button
                          onClick={() => openRejectModal(leave)}
                          disabled={isProcessing}
                          className="flex-1 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <FiX size={14} />
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteLeave(leave._id)}
                        disabled={isProcessing}
                        className="p-2 text-slate-400 hover:text-rose-600 bg-slate-100 rounded-xl"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal: View Details or Rejection Remarks */}
      {selectedLeaveForModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-orange-400" size={18} />
                <h3 className="font-bold text-sm sm:text-base">
                  {isRejectingModal ? 'Reject Leave Application' : 'Leave Request Details'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setSelectedLeaveForModal(null);
                  setIsRejectingModal(false);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Employee Header with Image, Proper ID & Role */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-base shrink-0 overflow-hidden border-2 border-orange-200 shadow-sm">
                    {selectedLeaveForModal.img ? (
                      <img src={selectedLeaveForModal.img} alt={selectedLeaveForModal.employeeName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(selectedLeaveForModal.employeeName ? selectedLeaveForModal.employeeName.charAt(0) : 'E').toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base leading-tight">{selectedLeaveForModal.employeeName}</h4>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-800 border border-slate-200">
                        {selectedLeaveForModal.employeeId || 'N/A'}
                      </span>
                      <span className="font-bold text-orange-600">
                        {selectedLeaveForModal.designation || selectedLeaveForModal.role || 'Team Member'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedLeaveForModal.employeeEmail}</p>
                  </div>
                </div>
                {getStatusBadge(selectedLeaveForModal.status)}
              </div>

              {/* Leave Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Leave Type</span>
                  <span className="font-bold text-slate-800">{selectedLeaveForModal.leaveType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Days</span>
                  <span className="font-bold text-orange-600">{selectedLeaveForModal.totalDays} Days</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Start Date</span>
                  <span className="font-bold text-slate-800">{selectedLeaveForModal.startDate}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">End Date</span>
                  <span className="font-bold text-slate-800">{selectedLeaveForModal.endDate}</span>
                </div>
              </div>

              {/* Reason */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Reason for Leave</span>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed border border-slate-200/60">
                  {selectedLeaveForModal.reason}
                </div>
              </div>

              {/* If rejecting, show remarks input */}
              {isRejectingModal ? (
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Reason for Rejection (Optional Remarks)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter reason for declining this request (e.g., Staff shortage, critical project deadline)..."
                    value={rejectRemark}
                    onChange={(e) => setRejectRemark(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              ) : (
                selectedLeaveForModal.adminRemarks && (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1">Admin Remarks</span>
                    <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium border border-emerald-200">
                      {selectedLeaveForModal.adminRemarks}
                    </div>
                  </div>
                )
              )}

              {/* Audit Timestamps */}
              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                <span>Applied: {selectedLeaveForModal.appliedAt ? new Date(selectedLeaveForModal.appliedAt).toLocaleString() : 'N/A'}</span>
                {selectedLeaveForModal.reviewedAt && (
                  <span>Reviewed: {new Date(selectedLeaveForModal.reviewedAt).toLocaleString()} ({selectedLeaveForModal.reviewedBy || 'Admin'})</span>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedLeaveForModal(null);
                  setIsRejectingModal(false);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all"
              >
                Close
              </button>

              {isRejectingModal ? (
                <button
                  onClick={handleConfirmReject}
                  disabled={actionLoadingId === selectedLeaveForModal._id}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/25 transition-all"
                >
                  Confirm Rejection
                </button>
              ) : (
                selectedLeaveForModal.status === 'Pending' && (
                  <button
                    onClick={() => {
                      handleApprove(selectedLeaveForModal);
                      setSelectedLeaveForModal(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all"
                  >
                    Approve Request
                  </button>
                )
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default ManageLeaves;
