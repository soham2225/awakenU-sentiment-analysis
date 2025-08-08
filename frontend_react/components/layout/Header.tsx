
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
      <div className="flex items-center space-x-4">
        {/* Placeholder for future items like notifications or user menu */}
        <div className="flex items-center">
            <img 
                src="https://picsum.photos/40" 
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
            />
            <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Alex Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
