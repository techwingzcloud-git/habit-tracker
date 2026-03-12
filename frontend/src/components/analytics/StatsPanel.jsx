import { Flame, CheckCircle, TrendingUp, Award, AlertCircle } from 'lucide-react';

function StatBox({ icon: Icon, iconColor, iconBg, label, value, sub }) {
    return (
        <div className="card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-2xl font-bold text-text">{value}</p>
                <p className="text-xs font-medium text-text-muted">{label}</p>
                {sub && <p className="text-xs text-text-light mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

export default function StatsPanel({ analytics }) {
    if (!analytics) return null;

    const {
        longestStreak = 0,
        weeklyRate = 0,
        monthlyRate = 0,
        bestHabit,
        worstHabit,
        totalCompleted = 0,
    } = analytics;

    return (
        <div className="space-y-3">
            <h3 className="font-bold text-text text-sm">Your Stats</h3>

            <StatBox
                icon={Flame}
                iconColor="text-orange-500"
                iconBg="bg-orange-50"
                label="Longest Streak"
                value={`${longestStreak}d`}
                sub="Best consecutive run"
            />
            <StatBox
                icon={CheckCircle}
                iconColor="text-green-500"
                iconBg="bg-green-50"
                label="Weekly Success Rate"
                value={`${weeklyRate}%`}
                sub="This week's completion"
            />
            <StatBox
                icon={TrendingUp}
                iconColor="text-blue-500"
                iconBg="bg-blue-50"
                label="Monthly Consistency"
                value={`${monthlyRate}%`}
                sub="Last 30 days"
            />
            <StatBox
                icon={CheckCircle}
                iconColor="text-primary"
                iconBg="bg-pastel-purple"
                label="Total Completions"
                value={totalCompleted}
                sub="All time"
            />

            {bestHabit && (
                <div className="card bg-green-50 border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Best Habit</span>
                    </div>
                    <p className="font-bold text-text text-sm">{bestHabit.icon} {bestHabit.habitName}</p>
                    <p className="text-xs text-green-600 mt-0.5">{bestHabit.rate}% completion rate</p>
                </div>
            )}

            {worstHabit && (
                <div className="card bg-orange-50 border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Needs Attention</span>
                    </div>
                    <p className="font-bold text-text text-sm">{worstHabit.icon} {worstHabit.habitName}</p>
                    <p className="text-xs text-orange-500 mt-0.5">{worstHabit.rate}% completion rate</p>
                </div>
            )}

            {/* Motivational */}
            <div className="card bg-gradient-to-br from-primary/5 to-purple-50 border-primary/10">
                <p className="text-xl mb-1">
                    {weeklyRate >= 80 ? '🔥' : weeklyRate >= 50 ? '💪' : '🌱'}
                </p>
                <p className="text-sm font-bold text-text">
                    {weeklyRate >= 80 ? 'You\'re crushing it!' : weeklyRate >= 50 ? 'Keep the momentum!' : 'Every day is a new start!'}
                </p>
                <p className="text-xs text-text-muted mt-1">
                    {weeklyRate >= 80
                        ? 'Amazing consistency this week. Keep it up!'
                        : weeklyRate >= 50
                            ? 'You\'re more than halfway. Push through!'
                            : 'Start small, stay consistent. You\'ve got this!'}
                </p>
            </div>
        </div>
    );
}
