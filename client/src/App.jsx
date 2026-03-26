import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProjectDetails from './pages/ProjectDetails';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Help from './pages/Help';

import ProjectUpload from './pages/ProjectUpload';
import ProjectListing from './pages/ProjectListing';
import History from './pages/History';
import Settings from './pages/Settings';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/help" element={<Help />} />

                {/* Protected Routes wrapped in DashboardLayout */}
                <Route element={
                    <ProtectedRoute allowedRoles={['Admin', 'Student', 'Lecturer', 'Supervisor']}>
                        <DashboardLayout>
                            <Outlet />
                        </DashboardLayout>
                    </ProtectedRoute>
                }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* Restrict Upload to Staff roles only */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin', 'Lecturer', 'Supervisor', 'Coordinator']} />}>
                        <Route path="/projects/upload" element={<ProjectUpload />} />
                    </Route>

                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route path="/admin/users" element={<AdminDashboard />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* Placeholder for other routes */}
                </Route>

                <Route element={
                    <ProtectedRoute allowedRoles={['Admin', 'Student', 'Lecturer', 'Supervisor']}>
                        <Outlet />
                    </ProtectedRoute>
                }>
                    <Route path="/projects" element={<ProjectListing />} />
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
