import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HabitsPage from './pages/HabitsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import { Toaster } from 'react-hot-toast';
import { getLogs, getAnalytics } from './services/logService';
import { format } from 'date-fns';

function AppShell() {
  const [page, setPage] = useState('dashboard');
  const [sideOpen, setSideOpen] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getAnalytics()
      .then(r => setStreak(r.data?.longestStreak || 0))
      .catch(() => { });
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'habits': return <HabitsPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar activePage={page} onNavigate={setPage} />
      </div>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSideOpen(false)}
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar activePage={page} onNavigate={setPage} onClose={() => setSideOpen(false)} mobile />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          streak={streak}
          activePage={page}
          onMenuClick={() => setSideOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
            <span className="text-2xl">✨</span>
          </div>
          <div className="spinner mx-auto" style={{ width: 28, height: 28, borderWidth: 3 }} />
          <p className="text-sm text-text-muted mt-3 font-medium">Loading HabitFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '13px', fontWeight: '500' },
          success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
        }}
      />
      {user ? <AppShell /> : <LoginPage />}
    </>
  );
}
