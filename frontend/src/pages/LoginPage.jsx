import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Sparkles, CheckCircle, BarChart2, Users, ArrowRight } from 'lucide-react';

const FEATURES = [
    { icon: CheckCircle, title: 'Track Daily Habits', desc: 'Check off habits and build powerful streaks' },
    { icon: BarChart2, title: 'Visual Analytics', desc: 'Heatmaps and charts to see your progress' },
    { icon: Users, title: 'Personal & Private', desc: 'Your data is completely isolated and secure' },
];

export default function LoginPage() {
    const { loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            // Exchange access token for user info, then send to backend
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const userInfo = await res.json();
                // We'll use a credential flow; fallback with access_token
                await loginWithGoogle(null, tokenResponse.access_token, userInfo);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        },
        onError: () => setLoading(false),
        flow: 'implicit',
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-purple-600 to-purple-700 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-xl">HabitFlow</span>
                    </div>

                    <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Build habits that<br />
                        <span className="text-purple-200">actually stick.</span>
                    </h1>
                    <p className="text-purple-100 text-lg leading-relaxed">
                        Track your daily habits, visualize your progress, and become the best version of yourself — one day at a time.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    {FEATURES.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-3 bg-white/10 rounded-2xl p-4">
                            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">{title}</p>
                                <p className="text-purple-200 text-xs mt-0.5">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md animate-slide-up">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-soft">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gradient">HabitFlow</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-text mb-2">Welcome back</h2>
                    <p className="text-text-muted text-base mb-10">
                        Sign in to continue your habit journey 🌱
                    </p>

                    <button
                        onClick={() => login()}
                        disabled={loading}
                        className="google-btn w-full justify-center group"
                    >
                        {loading ? (
                            <span className="spinner" />
                        ) : (
                            <>
                                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                </svg>
                                <span className="font-semibold text-base">Continue with Google</span>
                                <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-text-muted mt-8 leading-relaxed">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>

                    <div className="mt-10 grid grid-cols-3 gap-4 text-center">
                        {['100% Free', 'No Password', 'Private & Secure'].map(t => (
                            <div key={t} className="p-3 bg-white rounded-2xl shadow-card border border-gray-50">
                                <p className="text-xs font-semibold text-text">{t}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
