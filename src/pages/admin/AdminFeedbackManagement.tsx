import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MessageCircle,
    CheckCircle,
    AlertTriangle,
    Clock,
    MoreVertical,
    Search,
    MapPin,
    Calendar,
    Loader2,
    Filter
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FeedbackReport {
    id: string;
    description: string;
    report_type: 'overflow' | 'illegal_dumping' | 'missed_pickup';
    status: 'reported' | 'investigating' | 'resolved';
    location: {
        address: string;
        lat?: number;
        lng?: number;
    };
    report_date: string;
    image_url?: string;
}

const AdminFeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState<FeedbackReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/feedback`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFeedbacks(data);
            }
        } catch (error) {
            console.error("Failed to fetch feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const handleResolve = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/feedback/${id}/resolve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchFeedback();
            } else {
                alert("Failed to resolve feedback");
            }
        } catch (error) {
            console.error("Error resolving feedback:", error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'resolved':
                return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Resolved</Badge>;
            case 'investigating':
                return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Investigating</Badge>;
            default:
                return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Reported</Badge>;
        }
    };

    const getReportTypeIcon = (type: string) => {
        switch (type) {
            case 'overflow':
                return <Badge variant="outline" className="text-red-600 border-red-200">Bin Overflow</Badge>;
            case 'illegal_dumping':
                return <Badge variant="outline" className="text-purple-600 border-purple-200">Illegal Dumping</Badge>;
            default:
                return <Badge variant="outline" className="text-blue-600 border-blue-200">Missed Pickup</Badge>;
        }
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
        const matchesSearch = f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.report_type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Feedback Management</h2>
                    <p className="text-muted-foreground">Monitor and resolve citizen reports</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => fetchFeedback()}>
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input
                                placeholder="Search reports..."
                                className="flex-1 bg-transparent border-none outline-none text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <select
                                className="flex-1 bg-transparent border-none outline-none text-sm"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="reported">Reported</option>
                                <option value="investigating">Investigating</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
                </div>
            ) : filteredFeedbacks.length > 0 ? (
                <div className="space-y-4">
                    {filteredFeedbacks.map((report) => (
                        <Card key={report.id} className="hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row">
                                {report.image_url && (
                                    <div className="md:w-48 h-32 md:h-auto overflow-hidden border-r">
                                        <img src={report.image_url} alt="Report" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {getReportTypeIcon(report.report_type)}
                                                {getStatusBadge(report.status)}
                                            </div>
                                            <h3 className="font-semibold text-lg mt-2">{report.description}</h3>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleResolve(report.id)} disabled={report.status === 'resolved'}>
                                                    <CheckCircle className="h-4 w-4 mr-2" /> Mark as Resolved
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">
                                                    <AlertTriangle className="h-4 w-4 mr-2" /> High Priority
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground mt-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-eco-500" />
                                            {report.location?.address || 'Unknown Location'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            {new Date(report.report_date).toLocaleDateString()} at {new Date(report.report_date).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {report.status !== 'resolved' && (
                                <CardFooter className="bg-slate-50 dark:bg-slate-900/50 p-3 flex justify-end gap-2 border-t">
                                    <Button size="sm" variant="outline">
                                        Assign Team
                                    </Button>
                                    <Button size="sm" className="bg-eco-600 hover:bg-eco-700" onClick={() => handleResolve(report.id)}>
                                        Resolve Report
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-accent/20 rounded-xl border border-dashed">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-semibold">No feedback found</h3>
                    <p className="text-muted-foreground">Citizens are currently happy or no reports have been submitted.</p>
                </div>
            )}
        </div>
    );
};

export default AdminFeedbackManagement;
