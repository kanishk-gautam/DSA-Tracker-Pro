/* ============================================================
   charts.js — All Chart.js visualizations
   ============================================================ */

(function () {
    'use strict';

    /* Shared color palette */
    const PALETTE = {
        primary:   '#6366F1',
        secondary: '#8B5CF6',
        success:   '#10B981',
        warning:   '#F59E0B',
        danger:    '#EF4444',
        info:      '#06B6D4',
    };

    const GRAD_PRIMARY  = 'rgba(99,102,241,';
    const GRAD_SUCCESS  = 'rgba(16,185,129,';

    let charts = {};

    function makeGradient(ctx, color, alpha = 0.4) {
        const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        g.addColorStop(0, color + alpha + ')');
        g.addColorStop(1, color + '0)');
        return g;
    }

    function defaultOptions(yLabel = '') {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: getComputedStyle(document.body).getPropertyValue('--text') || '#1E293B', font: { family: 'Inter', size: 12 } }
                },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: {
                    grid:  { color: 'rgba(99,102,241,0.07)' },
                    ticks: { color: '#94A3B8', font: { size: 11 } }
                },
                y: {
                    grid:  { color: 'rgba(99,102,241,0.07)' },
                    ticks: { color: '#94A3B8', font: { size: 11 } },
                    title: { display: !!yLabel, text: yLabel, color: '#94A3B8' }
                }
            }
        };
    }

    /* ─── Daily Progress Chart ─── */
    function renderDailyChart(dailyActivity) {
        const canvas = document.getElementById('chart-daily');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (charts.daily) charts.daily.destroy();

        const last14 = (dailyActivity || []).slice(-14);
        const labels  = last14.map(d => {
            const dt = new Date(d.date);
            return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const values = last14.map(d => d.solved);

        charts.daily = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Problems Solved',
                    data:  values,
                    backgroundColor: makeGradient(ctx, GRAD_PRIMARY),
                    borderColor: PALETTE.primary,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: { ...defaultOptions('Problems'), plugins: { ...defaultOptions().plugins, legend: { display: false } } }
        });
    }

    /* ─── Weekly Line Chart ─── */
    function renderWeeklyChart(dailyActivity) {
        const canvas = document.getElementById('chart-weekly');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (charts.weekly) charts.weekly.destroy();

        // Group by week
        const today = new Date();
        const weeks = [];
        for (let w = 5; w >= 0; w--) {
            const start = new Date(today);
            start.setDate(today.getDate() - w * 7 - 6);
            const end = new Date(today);
            end.setDate(today.getDate() - w * 7);
            const label = `Wk ${start.toLocaleDateString('en-US',{month:'short',day:'numeric'})}`;
            const total = (dailyActivity || []).filter(d => {
                const dt = new Date(d.date);
                return dt >= start && dt <= end;
            }).reduce((sum, d) => sum + d.solved, 0);
            weeks.push({ label, total });
        }

        charts.weekly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeks.map(w => w.label),
                datasets: [{
                    label: 'Problems / Week',
                    data:  weeks.map(w => w.total),
                    borderColor: PALETTE.secondary,
                    backgroundColor: makeGradient(ctx, 'rgba(139,92,246,'),
                    tension: 0.45,
                    fill: true,
                    pointBackgroundColor: PALETTE.secondary,
                    pointRadius: 5,
                }]
            },
            options: defaultOptions('Problems')
        });
    }

    /* ─── Monthly Chart ─── */
    function renderMonthlyChart(dailyActivity) {
        const canvas = document.getElementById('chart-monthly');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (charts.monthly) charts.monthly.destroy();

        // Group by month (last 6)
        const monthMap = {};
        (dailyActivity || []).forEach(d => {
            const key = d.date.slice(0, 7);
            monthMap[key] = (monthMap[key] || 0) + d.solved;
        });

        const sorted = Object.entries(monthMap).sort().slice(-6);
        const labels = sorted.map(([k]) => {
            const [y, m] = k.split('-');
            return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        });
        const values = sorted.map(([, v]) => v);

        charts.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Problems / Month',
                    data: values,
                    borderColor: PALETTE.success,
                    backgroundColor: makeGradient(ctx, GRAD_SUCCESS),
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: PALETTE.success,
                    pointRadius: 5,
                }]
            },
            options: defaultOptions('Problems')
        });
    }

    /* ─── Difficulty Doughnut ─── */
    function renderDifficultyChart(state) {
        const canvas = document.getElementById('chart-difficulty');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (charts.difficulty) charts.difficulty.destroy();

        charts.difficulty = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: [state.easySolved || 0, state.mediumSolved || 0, state.hardSolved || 0],
                    backgroundColor: [PALETTE.success, PALETTE.warning, PALETTE.danger],
                    borderWidth: 0,
                    hoverOffset: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94A3B8', padding: 16, font: { size: 12 } }
                    }
                },
                cutout: '70%',
            }
        });
    }

    /* ─── Topic Distribution Polar ─── */
    function renderTopicChart(state) {
        const canvas = document.getElementById('chart-topics');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (charts.topics) charts.topics.destroy();

        const topicsMap = state.roadmapProgress || {};
        const entries   = Object.entries(topicsMap);
        if (!entries.length) return;

        const labels = entries.map(([k]) => k);
        const values = entries.map(([, v]) => (typeof v === 'object' ? v.completed || 0 : 0));

        const colors = [
            PALETTE.primary, PALETTE.secondary, PALETTE.success,
            PALETTE.warning, PALETTE.danger, PALETTE.info,
            '#EC4899', '#84CC16', '#F97316', '#14B8A6',
            '#6366F1', '#8B5CF6', '#10B981', '#F59E0B',
            '#EF4444', '#06B6D4', '#A78BFA'
        ];

        charts.topics = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors.slice(0, labels.length).map(c => c + 'CC'),
                    borderWidth: 1,
                    borderColor: colors.slice(0, labels.length),
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#94A3B8', font: { size: 11 } } }
                }
            }
        });
    }

    function renderAll(state) {
        const activity = state.dailyActivity || [];
        renderDailyChart(activity);
        renderWeeklyChart(activity);
        renderMonthlyChart(activity);
        renderDifficultyChart(state);
        renderTopicChart(state);
    }

    window.DSACharts = { renderAll, renderDailyChart, renderWeeklyChart, renderMonthlyChart, renderDifficultyChart, renderTopicChart };
})();
