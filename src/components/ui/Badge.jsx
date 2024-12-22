// /components/ui/Badge.jsx

import React from 'react';
import classNames from 'classnames';

const variantClasses = {
  default: 'bg-gray-200 text-gray-800',
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-500 text-white',
  success: 'bg-green-500 text-white',
  destructive: 'bg-red-500 text-white',
  info: 'bg-blue-300 text-blue-800',
  warning: 'bg-yellow-400 text-yellow-800',
};

const Badge = ({ variant = 'default', children, className, ...props }) => {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
