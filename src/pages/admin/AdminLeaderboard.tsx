import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Trophy,
    Medal,
    Star,
    Loader2,
    Search,
    User as UserIcon,
    Flame
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LeaderboardEntry {
    rank: number;
    name: string;
    points: number;
    id: string;
}

const AdminLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/leaderboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data);
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const filteredLeaderboard = leaderboard.filter(entry =>
        entry.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 2: return <Medal className="h-5 w-5 text-slate-400" />;
            case 3: return <Medal className="h-5 w-5 text-amber-600" />;
            default: return <span className="font-bold text-muted-foreground">#{rank}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Citizen Leaderboard</h2>
                    <p className="text-muted-foreground">Monitor top performers and community engagement</p>
                </div>
                <Button onClick={fetchLeaderboard} variant="outline" size="sm">
                    Refresh Data
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-yellow-100 dark:border-yellow-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-full">
                                <Trophy className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-yellow-700 dark:text-yellow-400 font-bold uppercase tracking-wider">Top Scorer</p>
                                <p className="text-lg font-bold">{leaderboard[0]?.name || '---'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-eco-50 to-green-50 dark:from-eco-900/10 dark:to-green-900/10 border-eco-100 dark:border-eco-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-eco-100 dark:bg-eco-900/40 rounded-full">
                                <Flame className="h-6 w-6 text-eco-600" />
                            </div>
                            <div>
                                <p className="text-xs text-eco-700 dark:text-eco-400 font-bold uppercase tracking-wider">Avg Points</p>
                                <p className="text-lg font-bold">
                                    {leaderboard.length > 0
                                        ? Math.round(leaderboard.reduce((acc, curr) => acc + curr.points, 0) / leaderboard.length)
                                        : 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Find a citizen by name..."
                            className="border-none shadow-none focus-visible:ring-0 text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Global Rankings</CardTitle>
                    <CardDescription>All-time credit points earned by citizens</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-eco-600" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b text-sm text-muted-foreground">
                                        <th className="pb-4 font-medium px-4">Rank</th>
                                        <th className="pb-4 font-medium">Citizen</th>
                                        <th className="pb-4 font-medium">Credit Points</th>
                                        <th className="pb-4 font-medium">Status</th>
                                        <th className="pb-4 font-medium text-right px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeaderboard.map((entry) => (
                                        <tr key={entry.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800">
                                                    {getRankIcon(entry.rank)}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-eco-100 dark:bg-eco-900/40 flex items-center justify-center">
                                                        <UserIcon className="h-5 w-5 text-eco-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{entry.name}</p>
                                                        <p className="text-xs text-muted-foreground">UID: {entry.id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 font-mono font-bold text-eco-600 text-lg">
                                                {entry.points}
                                            </td>
                                            <td className="py-4">
                                                <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    Elite
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <Button variant="ghost" size="sm">Details</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredLeaderboard.length === 0 && (
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground">No citizens found matching your search.</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLeaderboard;
