import React from 'react';

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 animate-pulse space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner Skeleton */}
      <div className="w-full h-48 sm:h-64 bg-slate-200/80 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="h-12 bg-slate-200/80 rounded-2xl w-full sm:w-80"></div>
        <div className="h-12 bg-slate-200/80 rounded-2xl w-full sm:w-96"></div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white p-5 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
            <div className="h-44 bg-slate-200/80 rounded-2xl w-full"></div>
            <div className="h-5 bg-slate-200/80 rounded-xl w-3/4"></div>
            <div className="h-4 bg-slate-200/80 rounded-xl w-1/2"></div>
            <div className="h-10 bg-slate-200/80 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardGridSkeleton = ({ count = 6, cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" }) => {
  return (
    <div className={`grid ${cols} gap-6 animate-pulse`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
          <div className="h-44 bg-slate-200/80 rounded-2xl w-full"></div>
          <div className="h-5 bg-slate-200/80 rounded-xl w-3/4"></div>
          <div className="h-4 bg-slate-200/80 rounded-xl w-1/2"></div>
          <div className="h-10 bg-slate-200/80 rounded-xl w-full"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 animate-pulse space-y-4 shadow-sm">
      <div className="h-8 bg-slate-200/80 rounded-xl w-1/4"></div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-10 h-10 rounded-full bg-slate-200/80 shrink-0"></div>
              <div className="h-4 bg-slate-200/80 rounded-lg w-full"></div>
            </div>
            <div className="h-4 bg-slate-200/80 rounded-lg w-1/5"></div>
            <div className="h-4 bg-slate-200/80 rounded-lg w-1/6"></div>
            <div className="h-8 bg-slate-200/80 rounded-xl w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-10 bg-slate-200/80 rounded-2xl w-64"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-28 bg-slate-200/80 rounded-2xl"></div>
        ))}
      </div>
      <div className="h-96 bg-slate-200/80 rounded-3xl"></div>
    </div>
  );
};

export default PageSkeleton;
