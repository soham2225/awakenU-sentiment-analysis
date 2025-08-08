
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { ChartPieIcon, SearchIcon, PackageIcon, BellIcon, SettingsIcon, SunIcon, MoonIcon } from '../../constants';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: ChartPieIcon },
  { to: '/explorer', label: 'Explorer', icon: SearchIcon },
  { to: '/products', label: 'Products', icon: PackageIcon },
  { to: '/alerts', label: 'Alerts', icon: BellIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const baseLinkClasses = "flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200";
  const activeLinkClasses = "bg-blue-500 text-white dark:bg-blue-600 dark:text-white hover:bg-blue-500 dark:hover:bg-blue-600";
  
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sentily</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'light' ? <MoonIcon className="h-5 w-5 mr-2" /> : <SunIcon className="h-5 w-5 mr-2" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
