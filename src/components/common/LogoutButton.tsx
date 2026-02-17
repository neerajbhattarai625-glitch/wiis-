import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className }: { className?: string }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear auth tokens
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        sessionStorage.clear();

        // Redirect to Landing Page or Login
        navigate('/');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className={`text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 ${className}`}
            onClick={handleLogout}
        >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
        </Button>
    );
};

export default LogoutButton;
