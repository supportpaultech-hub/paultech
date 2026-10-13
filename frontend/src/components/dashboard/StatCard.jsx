import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  iconBgClass = 'bg-blue-50', 
  iconTextClass = 'text-blue-600', 
  trendIsPositive = true 
}) => {
  const displayTrend = trendValue || trend;

  return (
    <div className="bg-white p-3 sm:p-4.5 rounded-2xl border border-slate-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between min-w-0 relative overflow-hidden group">
      {/* Top Row: Icon + Badge */}
      <div className="flex items-center justify-between gap-1.5 mb-2.5">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${iconBgClass} ${iconTextClass} flex items-center justify-center shrink-0 shadow-2xs`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        
        {displayTrend && (
          <span 
            className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full truncate max-w-[65%] sm:max-w-none flex items-center gap-1 shrink-0
              ${trendIsPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-600 border border-slate-200/60'}
            `}
            title={displayTrend}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="truncate">{displayTrend}</span>
          </span>
        )}
      </div>
      
      {/* Stat Value & Label */}
      <div className="min-w-0">
        <div 
          className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight truncate leading-tight" 
          title={String(value)}
        >
          {value}
        </div>
        <div 
          className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate mt-0.5" 
          title={title}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
