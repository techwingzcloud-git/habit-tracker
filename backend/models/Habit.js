import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    habitName: { type: String, required: true, trim: true, maxlength: 40 },
    icon: { type: String, default: '✨' },
    color: { type: String, default: '#4F46E5' },
}, { timestamps: true });

// Compound index for fast user-scoped queries
habitSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Habit', habitSchema);
