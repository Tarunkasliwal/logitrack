// src/components/ui/select.js
import React, { useState } from 'react';

export const Select = ({ children, className = '', ...props }) => {
  return (
    <select className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${className}`} {...props}>
      {children}
    </select>
  );
};

export const SelectTrigger = ({ onClick, children }) => {
  return (
    <button
      className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const SelectValue = ({ value }) => {
  return <span>{value}</span>;
};

export const SelectContent = ({ children }) => {
  return <div className="border border-gray-300 rounded-md">{children}</div>;
};

export const SelectItem = ({ value, children, onSelect }) => {
  return (
    <div
      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
};
