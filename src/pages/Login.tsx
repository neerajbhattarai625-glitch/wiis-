import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, Leaf, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialRole = searchParams.get('role') || 'citizen';

    const [role, setRole] = useState(initialRole);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Update email/role when changing tabs if fields are empty
    useEffect(() => {
        if (!email) {
            if (role === 'admin') setEmail('admin@waste.com');
            else if (role === 'collector') setEmail('collector@waste.com');
            else setEmail('citizen@waste.com');
        }
    }, [role]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Real API Call
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            // Success
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('token', data.access_token);

            // Navigate to dashboard based on server-returned role
            navigate(`/${data.role}`);
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check connection.');
            setLoading(false);
        }
    };

    const getRoleIcon = () => {
        switch (role) {
            case 'admin': return <ShieldCheck className="h-10 w-10 text-purple-600" />;
            case 'collector': return <Truck className="h-10 w-10 text-blue-600" />;
            default: return <Leaf className="h-10 w-10 text-eco-600" />;
        }
    };

    const getRoleColor = () => {
        switch (role) {
            case 'admin': return 'border-purple-200 focus-visible:ring-purple-500';
            case 'collector': return 'border-blue-200 focus-visible:ring-blue-500';
            default: return 'border-eco-200 focus-visible:ring-eco-500';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <Button
                variant="ghost"
                className="absolute top-4 left-4"
                onClick={() => navigate('/')}
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white rounded-full shadow-lg mx-auto flex items-center justify-center mb-4">
                        {getRoleIcon()}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{role} Login</h1>
                    <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
                </div>

                <Card className="border-0 shadow-xl">
                    <CardHeader>
                        {/* Role Switcher Tabs */}
                        <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
                            {['citizen', 'collector', 'admin'].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => { setRole(r); setError(''); }}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${role === r
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={getRoleColor()}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={getRoleColor()}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-100">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className={`w-full ${role === 'admin' ? 'bg-purple-600 hover:bg-purple-700' :
                                    role === 'collector' ? 'bg-blue-600 hover:bg-blue-700' :
                                        'bg-eco-600 hover:bg-eco-700'
                                    }`}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center text-sm text-muted-foreground">
                        Don't have an account? <span className="text-primary font-medium ml-1 cursor-pointer hover:underline">Sign up</span>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
