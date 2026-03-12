import API from './api';

export const getLogs = (params) => API.get('/logs', { params });

export const toggleLog = (habitId, date) =>
    API.post('/logs/toggle', { habitId, date });

export const getAnalytics = () => API.get('/logs/analytics');

export const getHeatmap = (habitId) =>
    API.get('/logs/heatmap', { params: { habitId } });
