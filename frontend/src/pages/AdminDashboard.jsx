import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiUsers, FiBriefcase, FiStar, FiActivity, FiRadio, FiUserPlus, FiVideo } from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import { API_BASE_URL } from '../student-app/config';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departmentStats: [],
    skillsStats: [],
    recentHires: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getTopDept = () => {
    if (!stats.departmentStats.length) return "N/A";
    const sorted = [...stats.departmentStats].sort((a, b) => b.value - a.value);
    return sorted[0].value > 0 ? sorted[0].name : "N/A";
  };

  const getTopSkill = () => {
    if (!stats.skillsStats.length) return "N/A";
    const sorted = [...stats.skillsStats].sort((a, b) => b.value - a.value);
    return sorted[0].value > 0 ? sorted[0].name : "N/A";
  };

  const colors = ['#1D4ED8', '#059669', '#D97706', '#DC2626', '#7C3AED'];

  return (
    <div className="animate-fade-in space-y-3 sm:space-y-5">
      
      {/* Native-Feel Section Header */}
      <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
            Team Analytics
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            Real-time workforce & hiring telemetry
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] sm:text-xs font-bold shrink-0 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>LIVE</span>
        </div>
      </div>

      {/* Stats Grid - 2 columns on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        <StatCard 
          title="Total Employees" 
          value={isLoading ? "..." : stats.totalEmployees.toString()} 
          icon={FiUsers} 
          trend="Active" 
          trendIsPositive={true}
          iconBgClass="bg-blue-50"
          iconTextClass="text-blue-600"
        />
        <StatCard 
          title="Top Department" 
          value={isLoading ? "..." : getTopDept()} 
          icon={FiBriefcase} 
          trend="Largest" 
          trendIsPositive={true}
          iconBgClass="bg-emerald-50"
          iconTextClass="text-emerald-600"
        />
        <StatCard 
          title="Most Needed Skill" 
          value={isLoading ? "..." : getTopSkill()} 
          icon={FiStar} 
          trend="Key Skill" 
          trendIsPositive={true}
          iconBgClass="bg-amber-50"
          iconTextClass="text-amber-600"
        />
        <StatCard 
          title="Recent Additions" 
          value={isLoading ? "..." : stats.recentHires.length.toString()} 
          icon={FiUserPlus} 
          trend="New Hires" 
          trendIsPositive={true}
          iconBgClass="bg-purple-50"
          iconTextClass="text-purple-600"
        />
      </div>

      {/* Quick Action Banner - Mobile Optimized */}
      <Link 
        to="/admin/events" 
        className="group rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-4 text-white shadow-sm flex items-center justify-between gap-3 active:scale-[0.99] transition-all border border-slate-800/80 hover:border-orange-500/30"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
            <FiVideo className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-xs sm:text-sm text-white truncate">Webinars & Bootcamps</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-orange-500/25 text-orange-300 border border-orange-500/30 shrink-0">Live</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 truncate mt-0.5">Manage virtual sessions, pricing & registrations</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700 text-white text-xs font-bold shrink-0 shadow-sm shadow-orange-500/30">
          <span>Manage</span>
          <span className="text-orange-200">→</span>
        </div>
      </Link>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5">
        
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white p-3.5 sm:p-6 md:p-8 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col">
          <div className="flex flex-row justify-between items-center gap-2 mb-2 sm:mb-4">
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight">Workforce Distribution</h2>
              <p className="text-[10px] sm:text-xs text-slate-500">By Department</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live DB</span>
            </div>
          </div>
          <div className="h-[180px] sm:h-[260px] w-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs sm:text-sm">Loading chart data...</div>
            ) : stats.departmentStats.length === 0 || stats.totalEmployees === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs sm:text-sm">No department data available yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.departmentStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} maxBarSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 11, fontWeight: 600}} 
                    tickFormatter={(val) => (val && val.length > 9 ? `${val.slice(0, 8)}..` : val)}
                    dy={6} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10}} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: '#F8FAFC'}}
                    contentStyle={{borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)'}}
                    itemStyle={{color: '#0F172A', fontWeight: 'bold'}}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {stats.departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Live Stream Box */}
        <div className="bg-white p-3.5 sm:p-6 md:p-8 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-2.5 sm:mb-4">
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight">
                Recent Onboardings
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500">Newly joined team members</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {stats.recentHires.length} Total
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar max-h-[220px] sm:max-h-[260px]">
            {isLoading ? (
               <p className="text-slate-400 text-xs sm:text-sm text-center py-4">Loading hires...</p>
            ) : stats.recentHires.length === 0 ? (
               <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center h-full min-h-[120px]">
                 <FiActivity size={20} className="mb-1 text-slate-300" />
                 <p className="font-medium text-xs">No recent hires</p>
               </div>
            ) : (
               stats.recentHires.map((hire, idx) => (
                 <div key={idx} className="flex items-center gap-2.5 p-2 sm:p-2.5 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                   <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                     {hire.firstName ? hire.firstName.charAt(0).toUpperCase() : 'E'}
                   </div>
                   <div className="min-w-0 flex-1">
                     <p className="font-bold text-slate-900 text-xs truncate">{hire.firstName} {hire.lastName}</p>
                     <p className="text-[10px] text-slate-500 truncate">{hire.designation || 'Employee'}</p>
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
