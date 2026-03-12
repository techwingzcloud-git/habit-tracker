import API from './api';

export const googleLogin = (credential, accessToken, userInfo) =>
    API.post('/auth/google', { credential, accessToken, userInfo });

export const getProfile = () =>
    API.get('/auth/me');
