import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, MapPin, Calendar, Trophy, Leaf, Award, Coins, TrendingUp } from 'lucide-react';

const Profile = () => {
    const user = {
        name: 'Jane Citizen',
        email: 'jane.citizen@email.com',
        phone: '+1 234 567 8900',
        location: 'Pokhara, Gandaki Province',
        joinedDate: 'January 2024',
        avatar: '',
    };

    const stats = {
        creditPoints: 1250,
        totalWaste: 145.5,
        co2Saved: 42.3,
        rank: 23,
        recyclingRate: 78,
    };

    const achievements = [
        {
            id: '1',
            name: 'Recycling Champion',
            tier: 'gold',
            icon: '🏆',
            description: 'Collected 100kg of recyclable waste',
            unlockedDate: '2024-01-15',
        },
        {
            id: '2',
            name: 'Eco Warrior',
            tier: 'silver',
            icon: '🌱',
            description: 'Saved 25kg of CO₂ emissions',
            unlockedDate: '2024-01-20',
        },
        {
            id: '3',
            name: 'Green Pioneer',
            tier: 'bronze',
            icon: '🌿',
            description: 'Completed first 10 pickups',
            unlockedDate: '2024-01-10',
        },
    ];

    const activities = [
        { month: 'Jan 2024', waste: 45.5, points: 450 },
        { month: 'Feb 2024', waste: 52.0, points: 520 },
        { month: 'Mar 2024', waste: 48.0, points: 480 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">My Profile</h2>
                <p className="text-muted-foreground">Manage your account and view your eco-journey</p>
            </div>

            {/* Profile Info */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="w-32 h-32">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-3xl">
                                    {user.name.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm">
                                Change Photo
                            </Button>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Full Name</p>
                                        <p className="font-semibold">{user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-semibold">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p className="font-semibold">{user.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Member Since</p>
                                        <p className="font-semibold">{user.joinedDate}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button className="mr-2">Edit Profile</Button>
                                <Button variant="outline">Change Password</Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="bg-gradient-to-br from-eco-500 to-eco-600 text-white border-0">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Coins className="h-4 w-4" />
                            Credit Points
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.creditPoints}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                            Rank
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">#{stats.rank}</div>
                        <p className="text-xs text-muted-foreground">Top 5%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-muted-foreground" />
                            Total Waste
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalWaste} kg</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            CO₂ Saved
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-eco-600">{stats.co2Saved} kg</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            Recycling Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.recyclingRate}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle>My Achievements</CardTitle>
                    <CardDescription>Badges earned through your eco-friendly actions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-4xl">{achievement.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold">{achievement.name}</h4>
                                            <Badge variant="secondary" className="capitalize">
                                                {achievement.tier}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Activity History */}
            <Card>
                <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                    <CardDescription>Your monthly waste collection and points summary</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-accent">
                                <div>
                                    <p className="font-semibold">{activity.month}</p>
                                    <p className="text-sm text-muted-foreground">{activity.waste} kg waste collected</p>
                                </div>
                                <Badge variant="success" className="text-base">
                                    +{activity.points} points
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
