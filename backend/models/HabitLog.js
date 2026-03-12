import mongoose from 'mongoose';

const habitLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
    date: { type: String, required: true },   // 'YYYY-MM-DD'
    completed: { type: Boolean, default: true },
}, { timestamps: true });

// Ensure one log per habit per day per user
habitLogSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

export default mongoose.model('HabitLog', habitLogSchema);
