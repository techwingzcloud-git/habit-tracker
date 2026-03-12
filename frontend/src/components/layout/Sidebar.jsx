import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, CheckSquare, BarChart2, Settings,
    Sparkles, LogOut, X
} from 'lucide-react';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'My Habits', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, onNavigate, onClose, mobile }) {
    const { user, logout } = useAuth();

    return (
        <aside className="flex flex-col h-full bg-white border-r border-gray-100 w-64 py-6 px-4">
            {/* Logo */}
            <div className="flex items-center justify-between mb-8 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-soft">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-gradient">HabitFlow</span>
                </div>
                {mobile && (
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* User mini profile */}
            <div className="flex items-center gap-3 px-3 py-3 bg-pastel-purple rounded-xl mb-6">
                <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff`}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30"
                />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{user?.name}</p>
                    <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => { onNavigate(id); if (onClose) onClose(); }}
                        className={`sidebar-link w-full ${activePage === id ? 'active' : ''}`}
                    >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {label}
                    </button>
                ))}
            </nav>

            {/* Logout */}
            <button
                onClick={logout}
                className="sidebar-link w-full mt-4 text-red-400 hover:bg-red-50 hover:text-red-500"
            >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Sign Out
            </button>
        </aside>
    );
}
