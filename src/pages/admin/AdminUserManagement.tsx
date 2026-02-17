import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';

const AdminUserManagement = () => {
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const users = [
        {
            id: '1',
            name: 'Jane Citizen',
            email: 'jane@email.com',
            role: 'citizen',
            status: 'active',
            points: 1250,
            joinedDate: '2024-01-15',
            lastActive: '2 hours ago',
        },
        {
            id: '2',
            name: 'John Smith',
            email: 'john.smith@email.com',
            role: 'collector',
            status: 'active',
            rating: 4.8,
            joinedDate: '2023-12-01',
            lastActive: '30 minutes ago',
        },
        {
            id: '3',
            name: 'Alice Admin',
            email: 'alice.admin@email.com',
            role: 'admin',
            status: 'active',
            joinedDate: '2023-11-01',
            lastActive: '5 minutes ago',
        },
        {
            id: '4',
            name: 'Bob Johnson',
            email: 'bob@email.com',
            role: 'citizen',
            status: 'inactive',
            points: 320,
            joinedDate: '2024-01-20',
            lastActive: '2 weeks ago',
        },
        {
            id: '5',
            name: 'Carol Lee',
            email: 'carol.lee@email.com',
            role: 'collector',
            status: 'active',
            rating: 4.6,
            joinedDate: '2024-01-10',
            lastActive: '1 hour ago',
        },
    ];

    const stats = {
        totalUsers: 1248,
        citizens: 1215,
        collectors: 25,
        admins: 8,
    };

    const roleFilters = [
        { value: 'all', label: 'All Roles' },
        { value: 'citizen', label: 'Citizens' },
        { value: 'collector', label: 'Collectors' },
        { value: 'admin', label: 'Admins' },
    ];

    const statusFilters = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const filteredUsers = users.filter((user) => {
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
        return matchesRole && matchesStatus;
    });

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'collector':
                return 'warning';
            default:
                return 'success';
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        return status === 'active' ? 'success' : 'secondary';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-muted-foreground">Manage all system users</p>
                </div>
                <Button className="bg-eco-500 hover:bg-eco-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            Total Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Citizens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-eco-600">{stats.citizens}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Collectors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.collectors}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Admins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">Role</p>
                            <div className="flex flex-wrap gap-2">
                                {roleFilters.map((filter) => (
                                    <Button
                                        key={filter.value}
                                        variant={selectedRole === filter.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedRole(filter.value)}
                                    >
                                        {filter.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">Status</p>
                            <div className="flex flex-wrap gap-2">
                                {statusFilters.map((filter) => (
                                    <Button
                                        key={filter.value}
                                        variant={selectedStatus === filter.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedStatus(filter.value)}
                                    >
                                        {filter.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="flex-1 bg-transparent outline-none text-sm"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        Showing {filteredUsers.length} of {users.length} users
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-gradient-to-br from-eco-500 to-eco-600 text-white">
                                        {user.name.split(' ').map((n) => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-semibold truncate">{user.name}</p>
                                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize shrink-0">
                                            {user.role}
                                        </Badge>
                                        <Badge variant={getStatusBadgeVariant(user.status)} className="capitalize shrink-0">
                                            {user.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                        <span>Joined: {user.joinedDate}</span>
                                        <span>•</span>
                                        <span>Last active: {user.lastActive}</span>
                                        {user.role === 'citizen' && user.points && (
                                            <>
                                                <span>•</span>
                                                <span className="text-eco-600 font-semibold">{user.points} pts</span>
                                            </>
                                        )}
                                        {user.role === 'collector' && user.rating && (
                                            <>
                                                <span>•</span>
                                                <span className="text-yellow-600 font-semibold">{user.rating} ⭐</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Button variant="outline" size="sm">
                                        <Edit2 className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUserManagement;
