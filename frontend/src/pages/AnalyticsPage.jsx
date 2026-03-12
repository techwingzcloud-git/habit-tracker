import { useEffect, useState, useCallback } from 'react';
import HabitHeatmap from '../components/analytics/HabitHeatmap';
import StatsPanel from '../components/analytics/StatsPanel';
import { getHabits } from '../services/habitService';
import { getLogs, getAnalytics } from '../services/logService';
import { format, subDays } from 'date-fns';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4F46E5', '#7C3AED', '#22C55E', '#F97316', '#06B6D4', '#EC4899', '#EAB308', '#3B82F6'];

export default function AnalyticsPage() {
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [selected, setSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const today = format(new Date(), 'yyyy-MM-dd');
            const start = format(subDays(new Date(), 30), 'yyyy-MM-dd');
            const [hRes, lRes, aRes] = await Promise.all([
                getHabits(),
                getLogs({ startDate: start, endDate: today }),
                getAnalytics(),
            ]);
            setHabits(hRes.data.habits || []);
            setLogs(lRes.data.logs || []);
            setAnalytics(aRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    // Per-habit completion rates for bar chart
    const barData = (analytics?.habitStats || []).map(h => {
        const habit = habits.find(hb => hb._id === h.habitId);
        return {
            name: habit ? habit.habitName.slice(0, 12) : h.habitId,
            rate: h.monthlyRate || 0,
            streak: h.streak || 0,
            icon: habit?.icon || '✨',
        };
    });

    // Daily completion trend (last 14 days)
    const trendData = Array.from({ length: 14 }, (_, i) => {
        const date = format(subDays(new Date(), 13 - i), 'yyyy-MM-dd');
        const dayLogs = logs.filter(l => l.date === date && l.completed);
        return {
            date: format(new Date(date + 'T00:00'), 'MMM d'),
            completed: dayLogs.length,
            total: habits.length,
        };
    });

    // Pie chart data (habit share of completions)
    const pieData = habits.map((h, i) => {
        const count = logs.filter(l => l.habitId === h._id && l.completed).length;
        return { name: h.habitName, value: count, color: h.color || COLORS[i % COLORS.length] };
    }).filter(d => d.value > 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner mx-auto" style={{ width: 32, height: 32, borderWidth: 3 }} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-extrabold text-text">Analytics</h2>
                <p className="text-text-muted text-sm mt-0.5">Detailed insights into your habit performance</p>
            </div>

            {habits.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-5xl mb-4">📊</p>
                    <h3 className="text-lg font-bold text-text mb-2">No data yet</h3>
                    <p className="text-text-muted text-sm">Start tracking habits to see your analytics</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Charts - 2 cols */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* Bar chart: habit completion rates */}
                            <div className="card">
                                <h3 className="font-bold text-text mb-4">Monthly Completion Rate by Habit</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
                                        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} unit="%" domain={[0, 100]} />
                                        <Tooltip
                                            formatter={(v) => [`${v}%`, 'Completion']}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: 12 }}
                                        />
                                        <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                                            {barData.map((_, i) => (
                                                <Cell key={i} fill={habits[i]?.color || COLORS[i % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Line chart: daily trend */}
                            <div className="card">
                                <h3 className="font-bold text-text mb-4">14-Day Completion Trend</h3>
                                <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} interval={1} />
                                        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} allowDecimals={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: 12 }} />
                                        <Line
                                            type="monotone" dataKey="completed"
                                            stroke="#4F46E5" strokeWidth={2.5}
                                            dot={{ fill: '#4F46E5', r: 4 }} activeDot={{ r: 6 }}
                                            name="Completed"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Pie chart */}
                            {pieData.length > 0 && (
                                <div className="card">
                                    <h3 className="font-bold text-text mb-4">Habit Completion Share (30 days)</h3>
                                    <div className="flex items-center gap-4">
                                        <ResponsiveContainer width="50%" height={180}>
                                            <PieChart>
                                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                                                    {pieData.map((entry, i) => (
                                                        <Cell key={i} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(v, n) => [v, n]}
                                                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: 12 }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="space-y-2 flex-1">
                                            {pieData.map((d, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                                                    <span className="text-xs text-text truncate">{d.name}</span>
                                                    <span className="text-xs font-bold text-text ml-auto">{d.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Heatmap with habit filter */}
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="font-bold text-text">Activity Heatmap</h3>
                                    <select
                                        value={selected}
                                        onChange={e => setSelected(e.target.value)}
                                        className="input-base !w-auto !px-3 !py-1.5 text-xs"
                                    >
                                        <option value="all">All Habits</option>
                                        {habits.map(h => (
                                            <option key={h._id} value={h._id}>{h.icon} {h.habitName}</option>
                                        ))}
                                    </select>
                                </div>
                                <HabitHeatmap logs={logs} habitId={selected === 'all' ? null : selected} />
                            </div>
                        </div>

                        {/* Stats panel */}
                        <div className="xl:col-span-1">
                            <StatsPanel analytics={analytics} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
