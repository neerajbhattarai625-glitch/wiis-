import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Eye, Filter } from 'lucide-react';

const ComplaintFeedback = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');

    const complaints = [
        {
            id: 'CMP-001',
            title: 'Missed Pickup',
            description: 'The garbage truck did not arrive at the scheduled time yesterday.',
            category: 'missed-pickup',
            status: 'open',
            priority: 'high',
            createdAt: '2024-02-05',
            response: null,
        },
        {
            id: 'CMP-002',
            title: 'Bin Damage',
            description: 'My waste bin was damaged during the last pickup. The lid is broken.',
            category: 'bin-damage',
            status: 'in-progress',
            priority: 'medium',
            createdAt: '2024-02-03',
            response: 'We have received your complaint and a replacement bin will be delivered within 3 days.',
        },
        {
            id: 'CMP-003',
            title: 'Improper Collection',
            description: 'Recyclable waste was mixed with general waste during collection.',
            category: 'improper-collection',
            status: 'resolved',
            priority: 'low',
            createdAt: '2024-01-28',
            response: 'Thank you for reporting this. The collector has been notified and trained on proper waste segregation.',
        },
    ];

    const filters = [
        { value: 'all', label: 'All' },
        { value: 'open', label: 'Open' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
    ];

    const filteredComplaints =
        selectedFilter === 'all'
            ? complaints
            : complaints.filter((c) => c.status === selectedFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'destructive';
            case 'in-progress':
                return 'warning';
            case 'resolved':
                return 'success';
            default:
                return 'secondary';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'destructive';
            case 'medium':
                return 'warning';
            case 'low':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Complaints & Feedback</h2>
                    <p className="text-muted-foreground">Report issues and track their resolution</p>
                </div>
                <Button className="bg-eco-500 hover:bg-eco-600">
                    <Plus className="h-4 w-4 mr-2" />
                    New Complaint
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter by Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <Button
                                key={filter.value}
                                variant={selectedFilter === filter.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedFilter(filter.value)}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Complaints List */}
            <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                    <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                                        <Badge variant={getStatusColor(complaint.status)}>
                                            {complaint.status.replace('-', ' ')}
                                        </Badge>
                                        <Badge variant={getPriorityColor(complaint.priority)}>
                                            {complaint.priority}
                                        </Badge>
                                    </div>
                                    <CardDescription>
                                        Complaint ID: <span className="font-mono">{complaint.id}</span> •{' '}
                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Description:</p>
                                    <p className="text-sm">{complaint.description}</p>
                                </div>
                                {complaint.response && (
                                    <div className="bg-eco-50 dark:bg-eco-900/20 rounded-lg p-4 border-l-4 border-eco-500">
                                        <p className="text-sm font-semibold text-eco-700 dark:text-eco-400 mb-2 flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            Admin Response:
                                        </p>
                                        <p className="text-sm text-muted-foreground">{complaint.response}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredComplaints.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold mb-2">No complaints found</p>
                        <p className="text-sm text-muted-foreground">
                            {selectedFilter === 'all'
                                ? 'You have not submitted any complaints yet'
                                : `No ${selectedFilter} complaints`}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ComplaintFeedback;
