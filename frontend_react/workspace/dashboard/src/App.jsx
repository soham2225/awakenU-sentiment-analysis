import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import LoginPage from './components/auth/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FeedbackExplorer from './components/FeedbackExplorer';
import AlertsPage from './components/alerts';
import ProductReviewInsights from './components/products'; // ✅ import real product component

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'explorer':
        return <FeedbackExplorer />;
      case 'analytics':
        return (
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <p className="text-gray-400">Advanced analytics coming soon...</p>
          </div>
        );
      case 'products':
        return <ProductReviewInsights />; // ✅ now loads the live products page
      case 'alerts':
        return <AlertsPage />;
      case 'settings':
        return (
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-gray-400">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
