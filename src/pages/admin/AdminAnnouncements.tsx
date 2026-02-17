import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Megaphone,
    Send,
    History,
    ShieldAlert,
    Users,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

interface Announcement {
    title: string;
    message: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    target_role: 'all' | 'citizen' | 'collector';
    date: string;
}

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        priority: 'normal',
        target_role: 'all'
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/announcements`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setFormStatus('idle');

        try {
            const response = await fetch(`${API_URL}/api/admin/announce`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormStatus('success');
                setFormData({ title: '', message: '', priority: 'normal', target_role: 'all' });
                fetchAnnouncements();
                setTimeout(() => setFormStatus('idle'), 3000);
            } else {
                setFormStatus('error');
            }
        } catch (error) {
            console.error("Error sending announcement:", error);
            setFormStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'urgent': return <Badge className="bg-red-600">Urgent</Badge>;
            case 'high': return <Badge className="bg-orange-500">High</Badge>;
            case 'normal': return <Badge className="bg-blue-500">Normal</Badge>;
            default: return <Badge variant="secondary">Low</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Announcements</h2>
                    <p className="text-muted-foreground">Broadcast messages to the WasteWise community</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Compose Form */}
                <Card className="lg:col-span-1 h-fit sticky top-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-eco-600" />
                            Compose Broadcast
                        </CardTitle>
                        <CardDescription>Send a real-time notification to users</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Emergency: Service Interruption"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Write your announcement here..."
                                    className="min-h-[120px]"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <select
                                        id="priority"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eco-500"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="target">Target Role</Label>
                                    <select
                                        id="target"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eco-500"
                                        value={formData.target_role}
                                        onChange={(e) => setFormData({ ...formData, target_role: e.target.value as any })}
                                    >
                                        <option value="all">Everyone</option>
                                        <option value="citizen">Citizens Only</option>
                                        <option value="collector">Collectors Only</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <Button
                                type="submit"
                                className="w-full bg-eco-600 hover:bg-eco-700"
                                disabled={isSending}
                            >
                                {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                Broadcast Now
                            </Button>

                            {formStatus === 'success' && (
                                <div className="flex items-center gap-2 text-eco-600 text-sm bg-eco-50 p-2 rounded w-full justify-center">
                                    <CheckCircle2 className="h-4 w-4" /> Broadcast sent successfully!
                                </div>
                            )}
                            {formStatus === 'error' && (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded w-full justify-center">
                                    <AlertCircle className="h-4 w-4" /> Failed to send. Try again.
                                </div>
                            )}
                        </CardFooter>
                    </form>
                </Card>

                {/* Announcement History */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5 text-eco-600" />
                                Broadcast History
                            </CardTitle>
                            <Badge variant="outline" className="font-normal">
                                Total: {announcements.length}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-eco-600" />
                            </div>
                        ) : announcements.length > 0 ? (
                            <div className="space-y-4">
                                {announcements.map((ann, idx) => (
                                    <div key={idx} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                {getPriorityBadge(ann.priority)}
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> {ann.target_role}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(ann.date).toLocaleDateString()} at {new Date(ann.date).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <h4 className="font-bold mb-1">{ann.title}</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{ann.message}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-accent/10 rounded-lg">
                                <ShieldAlert className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
                                <p className="text-muted-foreground">No broadcasts sent yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminAnnouncements;
