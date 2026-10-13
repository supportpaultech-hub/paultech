import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiSettings, FiSave, FiLock, FiGlobe, FiDatabase, 
  FiCheckCircle, FiShield, FiKey, FiEye, FiEyeOff, 
  FiDownload, FiRefreshCw, FiAlertTriangle, FiPhone, FiMail
} from 'react-icons/fi';
import { API_BASE_URL } from '../student-app/config';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Settings State
  const [settings, setSettings] = useState({
    companyName: 'PaulTech Software Services',
    supportEmail: 'support@paultech.com',
    supportPhone: '+91 98765 43210',
    allowEmployeeRegistration: false,
    strictDeviceTracking: true,
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing scheduled maintenance and system performance upgrades to serve you better. We will be back online shortly!',
    maintenanceEstimatedEndTime: 'Under 2 Hours',

    sessionTimeout: '24h',
    twoFactorAuth: 'optional',
    minPasswordLength: 6,
    maxLoginAttempts: 5,

    primaryLanguage: 'en-US',
    timezone: 'Asia/Kolkata (IST - UTC+05:30)',
    dateFormat: 'YYYY-MM-DD',
    currencySymbol: '₹',

    autoBackupSchedule: 'daily',
    lastBackupDate: null
  });

  // Admin Change Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passMessage, setPassMessage] = useState({ type: '', text: '' });

  // Backup Generation State
  const [generatingBackup, setGeneratingBackup] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/settings`);
      if (res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      await axios.put(`${API_BASE_URL}/api/settings`, settings);
      setMessage({ type: 'success', text: 'System settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleAdminChangePassword = async (e) => {
    e.preventDefault();
    setPassMessage({ type: '', text: '' });

    if (!passwordData.newPassword || passwordData.newPassword.length < 4) {
      setPassMessage({ type: 'error', text: 'New password must be at least 4 characters long.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    try {
      setUpdatingPassword(true);
      const res = await axios.put(`${API_BASE_URL}/api/auth/admin/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPassMessage({ type: 'success', text: res.data.message || 'Admin password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPassMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Password Change Error:', err);
      setPassMessage({ type: 'error', text: err.response?.data?.error || 'Failed to change password.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleGenerateBackup = async () => {
    try {
      setGeneratingBackup(true);
      const res = await axios.post(`${API_BASE_URL}/api/settings/backup`);
      
      // Update last backup date in state
      setSettings(prev => ({ ...prev, lastBackupDate: new Date() }));

      // Create downloadable JSON file
      const backupJson = JSON.stringify(res.data.backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `paultech_db_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Backup Generated Successfully!\nSummary:\n- Events: ${res.data.summary.eventsCount}\n- Users/Employees: ${res.data.summary.usersCount}\n- Certificates: ${res.data.summary.certificatesCount}\n- Inquiries: ${res.data.summary.enquiriesCount}`);
    } catch (err) {
      console.error('Backup Error:', err);
      alert('Failed to generate backup: ' + (err.response?.data?.error || err.message));
    } finally {
      setGeneratingBackup(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12 font-sans">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiSettings className="w-6 sm:w-7 h-6 sm:h-7 text-orange-500 shrink-0" />
            System Settings
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Configure core platform parameters, admin security, localization, and database backups.
          </p>
        </div>
        
        <button 
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto text-xs sm:text-sm shrink-0"
        >
          {saving ? <FiRefreshCw className="animate-spin" size={18} /> : <FiSave size={18} />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Global Message Banner */}
      {message.text && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {message.type === 'success' ? <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <FiAlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Settings Navigation Sidebar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-3 h-max flex flex-col gap-1.5">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-left transition-all text-xs sm:text-sm ${
              activeTab === 'general' ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FiSettings size={18} className={activeTab === 'general' ? 'text-orange-500' : 'text-slate-400'} /> 
            <span>General</span>
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-left transition-all text-xs sm:text-sm ${
              activeTab === 'security' ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FiLock size={18} className={activeTab === 'security' ? 'text-orange-500' : 'text-slate-400'} /> 
            <span>Security</span>
          </button>

          <button 
            onClick={() => setActiveTab('localization')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-left transition-all text-xs sm:text-sm ${
              activeTab === 'localization' ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FiGlobe size={18} className={activeTab === 'localization' ? 'text-orange-500' : 'text-slate-400'} /> 
            <span>Localization</span>
          </button>

          <button 
            onClick={() => setActiveTab('backups')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-left transition-all text-xs sm:text-sm ${
              activeTab === 'backups' ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FiDatabase size={18} className={activeTab === 'backups' ? 'text-orange-500' : 'text-slate-400'} /> 
            <span>Backups</span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-6 md:p-8">
          
          {/* 1. GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FiSettings className="text-orange-500" /> General Configuration
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Basic company profile and core platform switches</p>
              </div>
              
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">Company Name</label>
                  <input 
                    type="text" 
                    value={settings.companyName} 
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all font-medium text-xs sm:text-sm" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
                      <FiMail className="text-slate-400" /> Support Email
                    </label>
                    <input 
                      type="email" 
                      value={settings.supportEmail} 
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all font-medium text-xs sm:text-sm" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
                      <FiPhone className="text-slate-400" /> Support Phone
                    </label>
                    <input 
                      type="text" 
                      value={settings.supportPhone} 
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all font-medium text-xs sm:text-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-900">Features Toggle</label>
                  
                  {/* Toggle 1: Employee Registration */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">Allow Employee Self-Registration</p>
                      <p className="text-xs text-slate-500 mt-0.5">If enabled, employees can sign up themselves. Otherwise, only Admins can create profiles.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, allowEmployeeRegistration: !settings.allowEmployeeRegistration })}
                      className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${
                        settings.allowEmployeeRegistration ? 'bg-orange-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        settings.allowEmployeeRegistration ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 2: Strict Device Tracking */}
                  <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-200/80">
                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">Strict Device Tracking & Audit Logs</p>
                      <p className="text-xs text-slate-600 mt-0.5">Logs IP address and device signatures for every admin and employee login.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, strictDeviceTracking: !settings.strictDeviceTracking })}
                      className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${
                        settings.strictDeviceTracking ? 'bg-orange-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        settings.strictDeviceTracking ? 'right-1' : 'left-1'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 3: Website Under Maintenance Mode */}
                  <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    settings.maintenanceMode 
                      ? 'bg-rose-50/70 border-rose-300 shadow-sm' 
                      : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">Website Under Maintenance Mode</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            settings.maintenanceMode 
                              ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {settings.maintenanceMode ? '● Maintenance Active' : '● Live Mode'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          When turned ON, all public visitors will see the dedicated Under Maintenance screen. Admin dashboard remains fully accessible.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                        className={`w-14 h-7 rounded-full relative transition-colors shrink-0 ${
                          settings.maintenanceMode ? 'bg-rose-600 ring-2 ring-rose-600/30' : 'bg-slate-300'
                        }`}
                      >
                        <span className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${
                          settings.maintenanceMode ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    {/* Extended options when Maintenance Mode is ON */}
                    {settings.maintenanceMode && (
                      <div className="mt-4 pt-4 border-t border-rose-200/80 space-y-3 animate-fade-in">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-800">
                            Custom Maintenance Notice Message
                          </label>
                          <textarea
                            rows={2}
                            value={settings.maintenanceMessage || ''}
                            onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                            placeholder="We are currently upgrading our systems. We will be back online shortly!"
                            className="w-full bg-white border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-800">
                            Estimated Completion Time
                          </label>
                          <input
                            type="text"
                            value={settings.maintenanceEstimatedEndTime || ''}
                            onChange={(e) => setSettings({ ...settings, maintenanceEstimatedEndTime: e.target.value })}
                            placeholder="e.g. Under 2 Hours, or Today by 9:00 PM IST"
                            className="w-full bg-white border border-rose-200 rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
                  >
                    <FiSave size={16} /> Save General Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FiShield className="text-orange-500" /> Security & Admin Password
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Change Admin credentials and manage platform security policies</p>
              </div>

              {/* Section A: Admin Change Password Form */}
              <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 max-w-2xl">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <FiKey className="text-orange-500" /> Change Admin Password
                </h3>
                <p className="text-xs text-slate-500">Update your super-admin login password securely.</p>

                {passMessage.text && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    passMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {passMessage.text}
                  </div>
                )}

                <form onSubmit={handleAdminChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Current Admin Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:border-orange-500 transition-all text-xs sm:text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
                      <div className="relative">
                        <input 
                          type={showNewPass ? 'text' : 'password'}
                          required
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Min 4 characters"
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:border-orange-500 transition-all text-xs sm:text-sm pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
                      <input 
                        type="password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Re-enter new password"
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:border-orange-500 transition-all text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
                  >
                    {updatingPassword ? <FiRefreshCw className="animate-spin" /> : <FiKey />}
                    <span>{updatingPassword ? 'Updating Password...' : 'Update Admin Password'}</span>
                  </button>
                </form>
              </div>

              {/* Section B: Security Policies */}
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Authentication & Session Rules</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Session Inactivity Timeout</label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="24h">24 Hours (Standard)</option>
                      <option value="12h">12 Hours</option>
                      <option value="8h">8 Hours (Workshift)</option>
                      <option value="1h">1 Hour (Strict)</option>
                      <option value="30m">30 Minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Two-Factor Authentication (2FA)</label>
                    <select
                      value={settings.twoFactorAuth}
                      onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="optional">Optional for All Users</option>
                      <option value="required_admin">Required for Admin Only</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Password Length</label>
                    <select
                      value={settings.minPasswordLength}
                      onChange={(e) => setSettings({ ...settings, minPasswordLength: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value={4}>4 Characters (Basic)</option>
                      <option value={6}>6 Characters (Default)</option>
                      <option value={8}>8 Characters (Strong)</option>
                      <option value={10}>10+ Characters (High Security)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Max Failed Login Attempts</label>
                    <select
                      value={settings.maxLoginAttempts}
                      onChange={(e) => setSettings({ ...settings, maxLoginAttempts: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value={3}>3 Attempts before temporary lock</option>
                      <option value={5}>5 Attempts (Recommended)</option>
                      <option value={10}>10 Attempts</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
                  >
                    <FiSave size={16} /> Save Security Policies
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. LOCALIZATION TAB */}
          {activeTab === 'localization' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FiGlobe className="text-orange-500" /> Localization & Regional Settings
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Configure default language, timezone, date formatting, and currency symbols</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Language</label>
                    <select
                      value={settings.primaryLanguage}
                      onChange={(e) => setSettings({ ...settings, primaryLanguage: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-IN">English (India)</option>
                      <option value="hi-IN">Hindi (हिंदी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Default Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="Asia/Kolkata (IST - UTC+05:30)">Asia/Kolkata (IST - UTC+05:30)</option>
                      <option value="UTC">Coordinated Universal Time (UTC)</option>
                      <option value="America/New_York (EST)">America/New_York (EST)</option>
                      <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date Display Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-09-10)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 10/09/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 09/10/2026)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Currency Symbol</label>
                    <select
                      value={settings.currencySymbol}
                      onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="₹">₹ (INR - Indian Rupee)</option>
                      <option value="$">$ (USD - US Dollar)</option>
                      <option value="€">€ (EUR - Euro)</option>
                      <option value="£">£ (GBP - British Pound)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
                  >
                    <FiSave size={16} /> Save Localization Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. BACKUPS TAB */}
          {activeTab === 'backups' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FiDatabase className="text-orange-500" /> Database Backups & Export
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage automated backup schedules and export instant database snapshots</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Backup Status Box */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500">LAST BACKUP STATUS</span>
                  <p className="text-slate-900 font-bold text-sm sm:text-base">
                    {settings.lastBackupDate ? new Date(settings.lastBackupDate).toLocaleString() : 'No Backup Exported Yet'}
                  </p>
                  <p className="text-xs text-slate-500">Auto Backup: <span className="font-bold text-emerald-600 uppercase">{settings.autoBackupSchedule}</span></p>
                </div>

                {/* Instant Backup Generator Button Box */}
                <div className="p-5 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Instant System Data Export</h4>
                    <p className="text-xs text-slate-600 mt-1">Export full JSON backup containing events, employees, inquiries, certificates, and projects.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateBackup}
                    disabled={generatingBackup}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {generatingBackup ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
                    <span>{generatingBackup ? 'Exporting System Backup...' : 'Generate & Download Instant Backup'}</span>
                  </button>
                </div>
              </div>

              {/* Backup Schedule Form */}
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl pt-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Automated Schedule Configuration</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Auto Backup Schedule Frequency</label>
                  <select
                    value={settings.autoBackupSchedule}
                    onChange={(e) => setSettings({ ...settings, autoBackupSchedule: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 transition-all text-xs sm:text-sm"
                  >
                    <option value="daily">Daily Auto-Backup (Recommended)</option>
                    <option value="weekly">Weekly Auto-Backup</option>
                    <option value="monthly">Monthly Auto-Backup</option>
                    <option value="off">Turn Off Auto-Backup</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
                  >
                    <FiSave size={16} /> Save Backup Schedule
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
