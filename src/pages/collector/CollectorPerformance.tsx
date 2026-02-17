import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Target, Star, Fuel, Clock } from 'lucide-react';

const CollectorPerformance = () => {
    const performanceData = {
        overallScore: 94,
        rank: 3,
        totalCollectors: 25,
        rating: 4.8,
        completionRate: 98,
        onTimePickups: 95,
        fuelEfficiency: 88,
    };

    const monthlyStats = [
        { month: 'Jan', pickups: 245, distance: 892, rating: 4.7 },
        { month: 'Feb', pickups: 268, distance: 945, rating: 4.8 },
        { month: 'Mar', pickups: 252, distance: 915, rating: 4.8 },
    ];

    const achievements = [
        { name: 'Top Performer', icon: '🏆', description: 'Ranked in top 3 this month', tier: 'gold' },
        { name: 'Speed Champion', icon: '⚡', description: '50+ on-time pickups', tier: 'silver' },
        { name: 'Fuel Saver', icon: '⛽', description: '85%+ fuel efficiency', tier: 'bronze' },
    ];

    const citizenFeedback = [
        {
            id: '1',
            citizen: 'Jane Citizen',
            rating: 5,
            comment: 'Very professional and punctual. Excellent service!',
            date: '2024-02-05',
        },
        {
            id: '2',
            citizen: 'John Doe',
            rating: 5,
            comment: 'Always on time and handles waste with care.',
            date: '2024-02-03',
        },
        {
            id: '3',
            citizen: 'Alice Smith',
            rating: 4,
            comment: 'Good service overall. Could improve communication.',
            date: '2024-02-01',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Performance Metrics</h2>
                <p className="text-muted-foreground">Track your performance and achievements</p>
            </div>

            {/* Overall Score */}
            <Card className="bg-gradient-to-br from-eco-500 to-eco-600 text-white border-0">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90 mb-2">Overall Performance Score</p>
                            <p className="text-6xl font-bold">{performanceData.overallScore}%</p>
                            <div className="flex items-center gap-4 mt-4">
                                <div>
                                    <p className="text-xs opacity-90">Your Rank</p>
                                    <p className="text-2xl font-bold">#{performanceData.rank}</p>
                                </div>
                                <div className="h-8 w-px bg-white/30" />
                                <div>
                                    <p className="text-xs opacity-90">Out of</p>
                                    <p className="text-2xl font-bold">{performanceData.totalCollectors}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <Award className="h-24 w-24 opacity-20" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            Average Rating
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{performanceData.rating} ⭐</div>
                        <p className="text-xs text-muted-foreground mt-1">Excellent feedback!</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            Completion Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-eco-600">{performanceData.completionRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Above target</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            On-Time Pickups
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{performanceData.onTimePickups}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Very punctual</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-muted-foreground" />
                            Fuel Efficiency
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{performanceData.fuelEfficiency}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Great optimization</p>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                    <CardDescription>Your performance trends over the last 3 months</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {monthlyStats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-16 text-center">
                                    <p className="font-semibold">{stat.month}</p>
                                    <p className="text-xs text-muted-foreground">2024</p>
                                </div>
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pickups</p>
                                        <p className="font-semibold">{stat.pickups}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Distance</p>
                                        <p className="font-semibold">{stat.distance} km</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Rating</p>
                                        <p className="font-semibold">{stat.rating} ⭐</p>
                                    </div>
                                </div>
                                <TrendingUp className="h-5 w-5 text-eco-600" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle>Achievements & Badges</CardTitle>
                    <CardDescription>Milestones you've unlocked</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-3">{achievement.icon}</div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{achievement.name}</h4>
                                    <Badge variant="secondary" className="capitalize">
                                        {achievement.tier}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Citizen Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Feedback</CardTitle>
                    <CardDescription>What citizens are saying about your service</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {citizenFeedback.map((feedback) => (
                            <div key={feedback.id} className="p-4 rounded-lg bg-accent">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold">{feedback.citizen}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(feedback.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="text-sm text-muted-foreground italic">"{feedback.comment}"</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CollectorPerformance;
