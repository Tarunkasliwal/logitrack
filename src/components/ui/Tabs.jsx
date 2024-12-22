// /components/ui/Tabs.jsx

import React, { createContext, useContext, useState } from 'react';
import classNames from 'classnames';

// Create a Context for the Tabs
const TabsContext = createContext();

// Tabs Container
const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

// Tabs List
const TabsList = ({ children, className }) => {
  return (
    <div className={classNames('flex space-x-2', className)}>
      {children}
    </div>
  );
};

// Tabs Trigger
const TabsTrigger = ({ value, children, className }) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { activeTab, setActiveTab } = context;

  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={classNames(
        'px-4 py-2 font-medium text-sm rounded-md focus:outline-none',
        {
          'bg-blue-500 text-white': isActive,
          'bg-gray-200 text-gray-700 hover:bg-gray-300': !isActive,
        },
        className
      )}
    >
      {children}
    </button>
  );
};

// Tabs Content
const TabsContent = ({ value, children, className }) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { activeTab } = context;

  return activeTab === value ? (
    <div className={classNames(className)}>{children}</div>
  ) : null;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
