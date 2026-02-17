import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Lightbulb,
    Brain,
    TrendingUp,
    AlertCircle,
    Map as MapIcon,
    Zap,
    Download,
    RefreshCcw,
    Loader2
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const mockPredictionData = [
    { day: 'Mon', organic: 120, recyclable: 80, hazardous: 10 },
    { day: 'Tue', organic: 140, recyclable: 90, hazardous: 12 },
    { day: 'Wed', organic: 110, recyclable: 70, hazardous: 8 },
    { day: 'Thu', organic: 160, recyclable: 110, hazardous: 15 },
    { day: 'Fri', organic: 190, recyclable: 130, hazardous: 20 },
    { day: 'Sat', organic: 220, recyclable: 150, hazardous: 25 },
    { day: 'Sun', organic: 180, recyclable: 120, hazardous: 18 },
];

const AdminAIInsights = () => {
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const runAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => setAnalyzing(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-eco-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">AI Predictive Insights</h2>
                    <p className="text-muted-foreground">Advanced analytics and waste generation forecasting</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={runAnalysis}>
                        <RefreshCcw className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
                        {analyzing ? 'Analyzing Data...' : 'Run Prediction Engine'}
                    </Button>
                    <Button className="bg-eco-600 hover:bg-eco-700">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Demand Forecast */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-eco-600" />
                            Next 7-Day Waste Forecast
                        </CardTitle>
                        <CardDescription>Predicted waste generation volume (kg) by category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockPredictionData}>
                                <defs>
                                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="organic"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorOrganic)"
                                    strokeWidth={3}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="recyclable"
                                    stroke="#3b82f6"
                                    fillOpacity={0.1}
                                    fill="#3b82f6"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. Hotspot Warnings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Hotspot Predictions
                        </CardTitle>
                        <CardDescription>Probability of overflow in upcoming 24h</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { area: 'Lakeside Sector 6', prob: 92, type: 'Urgent' },
                            { area: 'Prithvi Chowk', prob: 78, type: 'High' },
                            { area: 'Bagar Central', prob: 64, type: 'Moderate' },
                        ].map((spot, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border">
                                <div>
                                    <p className="font-semibold text-sm">{spot.area}</p>
                                    <p className="text-xs text-muted-foreground">{spot.prob}% probability</p>
                                </div>
                                <Badge variant={spot.type === 'Urgent' ? 'destructive' : spot.type === 'High' ? 'warning' : 'default'}>
                                    {spot.type}
                                </Badge>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-xs text-eco-600">
                            Deploy Collectors to Hotspots
                        </Button>
                    </CardContent>
                </Card>

                {/* 3. Smart Recommendations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-500" />
                            AI Strategy Engine
                        </CardTitle>
                        <CardDescription>Optimization suggestions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-purple-50 border border-purple-100 dark:bg-purple-950/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-bold text-purple-900 dark:text-purple-100">Route Optimization</span>
                            </div>
                            <p className="text-xs text-purple-800 dark:text-purple-200">
                                Converging Lakeside Sector 6 and 7 routes could save 15% fuel consumption tomorrow based on current vehicle load.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-eco-50 border border-eco-100 dark:bg-eco-950/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-4 w-4 text-eco-600" />
                                <span className="text-sm font-bold text-eco-900 dark:text-eco-100">Incentive Adjustment</span>
                            </div>
                            <p className="text-xs text-eco-800 dark:text-eco-200">
                                Recycling participation is low in Bagar. Suggesting temporary 1.5x point multiplier to boost collection.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Impact metrics */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            Eco-Savings Analysis
                        </CardTitle>
                        <CardDescription>Real-time CO2 offset vs Target</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockPredictionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line type="stepAfter" dataKey="hazardous" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50/50 p-4">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground w-full">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-500" /> Carbon Prevented
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-slate-300" /> Monthly Goal
                            </div>
                            <p className="ml-auto font-semibold text-eco-600">On Track: +12%</p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default AdminAIInsights;
