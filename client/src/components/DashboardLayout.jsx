import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    GraduationCap,
    LayoutDashboard,
    BookOpen,
    Upload,
    Users,
    CheckCircle,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import { Button } from './ui/Button';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const studentNavigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Search Projects', href: '/projects', icon: Search },
        { name: 'My Projects', href: '/projects', icon: BookOpen },
        { name: 'Upload Project', href: '/projects/upload', icon: Upload },
    ];

    const adminNavigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Approvals', href: '/admin/approvals', icon: CheckCircle },
    ];

    const navigation = user?.role === 'Admin' ? adminNavigation : studentNavigation;

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
    };

    // Shared Sidebar Content to avoid duplication
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white">
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-8 py-10">
                <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-xl shadow-blue-100/50">
                    <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">Dominion</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">University</p>
                </div>
            </div>

            {/* Primary Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto">
                {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 ${active
                                    ? 'bg-blue-50/50 text-blue-700'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom User Profile Section */}
            <div className="p-6 mt-auto space-y-2 border-t border-gray-50/80 bg-gray-50/20">
                {/* User Card */}
                <div className="flex items-center gap-3 px-3 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-black flex items-center justify-center text-xs border-2 border-white shadow-sm ring-1 ring-blue-100/30">
                        {getInitials(user?.name || user?.username)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-black text-gray-900 truncate leading-tight">
                            {user?.name || user?.username || 'Student User'}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5 tracking-tight">
                            {user?.email || `${user?.username || 'user'}@dominion.edu.ng`}
                        </p>
                    </div>
                </div>

                <div className="px-1 space-y-1">
                    <Link 
                        to="/settings" 
                        className="flex items-center gap-3.5 px-4 py-2.5 text-sm font-bold text-gray-500 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all group"
                    >
                        <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        Settings
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-3.5 px-4 py-2.5 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50 transition-all group"
                    >
                        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
            {/* 1. Desktop Sidebar - Always static and visible on lg+ */}
            <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-gray-100 bg-white">
                <SidebarContent />
            </aside>

            {/* 2. Mobile Sidebar Drawer */}
            <div className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={() => setSidebarOpen(false)}
                />
                {/* Drawer */}
                <aside 
                    className={`absolute inset-y-0 left-0 w-72 bg-white shadow-2xl transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <SidebarContent />
                    <button 
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-10 right-[-50px] bg-white p-2 rounded-full shadow-lg lg:hidden"
                    >
                        <X className="w-6 h-6 text-gray-900" />
                    </button>
                </aside>
            </div>

            {/* 3. Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-gray-50">
                {/* Mobile Top Navbar (Hamburger) */}
                <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-3 -ml-2 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
                    >
                        <Menu className="w-7 h-7" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <span className="font-black text-gray-900 text-lg tracking-tight">Dominion</span>
                    </div>
                </header>

                {/* Page Content with Aggressive Spacing */}
                <main className="flex-1 p-6 sm:p-10 lg:p-16 lg:pt-32 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
