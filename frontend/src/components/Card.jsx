import React from 'react';

const Card = ({ children, className = '', highlight = false }) => {
  return (
    <div className={`bg-white rounded-xl p-8 border transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 ${highlight ? 'border-blue-500 shadow-blue-100 ring-1 ring-blue-500' : 'border-slate-100'} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
