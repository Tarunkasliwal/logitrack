// src/components/ui/input.js
import React from 'react';

export const Input = ({ id, type = 'text', className = '', ...props }) => {
  return (
    <input
      id={id}
      type={type}
      className={`border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm ${className}`}
      {...props}
    />
  );
};
