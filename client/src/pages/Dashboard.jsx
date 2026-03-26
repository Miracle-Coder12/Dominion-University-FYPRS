import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import SupervisorDashboard from './SupervisorDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case 'Admin':
            return <AdminDashboard />;
        case 'Supervisor':
        case 'Lecturer':
            return <SupervisorDashboard />;
        case 'Student':
            return <StudentDashboard />;
        default:
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
                        <p className="text-gray-500 mt-2">Your account role ({user.role}) does not have a designated dashboard.</p>
                    </div>
                </div>
            );
    }
};

export default Dashboard;
