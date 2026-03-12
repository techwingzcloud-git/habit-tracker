import { useEffect, useState, useCallback } from 'react';
import HabitCard from '../components/habits/HabitCard';
import HabitModal from '../components/habits/HabitModal';
import WeeklyGrid from '../components/habits/WeeklyGrid';
import { getHabits } from '../services/habitService';
import { getLogs, getAnalytics } from '../services/logService';
import { Plus, Search } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function HabitsPage() {
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editHabit, setEditHabit] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const today = format(new Date(), 'yyyy-MM-dd');
            const start = format(subDays(new Date(), 7), 'yyyy-MM-dd');
            const [hRes, lRes, aRes] = await Promise.all([
                getHabits(),
                getLogs({ startDate: start, endDate: today }),
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

    const getWeeklyRate = (habitId) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const habitLogs = logs.filter(
            l => l.habitId === habitId && l.completed &&
                l.date >= format(subDays(new Date(), 7), 'yyyy-MM-dd') && l.date <= today
        );
        return Math.round((habitLogs.length / 7) * 100);
    };

    const getStreak = (habitId) => {
        return analytics?.habitStats?.find(h => h.habitId === habitId)?.streak || 0;
    };

    const filtered = habits.filter(h =>
        h.habitName.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => { setEditHabit(null); setModalOpen(true); };
    const openEdit = (h) => { setEditHabit(h); setModalOpen(true); };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner mx-auto" style={{ width: 32, height: 32, borderWidth: 3 }} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-text">My Habits</h2>
                    <p className="text-text-muted text-sm mt-0.5">{habits.length} habit{habits.length !== 1 ? 's' : ''} tracked</p>
                </div>
                <button onClick={openCreate} className="btn-primary flex items-center gap-2 w-fit">
                    <Plus className="w-4 h-4" />
                    New Habit
                </button>
            </div>

            {/* Search */}
            {habits.length > 0 && (
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search habits..."
                        className="input-base pl-9"
                    />
                </div>
            )}

            {/* Cards Grid */}
            {filtered.length === 0 && habits.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-5xl mb-4">🌱</p>
                    <h3 className="text-lg font-bold text-text mb-2">No habits yet</h3>
                    <p className="text-text-muted text-sm mb-6">Create your first habit and start building consistency</p>
                    <button onClick={openCreate} className="btn-primary mx-auto flex items-center gap-2 w-fit">
                        <Plus className="w-4 h-4" />
                        Create First Habit
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(habit => (
                        <HabitCard
                            key={habit._id}
                            habit={habit}
                            streak={getStreak(habit._id)}
                            completionRate={getWeeklyRate(habit._id)}
                            onEdit={openEdit}
                            onDeleted={load}
                        />
                    ))}
                </div>
            )}

            {/* Weekly grid */}
            {habits.length > 0 && (
                <WeeklyGrid habits={habits} logs={logs} onToggle={load} />
            )}

            {/* Modal */}
            {modalOpen && (
                <HabitModal
                    habit={editHabit}
                    onClose={() => setModalOpen(false)}
                    onSaved={load}
                />
            )}
        </div>
    );
}
