import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Trash2, Trophy, Info, AlertCircle, CheckCircle, Package } from 'lucide-react';

const Notifications = () => {
    const notifications = [
        {
            id: '1',
            type: 'success',
            icon: CheckCircle,
            title: 'Pickup Completed',
            message: 'Your waste has been collected successfully. 50 points have been credited to your account.',
            time: '5 minutes ago',
            read: false,
        },
        {
            id: '2',
            type: 'info',
            icon: Bell,
            title: 'Upcoming Pickup',
            message: 'Your next scheduled pickup is tomorrow at 10:00 AM. Please keep your waste ready.',
            time: '2 hours ago',
            read: false,
        },
        {
            id: '3',
            type: 'achievement',
            icon: Trophy,
            title: 'Achievement Unlocked! 🎉',
            message: 'Congratulations! You have earned the "Recycling Champion - Bronze" badge.',
            time: '1 day ago',
            read: true,
        },
        {
            id: '4',
            type: 'warning',
            icon: AlertCircle,
            title: 'Improper Segregation Detected',
            message: 'Please ensure proper waste segregation for better recycling. Refer to our guide for help.',
            time: '2 days ago',
            read: true,
        },
        {
            id: '5',
            type: 'success',
            icon: Package,
            title: 'Order Delivered',
            message: 'Your eco-friendly water bottle has been delivered. Thank you for your purchase!',
            time: '3 days ago',
            read: true,
        },
        {
            id: '6',
            type: 'info',
            icon: Info,
            title: 'New Challenge Available',
            message: 'Join the "Zero Waste Week" challenge and earn 500 bonus points! Challenge ends in 5 days.',
            time: '4 days ago',
            read: true,
        },
    ];

    const getNotificationStyle = (type: string) => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-eco-50 dark:bg-eco-900/20',
                    border: 'border-eco-200',
                    iconBg: 'bg-eco-500',
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                    border: 'border-yellow-200',
                    iconBg: 'bg-yellow-500',
                };
            case 'achievement':
                return {
                    bg: 'bg-purple-50 dark:bg-purple-900/20',
                    border: 'border-purple-200',
                    iconBg: 'bg-purple-500',
                };
            default:
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-200',
                    iconBg: 'bg-blue-500',
                };
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    <p className="text-muted-foreground">Stay updated on your eco-journey</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Mark All as Read
                    </Button>
                    <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{notifications.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Unread</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-eco-600">
                            {notifications.filter((n) => !n.read).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {notifications.filter((n) => n.type === 'achievement').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.map((notification) => {
                    const Icon = notification.icon;
                    const style = getNotificationStyle(notification.type);

                    return (
                        <Card
                            key={notification.id}
                            className={`${!notification.read ? `${style.bg} ${style.border}` : ''} transition-all hover:shadow-md`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full ${style.iconBg} flex items-center justify-center shrink-0`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                                            {!notification.read && (
                                                <div className="w-2 h-2 rounded-full bg-eco-500 shrink-0 mt-1" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Notifications;
