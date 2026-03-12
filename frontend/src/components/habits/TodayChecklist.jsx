import { Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toggleLog } from '../../services/logService';
import toast from 'react-hot-toast';

export default function TodayChecklist({ habits, logs, onToggle }) {
    const today = format(new Date(), 'yyyy-MM-dd');

    const isCompleted = (habitId) =>
        logs.some(l => l.habitId === habitId && l.date === today && l.completed);

    const completedCount = habits.filter(h => isCompleted(h._id)).length;
    const total = habits.length;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    const handleToggle = async (habitId) => {
        try {
            await toggleLog(habitId, today);
            onToggle();
        } catch {
            toast.error('Failed to update');
        }
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="font-bold text-text text-base">Today's Habits</h2>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(), 'EEEE, MMM d')}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-extrabold text-primary">{completedCount}</span>
                    <span className="text-text-muted text-sm font-medium">/{total}</span>
                    <p className="text-xs text-text-muted">{pct}% done</p>
                </div>
            </div>

            {/* Overall progress */}
            <div className="progress-bar mb-4">
                <div
                    className="progress-fill bg-gradient-to-r from-primary to-purple-500"
                    style={{ width: `${pct}%` }}
                />
            </div>

            {total === 0 ? (
                <div className="text-center py-6">
                    <p className="text-3xl mb-2">🌱</p>
                    <p className="text-sm text-text-muted">Add habits to start tracking</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {habits.map(habit => {
                        const done = isCompleted(habit._id);
                        return (
                            <li
                                key={habit._id}
                                onClick={() => handleToggle(habit._id)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${done ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50 border border-transparent'}`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${done ? 'border-success bg-success' : 'border-gray-200 hover:border-primary/50'}`}
                                >
                                    {done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                </div>
                                <span className="text-lg flex-shrink-0">{habit.icon || '✨'}</span>
                                <span className={`text-sm font-medium flex-1 ${done ? 'line-through text-text-muted' : 'text-text'}`}>
                                    {habit.habitName}
                                </span>
                                {done && (
                                    <span className="badge bg-green-100 text-green-700 text-xs">Done</span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
