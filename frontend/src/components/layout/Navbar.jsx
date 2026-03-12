import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, Flame, ChevronDown } from 'lucide-react';

export default function Navbar({ streak, onMenuClick, activePage }) {
    const { user, logout } = useAuth();
    const [dropOpen, setDropOpen] = useState(false);

    const pageLabels = {
        dashboard: 'Dashboard',
        habits: 'My Habits',
        analytics: 'Analytics',
        settings: 'Settings',
    };

    return (
        <header className="sticky top-0 z-30 bg-white/80 glass border-b border-gray-100 px-4 lg:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-text">{pageLabels[activePage]}</h1>
                    <p className="text-xs text-text-muted hidden sm:block">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {/* Streak */}
                {streak > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-bold text-orange-600">{streak} day streak</span>
                    </div>
                )}

                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                </button>

                {/* Avatar dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropOpen(!dropOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4F46E5&color=fff`}
                            alt={user?.name}
                            className="w-8 h-8 rounded-full ring-2 ring-primary/20"
                        />
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                    </button>
                    {dropOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden animate-fade-in">
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-sm font-semibold text-text truncate">{user?.name}</p>
                                <p className="text-xs text-text-muted truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => { logout(); setDropOpen(false); }}
                                className="w-full px-4 py-2.5 text-sm text-left text-red-500 hover:bg-red-50 font-medium transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
