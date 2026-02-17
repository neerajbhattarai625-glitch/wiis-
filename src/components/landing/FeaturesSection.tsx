import { motion } from 'framer-motion';
import { MapPin, Recycle, TrendingUp, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: MapPin,
        title: 'Real-Time Tracking',
        description: 'Track waste collection trucks in real-time. Know exactly when to put your waste out.',
        color: 'bg-blue-500/10 text-blue-400',
    },
    {
        icon: Recycle,
        title: 'Smart Sorting AI',
        description: 'Use our AI-powered camera to identify waste types and earn correct recycling points.',
        color: 'bg-eco-500/10 text-eco-400',
    },
    {
        icon: TrendingUp,
        title: 'Impact Analytics',
        description: 'Visualize your contribution to the environment with detailed CO₂ and waste stats.',
        color: 'bg-purple-500/10 text-purple-400',
    },
    {
        icon: ShieldCheck,
        title: 'Blockchain Rewards',
        description: 'Earn transparent, secure crypto-tokens for your eco-friendly actions.',
        color: 'bg-orange-500/10 text-orange-400',
    },
];

const FeaturesSection = () => {
    return (
        <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-eco-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4"
                    >
                        Why Choose WIIS?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto"
                    >
                        We combine cutting-edge technology with community action to create a cleaner, greener future.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:border-eco-500/30 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
