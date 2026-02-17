import { useState, useEffect } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import RoleSelector from '@/components/landing/RoleSelector';
import FeaturesSection from '@/components/landing/FeaturesSection';
// Keeping this if I decide to use it, but currently unused in main return?
// Wait, I AM using ThreeBackground in HeroSection, not LandingPage directly anymore.
// So I should remove it from LandingPage.

import { Recycle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-100 overflow-x-hidden selection:bg-eco-500 selection:text-white">
            {/* Dynamic Navbar */}
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-white/5 ${scrolled ? 'bg-slate-900/90 backdrop-blur-xl shadow-2xl py-3 border-white/10' : 'bg-transparent py-6 border-transparent'
                    }`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-2"
                    >
                        <div className="p-2 rounded-xl bg-gradient-to-tr from-eco-500 to-emerald-400 shadow-lg shadow-emerald-500/20">
                            <Recycle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            WIIS
                        </span>
                    </motion.div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['Home', 'Features', 'Roles', 'Contact'].map((item, i) => (
                            <motion.button
                                key={item}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className={`text-sm font-medium transition-all hover:text-eco-400 ${scrolled ? 'text-slate-300' : 'text-slate-200'}`}
                            >
                                {item}
                            </motion.button>
                        ))}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                onClick={() => scrollToSection('roles')}
                                className="bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all duration-300 rounded-full px-6 font-semibold"
                            >
                                Login Portal
                            </Button>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-slate-900 border-b border-white/10 overflow-hidden"
                        >
                            <div className="p-4 space-y-2">
                                {['Home', 'Features', 'Roles', 'Contact'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => scrollToSection(item.toLowerCase())}
                                        className="block w-full text-left py-3 px-4 hover:bg-white/5 rounded-lg text-slate-300"
                                    >
                                        {item}
                                    </button>
                                ))}
                                <Button onClick={() => scrollToSection('roles')} className="w-full bg-eco-500 mt-4">
                                    Login Portal
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="relative">
                <div id="home">
                    <HeroSection onGetStarted={() => scrollToSection('roles')} />
                </div>

                <StatsSection />
                <FeaturesSection />
                <RoleSelector />
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-eco-500/50 to-transparent" />
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-6">
                                <Recycle className="h-8 w-8 text-eco-500" />
                                <span className="text-2xl font-bold text-white">WIIS</span>
                            </div>
                            <p className="max-w-xs text-lg leading-relaxed mb-6">
                                A next-generation platform for sustainable urban living. Powered by AI, Blockchain, and Community.
                            </p>
                            <div className="flex space-x-4">
                                {/* Social icons placeholder */}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
                            <ul className="space-y-4">
                                <li><button onClick={() => scrollToSection('roles')} className="hover:text-eco-400 transition-colors">Citizen Portal</button></li>
                                <li><button onClick={() => scrollToSection('roles')} className="hover:text-eco-400 transition-colors">Collector App</button></li>
                                <li><button onClick={() => scrollToSection('roles')} className="hover:text-eco-400 transition-colors">Admin Dashboard</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">Contact</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-eco-500" /> support@wiis.com</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-eco-500" /> +1 (555) 123-4567</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-eco-500" /> Pokhara, Nepal</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 mt-16 pt-8 text-center text-sm opacity-60">
                        © 2024 Waste to Infrastructure Integrated System. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
