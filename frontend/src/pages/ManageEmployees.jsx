import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { 
  FiPlus, 
  FiMoreVertical, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiEyeOff, 
  FiCopy, 
  FiCheck, 
  FiX, 
  FiKey, 
  FiShield,
  FiLock,
  FiSave,
  FiUsers
} from 'react-icons/fi';
import AddEmployeeModal from '../components/dashboard/AddEmployeeModal';
import EditEmployeeModal from '../components/dashboard/EditEmployeeModal';
import { API_BASE_URL } from '../student-app/config';
import { TableSkeleton } from '../components/SkeletonLoader';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingCredentials, setViewingCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Change Password state inside Credentials Modal
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/employees`);
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/auth/employees/${id}`);
        fetchEmployees();
        setOpenDropdownId(null);
      } catch (err) {
        alert("Failed to delete employee: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleChangePassword = async () => {
    if (!newPasswordInput || newPasswordInput.length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }

    try {
      setPasswordUpdating(true);
      const res = await axios.put(`${API_BASE_URL}/api/auth/employees/${viewingCredentials._id}/password`, {
        newPassword: newPasswordInput
      });

      alert('Password updated successfully!');
      
      // Update viewingCredentials state with new password
      setViewingCredentials({
        ...viewingCredentials,
        plainPassword: newPasswordInput
      });

      setIsChangingPassword(false);
      setNewPasswordInput('');
      fetchEmployees();
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Failed to update password.');
    } finally {
      setPasswordUpdating(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiUsers className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0" />
            Manage Employees
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            View employee profiles, check login credentials, and reset passwords.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-xs sm:text-sm shrink-0"
        >
          <FiPlus size={18} /> Add Employee
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 font-medium text-xs sm:text-sm">
              {error}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-500">
              <thead className="bg-slate-50 text-[11px] sm:text-xs uppercase text-slate-700 font-bold border-b border-slate-100 whitespace-nowrap">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Employee</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Role & Dept</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center">Credentials</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-3 sm:px-6 py-8 text-center text-slate-400">
                      No employees found. Click "Add Employee" to create one.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0 overflow-hidden border border-orange-200 text-xs sm:text-base">
                          {emp.img ? (
                            <img src={emp.img} alt={emp.firstName} className="w-full h-full object-cover" />
                          ) : (
                            (emp.firstName?.charAt(0) || emp.username.charAt(0)).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] sm:text-xs text-slate-500 font-mono mt-0.5">{emp.employeeId ? `ID: ${emp.employeeId}` : emp.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">{emp.designation || emp.role}</p>
                      <p className="text-[11px] sm:text-xs text-slate-500">{emp.department || 'N/A'}</p>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 w-max border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                      </span>
                    </td>

                    {/* Eye Button to View ID & Password Credentials */}
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <button
                        onClick={() => {
                          setViewingCredentials(emp);
                          setShowPassword(false);
                          setIsChangingPassword(false);
                          setNewPasswordInput('');
                        }}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-[10px] sm:text-xs font-bold transition-all border border-slate-200 whitespace-nowrap"
                        title="View Employee Credentials"
                      >
                        <FiEye className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-orange-500" />
                        <span>View ID & Pass</span>
                      </button>
                    </td>

                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right relative">
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === emp._id ? null : emp._id)}
                        className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <FiMoreVertical size={18} />
                      </button>
                      
                      {openDropdownId === emp._id && (
                        <div ref={dropdownRef} className="absolute right-8 top-10 w-44 bg-white border border-slate-100 shadow-xl rounded-xl py-1 z-50 text-left animate-fade-in">
                          <button 
                            onClick={() => { 
                              setViewingCredentials(emp); 
                              setShowPassword(false); 
                              setIsChangingPassword(false);
                              setOpenDropdownId(null); 
                            }}
                            className="w-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 flex items-center gap-2 transition-colors"
                          >
                            <FiEye size={14} className="text-orange-500" /> View Credentials
                          </button>
                          <button 
                            onClick={() => { setEditingEmployee(emp); setOpenDropdownId(null); }}
                            className="w-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                          >
                            <FiEdit2 size={14} /> Edit Profile
                          </button>
                          <button 
                            onClick={() => handleDelete(emp._id)}
                            className="w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                          >
                            <FiTrash2 size={14} /> Delete Profile
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchEmployees}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal 
        isOpen={!!editingEmployee} 
        onClose={() => setEditingEmployee(null)} 
        onSuccess={() => { setEditingEmployee(null); fetchEmployees(); }}
        employee={editingEmployee}
      />

      {/* Employee Credentials View Modal Portal */}
      {viewingCredentials && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => {
                setViewingCredentials(null);
                setIsChangingPassword(false);
                setNewPasswordInput('');
              }}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
            >
              <FiX size={20} />
            </button>

            {/* Employee Header */}
            <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl overflow-hidden border border-orange-200 shrink-0">
                {viewingCredentials.img ? (
                  <img src={viewingCredentials.img} alt={viewingCredentials.firstName} className="w-full h-full object-cover" />
                ) : (
                  (viewingCredentials.firstName?.charAt(0) || 'E').toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {viewingCredentials.firstName} {viewingCredentials.lastName}
                </h3>
                <p className="text-xs font-semibold text-slate-500">{viewingCredentials.designation || 'Employee'} • {viewingCredentials.department || 'General'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <FiKey className="text-orange-500" /> Employee Credentials
                </span>

                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <FiLock className="text-blue-500" />
                  {isChangingPassword ? 'Cancel Reset' : 'Change Password'}
                </button>
              </div>

              {/* Employee ID */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Employee ID</span>
                  <button
                    onClick={() => handleCopy(viewingCredentials.employeeId || 'N/A', 'employeeId')}
                    className="text-xs text-orange-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    {copiedField === 'employeeId' ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
                    {copiedField === 'employeeId' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="font-mono font-bold text-slate-900 text-sm">
                  {viewingCredentials.employeeId || 'EMP-NOT-SET'}
                </p>
              </div>

              {/* Login Email / Username */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Login Email / Username</span>
                  <button
                    onClick={() => handleCopy(viewingCredentials.username || '', 'username')}
                    className="text-xs text-orange-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    {copiedField === 'username' ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
                    {copiedField === 'username' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="font-mono font-bold text-slate-900 text-sm truncate">
                  {viewingCredentials.username}
                </p>
              </div>

              {/* Password Field with Eye Toggle */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Current Password</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-slate-600 font-bold flex items-center gap-1 hover:text-slate-900"
                    >
                      {showPassword ? <FiEyeOff className="text-slate-500" /> : <FiEye className="text-orange-500" />}
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => handleCopy(viewingCredentials.plainPassword || 'paultech@123', 'password')}
                      className="text-xs text-orange-600 font-bold flex items-center gap-1 hover:underline"
                    >
                      {copiedField === 'password' ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
                      {copiedField === 'password' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="font-mono font-bold text-slate-900 text-sm">
                  {showPassword ? (viewingCredentials.plainPassword || 'paultech@123') : '••••••••••••'}
                </p>
              </div>

              {/* Change Password Inline Section */}
              {isChangingPassword && (
                <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-3 animate-fade-in">
                  <label className="block text-xs font-bold text-blue-900">Enter New Password for Employee:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. NewPass@2026"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-white border border-blue-200 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleChangePassword}
                      disabled={passwordUpdating}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1 shrink-0 disabled:opacity-50"
                    >
                      <FiSave size={14} />
                      {passwordUpdating ? 'Updating...' : 'Save Password'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
              <FiShield className="text-slate-400 shrink-0" />
              <span>Admin Confidential. Credentials management portal.</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManageEmployees;
