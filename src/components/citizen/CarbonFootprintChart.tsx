import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Leaf } from 'lucide-react';

interface CarbonData {
    date: string;
    co2: number;
    activities: number;
}

const CarbonFootprintChart = ({ userEmail }: { userEmail: string }) => {
    const [data, setData] = useState<CarbonData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCarbonData = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const res = await fetch(`${API_URL}/api/citizen/carbon-footprint/${userEmail}`);

                if (res.ok) {
                    const carbonData = await res.json();
                    setData(carbonData);
                }
            } catch (error) {
                console.error("Failed to fetch carbon footprint data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCarbonData();
    }, [userEmail]);

    if (loading) return <div className="h-[200px] flex items-center justify-center text-sm text-gray-500">Loading chart...</div>;

    if (data.length === 0) {
        return (
            <div className="h-[200px] flex flex-col items-center justify-center text-sm text-gray-500 border border-dashed rounded-lg p-4">
                <Leaf className="h-8 w-8 text-eco-200 mb-2" />
                <p>No carbon footprint data available yet.</p>
                <p className="text-xs">Complete activities to see your impact!</p>
            </div>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Carbon Footprint Trends</CardTitle>
                <CardDescription>Visualizing your daily CO2 savings</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00C897" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#00C897" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                minTickGap={10}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="co2"
                                stroke="#00C897"
                                fillOpacity={1}
                                fill="url(#colorCo2)"
                                name="CO2 Saved (kg)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default CarbonFootprintChart;
