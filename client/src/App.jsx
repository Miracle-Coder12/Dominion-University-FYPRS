import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Admin', 'Student', 'Supervisor', 'Coordinator']} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
