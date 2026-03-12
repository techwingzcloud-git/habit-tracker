import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { googleLogin, getProfile } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('habit_token');
        if (!token) { setLoading(false); return; }
        try {
            const { data } = await getProfile();
            setUser(data.user);
        } catch {
            localStorage.removeItem('habit_token');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadUser(); }, [loadUser]);

    const loginWithGoogle = async (credential, accessToken, userInfo) => {
        try {
            const { data } = await googleLogin(credential, accessToken, userInfo);
            localStorage.setItem('habit_token', data.token);
            setUser(data.user);
            toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`);
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('habit_token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
