
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import FeedbackExplorer from './pages/FeedbackExplorer';
import ProductInsights from './pages/ProductInsights';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // A real app would have a proper auth flow
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <HashRouter>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header title={pageTitle} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard setPageTitle={setPageTitle} />} />
                <Route path="/explorer" element={<FeedbackExplorer setPageTitle={setPageTitle} />} />
                <Route path="/products" element={<ProductInsights setPageTitle={setPageTitle} />} />
                <Route path="/alerts" element={<Alerts setPageTitle={setPageTitle} />} />
                <Route path="/settings" element={<Settings setPageTitle={setPageTitle} />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
