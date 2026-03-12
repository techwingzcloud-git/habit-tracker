import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const [notifs, setNotifs] = useState(true);
    const [reminders, setReminders] = useState(false);
    const [reminderTime, setReminderTime] = useState('08:00');

    const handleSave = () => toast.success('Settings saved!');

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl">
            <div>
                <h2 className="text-2xl font-extrabold text-text">Settings</h2>
                <p className="text-text-muted text-sm mt-0.5">Manage your account and preferences</p>
            </div>

            {/* Profile card */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-text text-sm uppercase tracking-wider">Profile</h3>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4F46E5&color=fff`}
                        alt={user?.name}
                        className="w-16 h-16 rounded-full ring-4 ring-primary/20"
                    />
                    <div>
                        <p className="font-bold text-text text-lg">{user?.name}</p>
                        <p className="text-text-muted text-sm">{user?.email}</p>
                        <span className="badge bg-pastel-purple text-primary mt-1 text-xs">Google Account</span>
                    </div>
                </div>
                <p className="text-xs text-text-muted mt-3">
                    Profile information is managed through your Google account.
                </p>
            </div>

            {/* Notifications */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-text text-sm uppercase tracking-wider">Notifications</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-text">Push Notifications</p>
                            <p className="text-xs text-text-muted">Receive app notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={notifs} onChange={e => setNotifs(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-text">Daily Reminders</p>
                            <p className="text-xs text-text-muted">Get reminded to check your habits</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={reminders} onChange={e => setReminders(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    {reminders && (
                        <div className="pl-1">
                            <label className="block text-xs font-semibold text-text-muted mb-1.5">Reminder Time</label>
                            <input
                                type="time"
                                value={reminderTime}
                                onChange={e => setReminderTime(e.target.value)}
                                className="input-base !w-40"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Privacy */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-text text-sm uppercase tracking-wider">Privacy & Security</h3>
                </div>
                <div className="space-y-2">
                    {[
                        'Your habit data is fully encrypted',
                        'Data is never shared with third parties',
                        'Only you can access your habits',
                        'Google OAuth ensures secure login',
                    ].map(item => (
                        <div key={item} className="flex items-center gap-2 text-sm text-text-muted py-1">
                            <div className="w-1.5 h-1.5 bg-success rounded-full flex-shrink-0" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    Save Settings <ChevronRight className="w-4 h-4" />
                </button>
                <button
                    onClick={logout}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
          text-red-500 border-2 border-red-100 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>
        </div>
    );
}
