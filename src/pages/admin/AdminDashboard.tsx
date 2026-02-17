import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Users, Truck, Trash2, TrendingUp, DollarSign, Leaf, Loader2 } from 'lucide-react';
import LogoutButton from '@/components/common/LogoutButton';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        users: 0,
        activities: 0,
        pickup_requests: 0,
        total_credits_spent: 0
    });
    const [auditLogs, setAuditLogs] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const token = localStorage.getItem('token');

                const [statsRes, logsRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/stats`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_URL}/api/admin/audit-logs?limit=5`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                if (logsRes.ok) {
                    const logsData = await logsRes.json();
                    setAuditLogs(logsData);
                }
            } catch (error) {
                console.error("Failed to fetch admin dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const wasteCollectionData = [
        { month: 'Jan', recyclable: 1200, organic: 800, general: 400, hazardous: 50 },
        { month: 'Feb', recyclable: 1350, organic: 850, general: 380, hazardous: 45 },
        { month: 'Mar', recyclable: 1400, organic: 900, general: 360, hazardous: 40 },
        { month: 'Apr', recyclable: 1500, organic: 950, general: 350, hazardous: 35 },
        { month: 'May', recyclable: 1580, organic: 1000, general: 340, hazardous: 30 },
    ];

    const wasteComposition = [
        { name: 'Recyclable', value: 45, color: '#22c55e' },
        { name: 'Organic', value: 30, color: '#f59e0b' },
        { name: 'General', value: 20, color: '#6b7280' },
        { name: 'Hazardous', value: 5, color: '#ef4444' },
    ];

    const collectionEfficiency = [
        { week: 'Week 1', efficiency: 85 },
        { week: 'Week 2', efficiency: 88 },
        { week: 'Week 3', efficiency: 92 },
        { week: 'Week 4', efficiency: 90 },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                    <p className="text-muted-foreground">System-wide analytics and insights</p>
                </div>
                <LogoutButton />
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.users.toLocaleString()}</div>
                        <p className="text-xs opacity-90 mt-1">
                            Registered system users
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-eco-500 to-eco-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">System Activities</CardTitle>
                        <TrendingUp className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.activities.toLocaleString()}</div>
                        <p className="text-xs opacity-90 mt-1">Total actions logged</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pickup Requests</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pickup_requests.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total citizen requests</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Revenue (Credits)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.abs(stats.total_credits_spent).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Marketplace transactions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Waste Collection Trends</CardTitle>
                        <CardDescription>Monthly waste collection by type (kg)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={wasteCollectionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="recyclable" fill="#22c55e" name="Recyclable" />
                                <Bar dataKey="organic" fill="#f59e0b" name="Organic" />
                                <Bar dataKey="general" fill="#6b7280" name="General" />
                                <Bar dataKey="hazardous" fill="#ef4444" name="Hazardous" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Waste Composition</CardTitle>
                        <CardDescription>Current waste distribution by type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={wasteComposition}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name}: ${entry.value}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {wasteComposition.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>System Audit Logs</CardTitle>
                        <CardDescription>Real-time system activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {auditLogs.length > 0 ? (
                                auditLogs.map((log: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={log.method === 'POST' ? 'default' : log.method === 'PUT' ? 'warning' : 'destructive'} className="text-[10px]">
                                                    {log.method}
                                                </Badge>
                                                <span className="font-mono text-xs">{log.endpoint}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground mt-1">IP: {log.ip_address}</span>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={log.status_code < 400 ? 'success' : 'destructive'}>
                                                {log.status_code}
                                            </Badge>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {new Date(log.timestamp * 1000).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-center text-muted-foreground py-4">No recent activity logs</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                        <CardDescription>Service status and alerts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-eco-50 dark:bg-eco-900/20 border-l-4 border-eco-500 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm text-eco-700 dark:text-eco-400">Database Connection</p>
                                    <p className="text-xs text-muted-foreground mt-1">MongoDB is online and synchronized</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-eco-500 animate-pulse" />
                            </div>
                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm text-blue-700 dark:text-blue-400">WebSocket Server</p>
                                    <p className="text-xs text-muted-foreground mt-1">Broadcasting system active</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            </div>
                            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500">
                                <p className="font-semibold text-sm text-yellow-700 dark:text-yellow-400">Maintenance Window</p>
                                <p className="text-xs text-muted-foreground mt-1">Database backup scheduled for Sunday 2:00 AM</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
