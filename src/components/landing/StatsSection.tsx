import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const stats = [
    { label: 'Active Users', value: 1200, suffix: '+', color: 'text-blue-400' },
    { label: 'Waste Collected', value: 15400, suffix: 'kg', color: 'text-eco-400' },
    { label: 'CO₂ Saved', value: 4200, suffix: 'kg', color: 'text-emerald-400' },
    { label: 'Partner Cities', value: 5, suffix: '', color: 'text-purple-400' },
];

const StatsSection = () => {
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    });

    return (
        <section className="py-20 bg-slate-900 relative border-t border-white/5">
            <div className="container mx-auto px-4">
                <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                                {inView ? (
                                    <CountUp end={stat.value} separator="," />
                                ) : (
                                    '0'
                                )}
                                {stat.suffix}
                            </div>
                            <div className="text-slate-400 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
