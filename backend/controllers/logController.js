import HabitLog from '../models/HabitLog.js';
import Habit from '../models/Habit.js';
import { subDays, format, eachDayOfInterval, differenceInDays } from 'date-fns';

// GET /api/logs?startDate=&endDate=
export const getLogs = async (req, res) => {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.user._id };
    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = startDate;
        if (endDate) filter.date.$lte = endDate;
    }
    const logs = await HabitLog.find(filter).sort({ date: -1 });
    res.json({ logs });
};

// POST /api/logs/toggle
export const toggleLog = async (req, res) => {
    const { habitId, date } = req.body;
    if (!habitId || !date) return res.status(400).json({ message: 'habitId and date required' });

    // Verify habit belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const existing = await HabitLog.findOne({ userId: req.user._id, habitId, date });
    if (existing) {
        await existing.deleteOne();
        return res.json({ message: 'Unchecked', completed: false });
    } else {
        const log = await HabitLog.create({ userId: req.user._id, habitId, date, completed: true });
        return res.status(201).json({ message: 'Checked', log, completed: true });
    }
};

// GET /api/logs/analytics
export const getAnalytics = async (req, res) => {
    const userId = req.user._id;
    const today = format(new Date(), 'yyyy-MM-dd');
    const month30 = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const week7 = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const year = format(subDays(new Date(), 365), 'yyyy-MM-dd');

    const [habits, allLogs] = await Promise.all([
        Habit.find({ userId }),
        HabitLog.find({ userId, completed: true, date: { $gte: year } }),
    ]);

    const totalCompleted = allLogs.length;

    // Per-habit analytics
    const habitStats = habits.map(h => {
        const hLogs = allLogs.filter(l => l.habitId.toString() === h._id.toString());

        // Monthly rate
        const monthLogs = hLogs.filter(l => l.date >= month30 && l.date <= today);
        const monthlyRate = Math.round((monthLogs.length / 30) * 100);

        // Weekly rate
        const weekLogs = hLogs.filter(l => l.date >= week7 && l.date <= today);
        const weeklyRate = Math.round((weekLogs.length / 7) * 100);

        // Streak calculation
        let streak = 0;
        let checkDate = new Date();
        const logDates = new Set(hLogs.map(l => l.date));
        while (logDates.has(format(checkDate, 'yyyy-MM-dd'))) {
            streak++;
            checkDate = subDays(checkDate, 1);
        }

        return { habitId: h._id, habitName: h.habitName, icon: h.icon, monthlyRate, weeklyRate, streak, rate: monthlyRate };
    });

    // Overall rates
    const weeklyRate = habits.length
        ? Math.round(habitStats.reduce((s, h) => s + h.weeklyRate, 0) / habits.length)
        : 0;
    const monthlyRate = habits.length
        ? Math.round(habitStats.reduce((s, h) => s + h.monthlyRate, 0) / habits.length)
        : 0;

    const longestStreak = habitStats.reduce((max, h) => Math.max(max, h.streak), 0);

    const sorted = [...habitStats].sort((a, b) => b.rate - a.rate);
    const bestHabit = sorted[0] || null;
    const worstHabit = sorted[sorted.length - 1] || null;

    res.json({ weeklyRate, monthlyRate, longestStreak, totalCompleted, bestHabit, worstHabit, habitStats });
};

// GET /api/logs/heatmap?habitId=
export const getHeatmap = async (req, res) => {
    const { habitId } = req.query;
    const filter = {
        userId: req.user._id,
        completed: true,
        date: { $gte: format(subDays(new Date(), 365), 'yyyy-MM-dd') },
    };
    if (habitId) filter.habitId = habitId;

    const logs = await HabitLog.find(filter);
    res.json({ logs });
};
