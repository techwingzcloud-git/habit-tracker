import { Check } from 'lucide-react';
import { format } from 'date-fns';
import { toggleLog } from '../../services/logService';
import toast from 'react-hot-toast';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDates() {
    const today = new Date();
    const day = today.getDay(); // 0=Sun,1=Mon,...
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day === 0 ? 7 : day) - 1));
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return format(d, 'yyyy-MM-dd');
    });
}

export default function WeeklyGrid({ habits, logs, onToggle }) {
    const weekDates = getWeekDates();
    const today = format(new Date(), 'yyyy-MM-dd');

    const isCompleted = (habitId, date) =>
        logs.some(l => l.habitId === habitId && l.date === date && l.completed);

    const handleToggle = async (habitId, date) => {
        try {
            await toggleLog(habitId, date);
            onToggle();
        } catch {
            toast.error('Failed to update habit');
        }
    };

    if (!habits.length) {
        return (
            <div className="card text-center py-12">
                <p className="text-4xl mb-3">🌱</p>
                <p className="font-semibold text-text">No habits yet</p>
                <p className="text-sm text-text-muted mt-1">Add your first habit to get started</p>
            </div>
        );
    }

    return (
        <div className="card overflow-x-auto">
            <h2 className="font-bold text-text mb-4 text-base">Weekly Tracker</h2>
            <table className="w-full min-w-[520px]">
                <thead>
                    <tr>
                        <th className="text-left pb-3 pr-4 text-xs font-semibold text-text-muted uppercase tracking-wider w-36">
                            Habit
                        </th>
                        {weekDates.map((date, i) => (
                            <th key={date} className="pb-3 text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-semibold text-text-muted uppercase">{DAYS[i]}</span>
                                    <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold
                    ${date === today ? 'bg-primary text-white' : 'text-text-light'}`}>
                                        {new Date(date + 'T00:00:00').getDate()}
                                    </span>
                                </div>
                            </th>
                        ))}
                        <th className="pb-3 text-center text-xs font-semibold text-text-muted uppercase tracking-wider">
                            Rate
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {habits.map(habit => {
                        const completedCount = weekDates.filter(d => isCompleted(habit._id, d)).length;
                        const rate = Math.round((completedCount / 7) * 100);
                        return (
                            <tr key={habit._id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="py-3 pr-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg flex-shrink-0">{habit.icon || '✨'}</span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-text truncate max-w-[100px]">
                                                {habit.habitName}
                                            </p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${rate}%`, backgroundColor: habit.color || '#4F46E5' }}
                                                    />
                                                </div>
                                                <span className="text-xs text-text-muted">{rate}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                {weekDates.map(date => {
                                    const done = isCompleted(habit._id, date);
                                    const isFuture = date > today;
                                    return (
                                        <td key={date} className="py-3 text-center">
                                            <button
                                                disabled={isFuture}
                                                onClick={() => handleToggle(habit._id, date)}
                                                className={`habit-checkbox mx-auto ${done ? 'checked' : ''} 
                          ${isFuture ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                style={done ? { backgroundColor: habit.color || '#22C55E', borderColor: habit.color || '#22C55E' } : {}}
                                                title={date}
                                            >
                                                {done && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                            </button>
                                        </td>
                                    );
                                })}
                                <td className="py-3 text-center">
                                    <span className={`badge text-xs font-bold px-2 py-1 rounded-full
                    ${rate >= 80 ? 'bg-green-100 text-green-700' :
                                            rate >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-50 text-red-500'}`}>
                                        {completedCount}/7
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
