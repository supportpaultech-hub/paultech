import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiPlus, 
  FiAlertCircle, 
  FiTrash2, 
  FiX, 
  FiFileText, 
  FiChevronRight,
  FiInfo,
  FiShield
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';
import { TableSkeleton } from '../components/SkeletonLoader';

const StatCard = ({ title, value, icon: Icon, bgClass, textClass, badgeText, badgeClass }) => (
  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">{title}</span>
      <div className={`p-2.5 rounded-xl ${bgClass}`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${textClass}`} />
      </div>
    </div>
    <div className="mt-3">
      <div className="flex items-baseline gap-2">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        {badgeText && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {badgeText}
          </span>
        )}
      </div>
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

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Logged-in user context
  const userObj = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || '{}');
  const employeeEmail = userObj.email || userObj.username || '';
  const employeeName = userObj.firstName 
    ? `${userObj.firstName} ${userObj.lastName || ''}`.trim() 
    : (userObj.name || userObj.username || 'Employee');
  const employeeId = userObj.employeeId || '';
  const department = userObj.department || 'General';

  // Calculate duration in days
  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  const fetchMyLeaves = async () => {
    if (!employeeEmail) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/leaves/my/${encodeURIComponent(employeeEmail)}`);
      setLeaves(res.data || []);
    } catch (err) {
      console.error('Error fetching employee leaves:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, [employeeEmail]);

  // Handle Apply Leave Form Submit
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!startDate || !endDate) {
      setErrorMsg('Please select both start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMsg('End date cannot be earlier than start date.');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Please write a valid reason for your leave application.');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/api/leaves/apply`, {
        employeeId,
        employeeName,
        employeeEmail,
        department,
        designation: userObj.designation || userObj.role || 'Team Member',
        img: userObj.img || '',
        leaveType,
        startDate,
        endDate,
        reason
      });

      setSuccessMsg('Leave application submitted successfully! Admin will review your request.');
      
      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
      setLeaveType('Casual Leave');
      
      // Close modal after brief delay
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 1500);

      fetchMyLeaves();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to submit leave application.');
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel Pending Leave
  const handleCancelLeave = async (id) => {
    if (window.confirm('Are you sure you want to cancel this pending leave request?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/leaves/${id}`);
        fetchMyLeaves();
      } catch (err) {
        alert('Failed to cancel leave request: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // Metrics
  const stats = useMemo(() => {
    const total = leaves.length;
    const approved = leaves.filter(l => l.status === 'Approved').length;
    const pending = leaves.filter(l => l.status === 'Pending').length;
    const rejected = leaves.filter(l => l.status === 'Rejected').length;
    return { total, approved, pending, rejected };
  }, [leaves]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiCalendar className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500 shrink-0" />
            My Leaves & Time Off
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Apply for leave, track approval status, and check your leave records for <span className="font-semibold text-slate-800">{employeeName}</span>.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg('');
            setSuccessMsg('');
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto shrink-0"
        >
          <FiPlus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Applied"
          value={stats.total}
          icon={FiCalendar}
          bgClass="bg-blue-50"
          textClass="text-blue-600"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pending}
          icon={FiClock}
          bgClass="bg-amber-50"
          textClass="text-amber-600"
          badgeText={stats.pending > 0 ? 'In Review' : 'None'}
          badgeClass={stats.pending > 0 ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-500'}
        />
        <StatCard
          title="Approved Leaves"
          value={stats.approved}
          icon={FiCheckCircle}
          bgClass="bg-emerald-50"
          textClass="text-emerald-600"
        />
        <StatCard
          title="Rejected Requests"
          value={stats.rejected}
          icon={FiXCircle}
          bgClass="bg-rose-50"
          textClass="text-rose-600"
        />
      </div>

      {/* Leave Application History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiFileText className="text-orange-500" />
            Leave History & Status
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            Total {leaves.length} Record{leaves.length === 1 ? '' : 's'}
          </span>
        </div>

        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={4} columns={5} />
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FiCalendar size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Leaves Applied Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You haven't submitted any leave applications yet. Click the "Apply for Leave" button above to request time off.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Leave Type</th>
                    <th className="py-3.5 px-4">Duration & Dates</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Applied On</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Leave Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${getLeaveTypeBadgeClass(leave.leaveType)}`}>
                          {leave.leaveType}
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900 text-xs">
                            {leave.startDate} <span className="text-slate-400 font-normal">to</span> {leave.endDate}
                          </span>
                          <span className="text-[10px] font-bold text-orange-600">
                            {leave.totalDays} {leave.totalDays === 1 ? 'Day' : 'Days'} Total
                          </span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-700 text-xs line-clamp-2" title={leave.reason}>
                          {leave.reason}
                        </p>
                        {leave.adminRemarks && (
                          <p className="text-[10px] text-emerald-700 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                            Admin: {leave.adminRemarks}
                          </p>
                        )}
                      </td>

                      {/* Applied On */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        {leave.appliedAt ? new Date(leave.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {getStatusBadge(leave.status)}
                      </td>

                      {/* Action (Cancel if pending) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {leave.status === 'Pending' ? (
                          <button
                            onClick={() => handleCancelLeave(leave._id)}
                            className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all"
                            title="Cancel Application"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">Recorded</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {leaves.map((leave) => (
                <div key={leave._id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getLeaveTypeBadgeClass(leave.leaveType)}`}>
                      {leave.leaveType}
                    </span>
                    {getStatusBadge(leave.status)}
                  </div>

                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      {leave.startDate} → {leave.endDate}
                    </span>
                    <span className="text-orange-600 font-extrabold text-[10px] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {leave.totalDays} {leave.totalDays === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700 border border-slate-100">
                    <p className="font-medium">{leave.reason}</p>
                    {leave.adminRemarks && (
                      <p className="text-[10px] text-emerald-700 font-bold mt-1.5">
                        Admin Note: {leave.adminRemarks}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      Applied: {leave.appliedAt ? new Date(leave.appliedAt).toLocaleDateString() : '-'}
                    </span>
                    {leave.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelLeave(leave._id)}
                        className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Apply for Leave Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-orange-400" size={18} />
                <h3 className="font-bold text-sm sm:text-base">Apply for Leave</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleApplyLeave} className="p-5 sm:p-6 space-y-4">
              
              {/* Alert notifications */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                  <FiAlertCircle className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                  <FiCheckCircle className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Employee Quick Info Badge */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-orange-200">
                    {userObj.img ? (
                      <img src={userObj.img} alt={employeeName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(employeeName ? employeeName.charAt(0) : 'E').toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block leading-tight">{employeeName}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 mt-0.5 inline-block">
                      {employeeId || 'ID: N/A'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Role</span>
                  <span className="font-bold text-orange-600">{userObj.designation || userObj.role || 'Team Member'}</span>
                </div>
              </div>

              {/* Leave Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (Medical / Health)</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Earned Leave">Earned / Privilege Leave</option>
                  <option value="Maternity/Paternity Leave">Maternity / Paternity Leave</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Calculated Days Banner */}
              {calculatedDays > 0 && (
                <div className="p-2.5 bg-orange-50 border border-orange-200/80 rounded-xl text-xs flex items-center justify-between text-orange-800">
                  <span className="font-semibold flex items-center gap-1.5">
                    <FiClock /> Total Requested Duration:
                  </span>
                  <span className="font-black text-sm bg-orange-500 text-white px-2 py-0.5 rounded-lg">
                    {calculatedDays} {calculatedDays === 1 ? 'Day' : 'Days'}
                  </span>
                </div>
              )}

              {/* Reason textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Reason for Leave <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide clear details for taking leave (e.g., family function, fever/illness, personal errands)..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default EmployeeLeaves;
