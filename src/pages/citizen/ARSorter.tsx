import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, X, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ARSorter = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<null | { type: string; color: string; info: string }>(null);

    const startScan = () => {
        setScanning(true);
        setResult(null);
        // Simulate AR Scanning
        setTimeout(() => {
            setScanning(false);
            setResult({
                type: 'Plastic Bottle (PET)',
                color: 'blue',
                info: 'Rinse before disposal. Place in the Blue Bin.'
            });
        }, 3000);
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between text-white bg-black/50 backdrop-blur-md z-10">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <X className="h-6 w-6" />
                </Button>
                <h1 className="text-lg font-semibold italic">WasteWise AR Scan</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Camera Viewport Placeholder */}
            <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
                {/* Simulated Camera Feed */}
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
                        alt="Environment"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* AR Overlays */}
                <div className="relative w-64 h-64 border-2 border-white/30 rounded-3xl flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-eco-500 rounded-3xl animate-pulse opacity-50" />

                    {scanning && (
                        <div className="text-white text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="mb-4"
                            >
                                <Camera className="h-12 w-12 mx-auto text-eco-400" />
                            </motion.div>
                            <p className="text-sm font-medium tracking-widest uppercase">Analyzing...</p>
                        </div>
                    )}

                    {!scanning && !result && (
                        <Button
                            onClick={startScan}
                            className="bg-eco-600 hover:bg-eco-700 text-white rounded-full px-8 py-6 h-auto shadow-2xl"
                        >
                            <Camera className="mr-2 h-6 w-6" /> Start AR Scan
                        </Button>
                    )}
                </div>

                {/* Dynamic Instructions */}
                <div className="absolute bottom-12 left-0 right-0 px-8">
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-4 text-white text-center">
                        <p className="text-sm">Point your camera at a waste item to get instant sorting guidance.</p>
                    </Card>
                </div>
            </div>

            {/* Result Overlay */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="absolute bottom-0 inset-x-0 bg-white rounded-t-[2.5rem] shadow-2xl z-20 p-8"
                    >
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-blue-100 p-3 rounded-2xl">
                                <CheckCircle2 className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{result.type}</h2>
                                <p className="text-blue-600 font-semibold uppercase text-xs tracking-wider">Recyclable</p>
                            </div>
                        </div>

                        <Card className="bg-slate-50 border-0 p-4 mb-8">
                            <div className="flex gap-3">
                                <Info className="h-5 w-5 text-slate-400 shrink-0" />
                                <p className="text-slate-600 text-sm">{result.info}</p>
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="h-14 font-semibold"
                                onClick={() => setResult(null)}
                            >
                                Scan Another
                            </Button>
                            <Button
                                className="h-14 bg-eco-600 hover:bg-eco-700 font-semibold"
                                onClick={() => navigate('/citizen/pickup-request')}
                            >
                                Schedule Pickup
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ARSorter;
