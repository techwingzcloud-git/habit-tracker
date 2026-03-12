import { useState } from 'react';
import { X, Smile } from 'lucide-react';
import { createHabit, updateHabit } from '../../services/habitService';
import toast from 'react-hot-toast';

const ICONS = ['✨', '🏃', '📚', '💪', '🧘', '🥗', '💧', '🎯', '🎨', '🎵', '📝', '🌙', '☀️', '🧠', '❤️', '🌿', '🏋️', '🚴', '🤸', '🏊'];
const COLORS = [
    '#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F97316',
    '#EAB308', '#22C55E', '#14B8A6', '#06B6D4', '#3B82F6',
];

export default function HabitModal({ habit, onClose, onSaved }) {
    const [name, setName] = useState(habit?.habitName || '');
    const [icon, setIcon] = useState(habit?.icon || '✨');
    const [color, setColor] = useState(habit?.color || '#4F46E5');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Habit name is required');
        setLoading(true);
        try {
            if (habit?._id) {
                await updateHabit(habit._id, { habitName: name, icon, color });
                toast.success('Habit updated!');
            } else {
                await createHabit({ habitName: name, icon, color });
                toast.success('Habit created! 🎉');
            }
            onSaved();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-card-hover w-full max-w-md animate-slide-up">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-text">
                        {habit?._id ? 'Edit Habit' : 'New Habit'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Preview */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50">
                        <span className="text-3xl">{icon}</span>
                        <div>
                            <p className="font-semibold text-text text-base">{name || 'Habit Name'}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-xs text-text-muted">Preview</span>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
                            Habit Name
                        </label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Morning Workout, Read 30min..."
                            className="input-base"
                            maxLength={40}
                        />
                    </div>

                    {/* Icon */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                            <Smile className="inline w-3 h-3 mr-1" />Icon
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ICONS.map(i => (
                                <button
                                    key={i} type="button"
                                    onClick={() => setIcon(i)}
                                    className={`text-xl w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    ${icon === i ? 'bg-primary/10 ring-2 ring-primary scale-110' : 'hover:bg-gray-100'}`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">
                            Color
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {COLORS.map(c => (
                                <button
                                    key={c} type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full transition-all ${color === c ? 'scale-125 ring-2 ring-offset-2' : 'hover:scale-110'}`}
                                    style={{ backgroundColor: c, ringColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1">
                            {loading ? <span className="spinner mx-auto" /> : habit?._id ? 'Save Changes' : 'Create Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
