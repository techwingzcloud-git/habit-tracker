import { useEffect, useState, useCallback } from 'react';
import TodayChecklist from '../components/habits/TodayChecklist';
import WeeklyGrid from '../components/habits/WeeklyGrid';
import StatsPanel from '../components/analytics/StatsPanel';
import HabitHeatmap from '../components/analytics/HabitHeatmap';
import { getHabits } from '../services/habitService';
import { getLogs, getAnalytics } from '../services/logService';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
    const { user } = useAuth();
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const today = format(new Date(), 'yyyy-MM-dd');
            const [hRes, lRes, aRes] = await Promise.all([
                getHabits(),
                getLogs({ startDate: format(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd'), endDate: today }),
                getAnalytics(),
            ]);
            setHabits(hRes.data.habits || []);
            setLogs(lRes.data.logs || []);
            setAnalytics(aRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="spinner mx-auto mb-3" style={{ width: 32, height: 32, borderWidth: 3 }} />
                    <p className="text-sm text-text-muted">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Greeting */}
            <div className="flex items-center gap-3">
                <div>
                    <h2 className="text-2xl font-extrabold text-text">
                        {greeting}, {user?.name?.split(' ')[0]}! {hour < 12 ? '☀️' : hour < 17 ? '🌤️' : '🌙'}
                    </h2>
                    <p className="text-text-muted text-sm mt-0.5">
                        {analytics?.weeklyRate >= 80
                            ? "You're on fire this week! Keep going 🔥"
                            : "Let's build some great habits today!"}
                    </p>
                </div>
            </div>

            {/* Top row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Today checklist - takes 2 cols */}
                <div className="xl:col-span-2">
                    <TodayChecklist habits={habits} logs={logs} onToggle={load} />
                </div>
                {/* Stats panel */}
                <div className="xl:col-span-1">
                    <StatsPanel analytics={analytics} />
                </div>
            </div>

            {/* Weekly Grid */}
            <WeeklyGrid habits={habits} logs={logs} onToggle={load} />

            {/* Heatmap */}
            <HabitHeatmap logs={logs} habitId={null} />
        </div>
    );
}
