import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ThreeBackground from '@/components/landing/ThreeBackground';

interface HeroSectionProps {
    onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <ThreeBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/50 to-slate-900 pointer-events-none" />

            <div className="container relative z-10 px-4 pt-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        <span className="block text-white mb-2">The Future of</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-eco-400 to-emerald-600 filter drop-shadow-lg">
                            Smart Waste Management
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join the revolution. Earn rewards for recycling, track collection trucks in real-time, and build a cleaner city.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Button
                            size="lg"
                            onClick={onGetStarted}
                            className="h-14 px-8 rounded-full bg-eco-600 hover:bg-eco-700 text-lg shadow-lg shadow-eco-900/20 hover:shadow-eco-600/40 transition-all hover:-translate-y-1 text-white border-0"
                        >
                            Get Started <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-lg backdrop-blur-sm"
                        >
                            Learn More
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;
