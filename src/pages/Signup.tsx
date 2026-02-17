import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ShieldCheck, Truck, Loader2, ArrowRight, CheckCircle2, Upload, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: ID Upload, 4: Success
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'citizen'
    });
    const [otp, setOtp] = useState('');
    const [idFile, setIdFile] = useState<File | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Registration failed');

            toast.success('Registration successful! Check console for OTP (Demo mode)');
            setStep(2);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/verify-otp?email=${formData.email}&otp=${otp}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'OTP verification failed');

            toast.success('OTP Verified!');
            setStep(3);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadId = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idFile) return toast.error('Please select a file');

        setLoading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', idFile);

            const response = await fetch(`${API_URL}/api/upload-id?email=${formData.email}`, {
                method: 'POST',
                body: formDataUpload
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Upload failed');

            toast.success('ID Uploaded Successfully!');
            setStep(4);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Progress bar */}
                <div className="flex justify-between mb-8 px-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-2 flex-1 mx-1 rounded-full transition-colors ${step >= i ? 'bg-eco-500' : 'bg-slate-200'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                            <Card className="border-0 shadow-xl">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-eco-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                        <Leaf className="h-8 w-8 text-eco-600" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                                    <CardDescription>Join the smart waste management revolution</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input required placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input required type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Password</Label>
                                            <Input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Account Type</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button type="button" onClick={() => setFormData({ ...formData, role: 'citizen' })} className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${formData.role === 'citizen' ? 'border-eco-500 bg-eco-50' : 'border-slate-100 opacity-60'}`}>
                                                    <Leaf className="h-5 w-5" /> <span className="text-xs font-semibold">Citizen</span>
                                                </button>
                                                <button type="button" onClick={() => setFormData({ ...formData, role: 'collector' })} className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${formData.role === 'collector' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 opacity-60'}`}>
                                                    <Truck className="h-5 w-5 text-blue-600" /> <span className="text-xs font-semibold">Collector</span>
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full bg-slate-900" disabled={loading}>
                                            {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />} Get Verification Code
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                            <Card className="border-0 shadow-xl">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                        <Phone className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <CardTitle>Verify OTP</CardTitle>
                                    <CardDescription>We've sent a 6-digit code to {formData.email}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                                        <Input required maxLength={6} placeholder="000000" className="text-center text-2xl tracking-[1em] h-14" value={otp} onChange={e => setOtp(e.target.value)} />
                                        <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
                                            {loading ? <Loader2 className="animate-spin mr-2" /> : "Verify Code"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                            <Card className="border-0 shadow-xl">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                        <ShieldCheck className="h-8 w-8 text-amber-600" />
                                    </div>
                                    <CardTitle>Identity Verification</CardTitle>
                                    <CardDescription>Upload a photo of your Citizenship/National ID for verification</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUploadId} className="space-y-4">
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-eco-300 transition-colors relative">
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={e => setIdFile(e.target.files?.[0] || null)} />
                                            {idFile ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle2 className="h-10 w-10 text-eco-500" />
                                                    <span className="text-sm font-medium">{idFile.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Upload className="h-10 w-10" />
                                                    <span className="text-sm">Click to upload ID photo</span>
                                                </div>
                                            )}
                                        </div>
                                        <Button type="submit" className="w-full bg-amber-600" disabled={loading}>
                                            {loading ? <Loader2 className="animate-spin mr-2" /> : "Submit for Verification"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <Card className="border-0 shadow-xl text-center p-6">
                                <div className="w-20 h-20 bg-eco-100 rounded-full mx-auto flex items-center justify-center mb-6">
                                    <CheckCircle2 className="h-12 w-12 text-eco-600" />
                                </div>
                                <CardTitle className="text-2xl mb-2">Registration Pending</CardTitle>
                                <CardDescription className="mb-8">
                                    Your documents have been submitted! Our admins will verify your account within 24 hours.
                                </CardDescription>
                                <Button onClick={() => navigate('/login')} className="w-full bg-eco-600">
                                    Return to Login
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Signup;
