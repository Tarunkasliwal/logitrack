// src/components/ui/Card.js
import React from 'react';

export const Card = ({ children }) => (
  <div className="border rounded-lg p-4 shadow-md bg-white">{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="mb-4 border-b pb-2 text-lg font-semibold">{children}</div>
);

export const CardContent = ({ children }) => (
  <div>{children}</div>
);
