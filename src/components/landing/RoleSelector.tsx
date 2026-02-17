import { motion } from 'framer-motion';
import { User, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roles = [
    {
        id: 'citizen',
        title: 'Citizen',
        description: 'Report waste, track trucks, and earn rewards for recycling.',
        icon: User,
        color: 'from-eco-500 to-emerald-600',
        path: '/citizen-dashboard', // Or login with role
        bg: 'bg-emerald-950/30',
        border: 'border-emerald-500/20',
    },
    {
        id: 'collector',
        title: 'Waste Collector',
        description: 'View optimized routes, verify pickups, and track performance.',
        icon: Truck,
        color: 'from-blue-500 to-cyan-600',
        path: '/collector-dashboard',
        bg: 'bg-blue-950/30',
        border: 'border-blue-500/20',
    },
    {
        id: 'admin',
        title: 'Admin',
        description: 'Manage users, monitor system analytics, and handle disputes.',
        icon: ShieldCheck,
        color: 'from-purple-500 to-indigo-600',
        path: '/admin-dashboard',
        bg: 'bg-purple-950/30',
        border: 'border-purple-500/20',
    },
];

const RoleSelector = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (roleId: string) => {
        // In a real app, this would go to a specialized login or dashboard
        // For prototype, we'll store the role and go to login
        sessionStorage.setItem('selectedRole', roleId);
        navigate('/login');
    };

    return (
        <section id="roles" className="py-24 bg-slate-900 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4"
                    >
                        Choose Your Role
                    </motion.h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Select how you want to interact with the system.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className={`relative overflow-hidden rounded-3xl border ${role.border} ${role.bg} p-8 group cursor-pointer`}
                            onClick={() => handleRoleSelect(role.id)}
                        >
                            {/* Hover Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                                <role.icon className="h-8 w-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
                                {role.title}
                            </h3>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                {role.description}
                            </p>

                            <div className="flex items-center text-sm font-semibold text-white/50 group-hover:text-white transition-colors">
                                Access Portal <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoleSelector;
