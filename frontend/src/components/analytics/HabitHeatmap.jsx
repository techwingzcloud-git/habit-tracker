import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

function getIntensity(count, max) {
    if (!count) return 0;
    const ratio = count / Math.max(max, 1);
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
}

const INTENSITY_COLORS = {
    0: '#EBEDF0',
    1: '#BBF7D0',
    2: '#4ADE80',
    3: '#22C55E',
    4: '#16A34A',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_SHORT = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function HabitHeatmap({ logs, habitId }) {
    const today = new Date();
    const startDate = subDays(today, 364);

    const dateRange = eachDayOfInterval({ start: startDate, end: today });

    // Count completions per day
    const countMap = useMemo(() => {
        const map = {};
        const filtered = habitId
            ? logs.filter(l => l.habitId === habitId)
            : logs;
        filtered.forEach(l => {
            if (l.completed) {
                map[l.date] = (map[l.date] || 0) + 1;
            }
        });
        return map;
    }, [logs, habitId]);

    const maxCount = Math.max(...Object.values(countMap), 1);
    const totalCompleted = Object.values(countMap).reduce((a, b) => a + b, 0);

    // Build weeks (7-row columns)
    const weeks = useMemo(() => {
        const w = [];
        let currentWeek = [];
        // Pad start
        const firstDay = dateRange[0].getDay(); // 0=Sun
        const padStart = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < padStart; i++) currentWeek.push(null);

        dateRange.forEach(date => {
            currentWeek.push(date);
            if (currentWeek.length === 7) {
                w.push(currentWeek);
                currentWeek = [];
            }
        });
        if (currentWeek.length) {
            while (currentWeek.length < 7) currentWeek.push(null);
            w.push(currentWeek);
        }
        return w;
    }, [dateRange]);

    // Month labels
    const monthLabels = useMemo(() => {
        const labels = [];
        let lastMonth = -1;
        weeks.forEach((week, wi) => {
            const firstValid = week.find(d => d !== null);
            if (firstValid) {
                const m = firstValid.getMonth();
                if (m !== lastMonth) {
                    labels.push({ weekIdx: wi, label: MONTHS[m] });
                    lastMonth = m;
                }
            }
        });
        return labels;
    }, [weeks]);

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text text-base">Activity Heatmap</h3>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map(l => (
                        <div key={l} className="w-3 h-3 rounded-sm" style={{ backgroundColor: INTENSITY_COLORS[l] }} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            <p className="text-xs text-text-muted mb-3">
                <span className="font-semibold text-primary">{totalCompleted}</span> completions in the last year
            </p>

            <div className="overflow-x-auto">
                <div className="inline-flex flex-col gap-1 min-w-max">
                    {/* Month labels */}
                    <div className="flex gap-1 pl-8">
                        {weeks.map((_, wi) => {
                            const ml = monthLabels.find(m => m.weekIdx === wi);
                            return (
                                <div key={wi} className="w-3 text-[9px] text-text-muted font-medium">
                                    {ml ? ml.label : ''}
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid rows (Mon–Sun) */}
                    {Array.from({ length: 7 }, (_, rowIdx) => (
                        <div key={rowIdx} className="flex items-center gap-1">
                            <span className="w-7 text-[9px] text-text-muted text-right pr-1 font-medium">
                                {DAYS_SHORT[rowIdx]}
                            </span>
                            {weeks.map((week, wi) => {
                                const date = week[rowIdx];
                                if (!date) return <div key={wi} className="w-3 h-3" />;
                                const dateStr = format(date, 'yyyy-MM-dd');
                                const count = countMap[dateStr] || 0;
                                const intensity = getIntensity(count, maxCount);
                                return (
                                    <div
                                        key={wi}
                                        className="heatmap-cell w-3 h-3 rounded-sm"
                                        style={{ backgroundColor: INTENSITY_COLORS[intensity] }}
                                        title={`${dateStr}: ${count} completed`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
