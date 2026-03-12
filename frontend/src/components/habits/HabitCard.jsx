import { useState } from 'react';
import { MoreVertical, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { deleteHabit } from '../../services/habitService';
import toast from 'react-hot-toast';

export default function HabitCard({ habit, streak, completionRate, onEdit, onDeleted }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Delete "${habit.habitName}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            await deleteHabit(habit._id);
            toast.success('Habit deleted');
            onDeleted();
        } catch {
            toast.error('Failed to delete habit');
            setDeleting(false);
        }
    };

    const rate = completionRate ?? 0;

    return (
        <div className="card hover:shadow-card-hover transition-all duration-200 group relative">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ backgroundColor: `${habit.color}18` }}
                    >
                        {habit.icon || '✨'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-text text-sm">{habit.habitName}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <TrendingUp className="w-3 h-3 text-text-muted" />
                            <span className="text-xs text-text-muted">{streak || 0} day streak</span>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-card-hover border border-gray-100 overflow-hidden z-20 animate-fade-in">
                            <button
                                onClick={() => { onEdit(habit); setMenuOpen(false); }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text hover:bg-gray-50 font-medium"
                            >
                                <Edit2 className="w-3.5 h-3.5 text-primary" /> Edit
                            </button>
                            <button
                                onClick={() => { handleDelete(); setMenuOpen(false); }}
                                disabled={deleting}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 font-medium"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-text-muted font-medium">Weekly Progress</span>
                    <span className="text-xs font-bold" style={{ color: habit.color }}>{rate}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${rate}%`, backgroundColor: habit.color || '#4F46E5' }}
                    />
                </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50">
                <div className="text-center">
                    <p className="text-base font-bold text-text">{streak || 0}</p>
                    <p className="text-xs text-text-muted">Streak</p>
                </div>
                <div className="text-center">
                    <p className="text-base font-bold text-text">{rate}%</p>
                    <p className="text-xs text-text-muted">This Week</p>
                </div>
                <div className="text-center">
                    <p className="text-base font-bold" style={{ color: rate >= 70 ? '#22C55E' : '#F97316' }}>
                        {rate >= 80 ? '🔥' : rate >= 50 ? '📈' : '💪'}
                    </p>
                    <p className="text-xs text-text-muted">Status</p>
                </div>
            </div>
        </div>
    );
}
