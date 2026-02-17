import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, User as UserIcon, Calendar, Eye, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface PendingUser {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
    id_photo_url: string;
}

const AdminVerification = () => {
    const [users, setUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');

    const fetchPending = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/verify/pending`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setUsers(data);
        } catch (err: any) {
            toast.error('Failed to load pending verifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (userId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/verify/approve/${userId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to approve');
            toast.success('User verified successfully!');
            setUsers(users.filter(u => u.id !== userId));
            setSelectedUser(null);
        } catch (err) {
            toast.error('Approval failed');
        }
    };

    const handleReject = async (userId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/verify/reject/${userId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to reject');
            toast.success('Verification rejected');
            setUsers(users.filter(u => u.id !== userId));
            setSelectedUser(null);
        } catch (err) {
            toast.error('Rejection failed');
        }
    };

    if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="animate-spin mr-2" /> Loading...</div>

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Identity Verification</h1>
                    <p className="text-slate-500">Review citizenship documents for new account requests</p>
                </div>
                <Badge variant="outline" className="text-lg py-1 px-4">{users.length} Pending</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* List of Users */}
                <Card className="md:col-span-1 h-[calc(100vh-250px)] overflow-y-auto">
                    <CardHeader>
                        <CardTitle>Queue</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {users.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <ShieldAlert className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p>No pending verifications</p>
                            </div>
                        ) : (
                            users.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`p-4 border-b cursor-pointer transition-colors hover:bg-slate-50 ${selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                            <UserIcon className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Detail View */}
                <Card className="md:col-span-2">
                    {selectedUser ? (
                        <CardContent className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                                    <p className="text-slate-500">{selectedUser.email}</p>
                                    <div className="flex items-center gap-4 mt-4 text-sm font-medium">
                                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined: {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                                        <Badge className="capitalize">{selectedUser.role}</Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(selectedUser.id)}>
                                        <X className="h-4 w-4 mr-1" /> Reject
                                    </Button>
                                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(selectedUser.id)}>
                                        <Check className="h-4 w-4 mr-1" /> Approve Account
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-lg">Citizenship / National ID Photo</Label>
                                <div className="border-4 border-slate-100 rounded-2xl overflow-hidden bg-slate-100 aspect-video relative group">
                                    {/* Link to show original image if needed */}
                                    <img
                                        src={`${API_URL}/static/${selectedUser.id_photo_url.replace('uploads/', '')}`}
                                        alt="ID Proof"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/800x450/e2e8f0/64748b?text=ID+IMAGE+CONTENT';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="secondary" onClick={() => window.open(`${API_URL}/static/${selectedUser.id_photo_url.replace('uploads/', '')}`, '_blank')}>
                                            <Eye className="h-4 w-4 mr-2" /> View Original
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 text-center">Verify that the name and details on the ID match the registered account details.</p>
                            </div>
                        </CardContent>
                    ) : (
                        <div className="h-full flex items-center justify-center p-20 text-slate-400 flex-col gap-4">
                            <Eye className="h-16 w-16 opacity-10" />
                            <p>Select a user from the queue to review documents</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AdminVerification;
