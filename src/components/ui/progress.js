// src/components/ui/Progress.js
import React from 'react';

export const Progress = ({ value, max = 100, className = '' }) => {
  const percentage = (value / max) * 100;

  return (
    <div className={`w-full bg-gray-200 rounded-full ${className}`}>
      <div
        className="bg-blue-600 h-full rounded-full transition-width duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
