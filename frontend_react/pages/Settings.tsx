
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { PageProps } from '../types';
import { useTheme } from '../hooks/useTheme';

type Tab = 'platforms' | 'apikeys' | 'users' | 'theme';

const Settings: React.FC<PageProps> = ({ setPageTitle }) => {
  useEffect(() => {
    setPageTitle('Settings');
  }, [setPageTitle]);
    
  const [activeTab, setActiveTab] = useState<Tab>('platforms');
  const { theme, toggleTheme } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'platforms':
        return <p>Manage connections to Gmail, Reddit, Twitter, etc.</p>;
      case 'apikeys':
        return <p>Manage API keys for integrations.</p>;
      case 'users':
        return <p>Manage user roles and permissions.</p>;
      case 'theme':
        return (
           <div>
              <p className="mb-4">Choose your preferred interface theme.</p>
              <div className="flex items-center space-x-4">
                  <label htmlFor="theme-toggle" className="flex items-center cursor-pointer">
                      <div className="relative">
                          <input type="checkbox" id="theme-toggle" className="sr-only" checked={theme === 'dark'} onChange={toggleTheme} />
                          <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${theme === 'dark' ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </div>
                  </label>
              </div>
          </div>
        );
      default:
        return null;
    }
  };

  const TabButton: React.FC<{tab: Tab, label: string}> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    >
      {label}
    </button>
  );

  return (
    <Card title="Application Settings">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 space-x-2">
        <TabButton tab="platforms" label="Connected Platforms" />
        <TabButton tab="apikeys" label="API Keys" />
        <TabButton tab="users" label="Users & Roles" />
        <TabButton tab="theme" label="Theme" />
      </div>
      <div className="text-gray-700 dark:text-gray-300">
        {renderContent()}
      </div>
    </Card>
  );
};

export default Settings;
