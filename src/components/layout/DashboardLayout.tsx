import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Map,
    Radio,
    ShoppingCart,
    MessageSquare,
    Brain,
    Bell,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    TrendingUp,
    MapPin,
    CheckCircle,
    BarChart3,
    Users,
    Package,
    Megaphone,
    MessageCircle,
    Trophy,
    Lightbulb,
    Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'citizen' | 'collector' | 'admin';
}

interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
}

const navigationConfig: Record<string, NavItem[]> = {
    citizen: [
        { name: 'Dashboard', path: '/citizen', icon: Home },
        { name: 'Interactive Map', path: '/citizen/map', icon: Map },
        { name: 'Live Tracking', path: '/citizen/tracking', icon: Radio },
        { name: 'Marketplace', path: '/citizen/marketplace', icon: ShoppingCart },
        { name: 'Complaints', path: '/citizen/complaints', icon: MessageSquare },
        { name: 'AI Waste Assistant', path: '/citizen/ai-assistant', icon: Brain },
        { name: 'AR Waste Scan', path: '/citizen/ar-scan', icon: Camera },
        { name: 'Notifications', path: '/citizen/notifications', icon: Bell, badge: 5 },
        { name: 'Profile', path: '/citizen/profile', icon: User },
    ],
    collector: [
        { name: 'Dashboard', path: '/collector', icon: Home },
        { name: 'Route Map', path: '/collector/route', icon: MapPin },
        { name: 'Verify Pickup', path: '/collector/verify', icon: CheckCircle },
        { name: 'Performance', path: '/collector/performance', icon: TrendingUp },
    ],
    admin: [
        { name: 'Dashboard', path: '/admin', icon: BarChart3 },
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Marketplace', path: '/admin/marketplace', icon: Package },
        { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
        { name: 'Feedback', path: '/admin/feedback', icon: MessageCircle },
        { name: 'AI Insights', path: '/admin/ai-insights', icon: Lightbulb },
        { name: 'Leaderboard', path: '/admin/leaderboard', icon: Trophy },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
};

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = navigationConfig[role] || [];

    // Mock user data - to be replaced with actual auth state
    const user = {
        name: role === 'admin' ? 'Admin User' : role === 'collector' ? 'John Collector' : 'Jane Citizen',
        email: `${role}@wastemanagement.com`,
        avatar: '',
        creditPoints: role === 'citizen' ? 1250 : undefined,
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        sessionStorage.clear();
        navigate('/login');
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex md:flex-col w-64 border-r bg-card">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-eco-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">W</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">EcoWaste</h1>
                            <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="flex-1">{item.name}</span>
                                {item.badge && (
                                    <Badge variant="destructive" className="ml-auto">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {role === 'citizen' && user.creditPoints !== undefined && (
                    <div className="p-4 border-t">
                        <div className="bg-gradient-to-br from-eco-500 to-eco-600 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Credit Points</p>
                            <p className="text-3xl font-bold">{user.creditPoints}</p>
                            <p className="text-xs opacity-75 mt-1">Keep recycling! 🌱</p>
                        </div>
                    </div>
                )}
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 md:hidden',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-eco-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">W</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">EcoWaste</h1>
                            <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="flex-1">{item.name}</span>
                                {item.badge && (
                                    <Badge variant="destructive" className="ml-auto">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 border-b bg-card flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div>
                            <h2 className="text-lg font-semibold">
                                {navItems.find((item) => isActive(item.path))?.name || 'Dashboard'}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Welcome back, {user.name.split(' ')[0]}! 👋
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </Button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>
                                            {user.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to={`/${role}/profile`}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                {role === 'admin' && (
                                    <DropdownMenuItem asChild>
                                        <Link to="/admin/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
