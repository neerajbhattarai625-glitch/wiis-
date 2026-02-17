import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, MapPin, CheckCircle, Clock, Award, Fuel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '@/components/common/LogoutButton';

import { useEffect } from 'react';
import { toast } from 'sonner';

const CollectorDashboard = () => {
    const navigate = useNavigate();

    // WebSocket for real-time notifications
    useEffect(() => {
        const userId = 'collector_demo'; // In real app, get from auth context
        const WS_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('http', 'ws');

        const socket = new WebSocket(`${WS_URL}/api/realtime/ws/${userId}`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'pickup_notice') {
                toast.info(`New Pickup Request!`, {
                    description: `${data.waste_type} collection needed at ${data.location.address}`,
                    action: {
                        label: 'View Map',
                        onClick: () => navigate('/collector/route')
                    },
                    duration: 10000,
                });
            }
        };

        return () => socket.close();
    }, []);

    const stats = {
        todayPickups: 12,
        completedPickups: 8,
        pendingPickups: 4,
        totalDistance: 45.2,
        fuelEfficiency: 85,
        performance: 94,
    };

    const todayRoute = [
        { id: '1', location: 'Lakeside, Ward 6', time: '09:00 AM', status: 'completed', wasteType: 'recyclable' },
        { id: '2', location: 'Mahendrapul, Ward 1', time: '09:45 AM', status: 'completed', wasteType: 'organic' },
        { id: '3', location: 'Matepani, Ward 5', time: '10:30 AM', status: 'in-progress', wasteType: 'general' },
        { id: '4', location: 'Bagar, Ward 2', time: '11:15 AM', status: 'pending', wasteType: 'recyclable' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in-progress':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Collector Dashboard</h2>
                    <p className="text-muted-foreground">Manage your route and track performance</p>
                </div>
                <LogoutButton />
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Today's Pickups</CardTitle>
                        <MapPin className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.todayPickups}</div>
                        <p className="text-xs opacity-90 mt-1">
                            {stats.completedPickups} completed • {stats.pendingPickups} pending
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDistance} km</div>
                        <p className="text-xs text-eco-600 mt-1">
                            <TrendingUp className="h-3 w-3 inline" /> Efficient route today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-eco-600">{stats.performance}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Excellent performance!</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    <Button
                        variant="outline"
                        className="h-24 flex flex-col gap-2 bg-eco-500 hover:bg-eco-600 text-white border-0"
                        onClick={() => navigate('/collector/route')}
                    >
                        <MapPin className="h-6 w-6" />
                        <span>View Route Map</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-24 flex flex-col gap-2 bg-blue-500 hover:bg-blue-600 text-white border-0"
                        onClick={() => navigate('/collector/verify')}
                    >
                        <CheckCircle className="h-6 w-6" />
                        <span>Verify Pickup</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-24 flex flex-col gap-2 bg-purple-500 hover:bg-purple-600 text-white border-0"
                        onClick={() => navigate('/collector/performance')}
                    >
                        <TrendingUp className="h-6 w-6" />
                        <span>View Performance</span>
                    </Button>
                </div>
            </div>

            {/* Today's Route */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Today's Route</CardTitle>
                            <CardDescription>Your scheduled pickups for today</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate('/collector/route')}>
                            View Full Map
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {todayRoute.map((stop, index) => (
                            <div
                                key={stop.id}
                                className="flex items-start gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <p className="font-semibold">{stop.location}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <Clock className="h-3 w-3" />
                                                {stop.time}
                                            </p>
                                        </div>
                                        <Badge variant={getStatusColor(stop.status)} className="capitalize">
                                            {stop.status.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                    <Badge variant="outline" className="mt-2 capitalize">
                                        {stop.wasteType}
                                    </Badge>
                                </div>
                                {stop.status !== 'completed' && (
                                    <Button
                                        size="sm"
                                        variant={stop.status === 'in-progress' ? 'default' : 'outline'}
                                    >
                                        {stop.status === 'in-progress' ? 'Complete' : 'Start'}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Performance Summary */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Summary</CardTitle>
                        <CardDescription>Your performance this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Pickups</span>
                                <span className="font-bold">58</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Distance Covered</span>
                                <span className="font-bold">215 km</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Fuel Efficiency</span>
                                <span className="font-bold text-eco-600">{stats.fuelEfficiency}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Avg. Rating</span>
                                <span className="font-bold">4.8 ⭐</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-eco-50 to-blue-50 dark:from-eco-900/20 dark:to-blue-900/20 border-eco-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-eco-600" />
                            Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">🏆</div>
                                <div>
                                    <p className="font-semibold">Top Performer</p>
                                    <p className="text-sm text-muted-foreground">Ranked #3 this month</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">⚡</div>
                                <div>
                                    <p className="font-semibold">Speed Champion</p>
                                    <p className="text-sm text-muted-foreground">50+ on-time pickups</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CollectorDashboard;
