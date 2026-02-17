import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';

interface ReportWasteModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

const ReportWasteModal = ({ isOpen, onClose, userEmail }: ReportWasteModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        reportType: '',
        description: '',
        location: '',
        image: null as File | null
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

            // Get User ID
            const userRes = await fetch(`${API_URL}/api/users/${userEmail}`);
            if (!userRes.ok) throw new Error("User not found");
            const userData = await userRes.json();
            const userId = userData.id;

            // In a real app, we would upload the image to S3/Cloudinary here and get a URL
            // For MVP, we'll just skip the image upload or mock it
            const mockImageUrl = "https://placehold.co/600x400/png";

            const payload = {
                user_id: userId,
                report_type: formData.reportType,
                description: formData.description,
                location: { lat: 28.2096, lng: 83.9856, address: formData.location },
                image_url: mockImageUrl
            };

            const res = await fetch(`${API_URL}/api/citizen/report-waste`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to submit report");

            toast.success("Report submitted! You earned 5 credits.");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report Waste Issue</DialogTitle>
                    <DialogDescription>
                        Report illegal dumping, overflowing bins, or missed pickups.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Issue Type</Label>
                        <Select value={formData.reportType} onValueChange={(v) => setFormData({ ...formData, reportType: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="overflow">Overflowing Bin</SelectItem>
                                <SelectItem value="illegal_dumping">Illegal Dumping</SelectItem>
                                <SelectItem value="missed_pickup">Missed Pickup</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location / Address</Label>
                        <Input
                            id="location"
                            placeholder="e.g. Main St. near Park"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the issue..."
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Upload Photo (Optional)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <Camera className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Click to upload image</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                            {loading ? 'Reporting...' : 'Submit Report'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReportWasteModal;
