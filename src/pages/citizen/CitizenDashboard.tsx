import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/common/LogoutButton';
import {
    TrendingUp,
    Leaf,
    Trophy,
    MapPin,
    Package,
    AlertCircle,
    ArrowRight,
    Recycle,
    Coins,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Activity {
    description: string;
    type: string;
    date: string;
    impact_co2: number;
}

interface Notification {
    title: string;
    message: string;
    type: string;
    date: string;
    read: boolean;
}

import RequestPickupModal from '@/components/citizen/RequestPickupModal';
import ReportWasteModal from '@/components/citizen/ReportWasteModal';

import CarbonFootprintChart from '@/components/citizen/CarbonFootprintChart';

const CitizenDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        credits: 0,
        waste_collected: 0,
        co2_saved: 0,
        rank: 0,
    });
    const [activities, setActivities] = useState<Activity[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [pickupModalOpen, setPickupModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, user email would come from auth context/token
                const userEmail = "citizen@waste.com";
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

                const [statsRes, activitiesRes, notifRes] = await Promise.all([
                    fetch(`${API_URL}/api/citizen/stats/${userEmail}`),
                    fetch(`${API_URL}/api/citizen/activities/${userEmail}`),
                    fetch(`${API_URL}/api/citizen/notifications/${userEmail}`)
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (activitiesRes.ok) setActivities(await activitiesRes.json());
                if (notifRes.ok) setNotifications(await notifRes.json());

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-eco-600 to-eco-400">
                        Hello, Citizen 👋
                    </h2>
                    <p className="text-muted-foreground mt-1">Ready to make a difference today?</p>
                </div>
                <LogoutButton />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-eco-500 to-eco-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Credit Points</CardTitle>
                        <Coins className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.credits}</div>
                        <p className="text-xs opacity-90 mt-1">Keep up the great work! 🌱</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Waste Collected</CardTitle>
                        <Recycle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.waste_collected}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-eco-600 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> Collections
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
                        <Leaf className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.co2_saved} kg</div>
                        <p className="text-xs text-muted-foreground mt-1">Equivalent to {(stats.co2_saved / 20).toFixed(1)} trees planted 🌳</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">#{stats.rank}</div>
                        <p className="text-xs text-muted-foreground mt-1">Top 5% in your area! 🎯</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Button
                        variant="outline"
                        className="h-auto p-6 flex flex-col items-start gap-3 hover:shadow-md transition-all bg-eco-500 hover:bg-eco-600 text-white border-0"
                        onClick={() => setPickupModalOpen(true)}
                    >
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">Request Pickup</p>
                            <p className="text-xs opacity-90">Schedule a waste collection</p>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto p-6 flex flex-col items-start gap-3 hover:shadow-md transition-all bg-blue-500 hover:bg-blue-600 text-white border-0"
                        onClick={() => navigate('/citizen/tracking')}
                    >
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">Track Truck</p>
                            <p className="text-xs opacity-90">Real-time tracking</p>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto p-6 flex flex-col items-start gap-3 hover:shadow-md transition-all bg-purple-500 hover:bg-purple-600 text-white border-0"
                        onClick={() => navigate('/citizen/marketplace')}
                    >
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <Package className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">Marketplace</p>
                            <p className="text-xs opacity-90">Redeem your points</p>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-auto p-6 flex flex-col items-start gap-3 hover:shadow-md transition-all bg-orange-500 hover:bg-orange-600 text-white border-0"
                        onClick={() => setReportModalOpen(true)}
                    >
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">Report Issue</p>
                            <p className="text-xs opacity-90">Illegal dumping/overflow</p>
                        </div>
                    </Button>
                </div>
            </div>

            <RequestPickupModal
                isOpen={pickupModalOpen}
                onClose={() => setPickupModalOpen(false)}
                userEmail="citizen@waste.com"
            />

            <ReportWasteModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                userEmail="citizen@waste.com"
            />

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>Your latest eco-friendly actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activities.length === 0 ? <p className="text-sm text-muted-foreground">No recent activities.</p> : activities.map((activity, i) => (
                                <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                                    <div className={`w-10 h-10 rounded-full bg-accent flex items-center justify-center text-eco-600`}>
                                        <Recycle className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{activity.type}</p>
                                            </div>
                                            {activity.impact_co2 > 0 && (
                                                <Badge variant="secondary" className="shrink-0">
                                                    -{activity.impact_co2}kg CO₂
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Stay updated on your eco-journey</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/citizen/notifications')}>
                                View All
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {notifications.length === 0 ? <p className="text-sm text-muted-foreground">No notifications.</p> : notifications.map((notification, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${!notification.read ? 'bg-primary/5 border border-primary/20' : 'hover:bg-accent'
                                        }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm">{notification.title}</p>
                                            {!notification.read && (
                                                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{new Date(notification.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CarbonFootprintChart userEmail="citizen@waste.com" />
        </div >
    );
};

export default CitizenDashboard;
