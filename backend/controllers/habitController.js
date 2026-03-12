import Habit from '../models/Habit.js';

// GET /api/habits
export const getHabits = async (req, res) => {
    const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ habits });
};

// POST /api/habits
export const createHabit = async (req, res) => {
    const { habitName, icon, color } = req.body;
    if (!habitName?.trim()) return res.status(400).json({ message: 'Habit name is required' });

    const habit = await Habit.create({
        userId: req.user._id,
        habitName: habitName.trim(),
        icon: icon || '✨',
        color: color || '#4F46E5',
    });
    res.status(201).json({ habit });
};

// PUT /api/habits/:id
export const updateHabit = async (req, res) => {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const { habitName, icon, color } = req.body;
    if (habitName) habit.habitName = habitName.trim();
    if (icon) habit.icon = icon;
    if (color) habit.color = color;
    await habit.save();

    res.json({ habit });
};

// DELETE /api/habits/:id
export const deleteHabit = async (req, res) => {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    res.json({ message: 'Habit deleted' });
};
