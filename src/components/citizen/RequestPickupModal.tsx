import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface RequestPickupModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string; // In real app, get from context
}

const RequestPickupModal = ({ isOpen, onClose, userEmail }: RequestPickupModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        wasteType: '',
        amount: '',
        date: '',
        address: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Mock fetching user ID from email for now (In real app, use auth context)
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

            // 1. Get User ID (Simplify for MVP: backend should handle this via token, but we are cheating a bit here)
            // For now, let's assume the backend endpoint handles the user lookup or we pass the email if modified.
            // But strict model says user_id. Let's fetch user_id first or mocking it if complex.
            // Actually, best practice: pass user_id prop if available. 
            // Let's assume we fetch it or simpler: The backend endpoint expects user_id.
            // We'll quickly fetch user details or just use a placeholder if we don't have auth context fully set up in this component.

            // Fetch user first
            const userRes = await fetch(`${API_URL}/api/users/${userEmail}`);
            if (!userRes.ok) throw new Error("User not found");
            const userData = await userRes.json();
            const userId = userData.id;

            const payload = {
                user_id: userId,
                waste_type: formData.wasteType,
                amount_approx: formData.amount,
                location: { lat: 28.2096, lng: 83.9856, address: formData.address }, // Mock lat/lng for Pokhara
                scheduled_date: new Date(formData.date).toISOString()
            };

            const res = await fetch(`${API_URL}/api/citizen/request-pickup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to submit request");

            toast.success("Pickup requested successfully!");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to schedule pickup");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule Waste Pickup</DialogTitle>
                    <DialogDescription>
                        Request a pickup for your sorted waste. Credits will be awarded upon verification.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Waste Type</Label>
                        <Select value={formData.wasteType} onValueChange={(v) => setFormData({ ...formData, wasteType: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="organic">Organic (Green Bin)</SelectItem>
                                <SelectItem value="recyclable">Recyclable (Blue Bin)</SelectItem>
                                <SelectItem value="hazardous">Hazardous/E-Waste</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Approx. Amount</Label>
                        <Select value={formData.amount} onValueChange={(v) => setFormData({ ...formData, amount: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select amount" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1 bag">1 Bag (Small)</SelectItem>
                                <SelectItem value="2-5 bags">2-5 Bags (Medium)</SelectItem>
                                <SelectItem value="truck load">Truck Load (Large)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Scheduled Date</Label>
                        <Input
                            type="datetime-local"
                            id="date"
                            required
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Pickup Address</Label>
                        <Input
                            id="address"
                            placeholder="Home Address"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                            {loading ? 'Scheduling...' : 'Confirm Pickup'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RequestPickupModal;
