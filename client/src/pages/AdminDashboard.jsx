import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchStats, updateUserStatus } from '../features/admin/adminSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import {
    Users,
    FileText,
    Activity,
    ShieldCheck,
    Search,
    MoreVertical,
    Eye,
    UserMinus,
    UserCheck,
    TrendingUp,
    Database,
    LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../components/ui/DropdownMenu';
import { motion } from 'motion/react';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, stats, loading } = useSelector((state) => state.admin);
    const { user: currentUser } = useSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchStats());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleStatusChange = (userId, currentStatus) => {
        const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        if (window.confirm(`Change status to ${nextStatus}?`)) {
            dispatch(updateUserStatus({ userId, status: nextStatus }));
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statCards = [
        { label: 'Total Projects', value: stats?.summary?.projects || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Users', value: stats?.summary?.users || 0, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Annotations', value: stats?.summary?.annotations || 0, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Storage Used', value: '45.2 GB', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Administration</h1>
                    <p className="text-gray-500 mt-1">Monitor system health and manage university-wide repository assets.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl py-6">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                        System Reports
                    </Button>
                    <Button className="rounded-xl shadow-lg shadow-blue-100 py-6">
                        <ShieldCheck className="w-5 h-5 mr-2" />
                        Security Audit
                    </Button>
                    <Button 
                        onClick={handleLogout}
                        className="rounded-xl shadow-lg bg-white text-red-600 hover:bg-red-50 py-6 px-8 border border-red-100 font-bold"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Log Out
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Admin Content */}
            <div className="space-y-8">
                <Tabs defaultValue="users" className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-gray-100/80 p-1 rounded-2xl border border-gray-200">
                            <TabsTrigger value="users" className="rounded-xl px-6">User Management</TabsTrigger>
                            <TabsTrigger value="departments" className="rounded-xl px-6">Departments</TabsTrigger>
                            <TabsTrigger value="audit" className="rounded-xl px-6">Audit Logs</TabsTrigger>
                        </TabsList>

                        <div className="relative group w-64 hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="Search users..."
                                className="pl-10 bg-gray-50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <TabsContent value="users" className="mt-0 focus-visible:ring-0">
                        <Card className="rounded-2xl border-gray-200 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User Profile</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role & Dept</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">Syncing user database...</td></tr>
                                        ) : filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                                                            {u.username.substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight">{u.username}</p>
                                                            <p className="text-xs text-gray-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-semibold text-gray-700">{u.role_name}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{u.department_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge
                                                        variant="secondary"
                                                        className={`rounded-lg px-2 shadow-none border-none py-0.5 text-[10px] font-bold uppercase ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        {u.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40 rounded-xl border-gray-100 shadow-xl">
                                                            <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg m-1">
                                                                <Eye className="w-4 h-4 text-gray-400" />
                                                                <span>Inspect Activity</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            {u.id !== currentUser?.id ? (
                                                                <DropdownMenuItem
                                                                    className={`cursor-pointer gap-2 rounded-lg m-1 ${u.status === 'Active' ? 'text-red-600' : 'text-green-600'}`}
                                                                    onClick={() => handleStatusChange(u.id, u.status)}
                                                                >
                                                                    {u.status === 'Active' ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                                    <span>{u.status === 'Active' ? 'Deactivate' : 'Activate'} User</span>
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem disabled className="m-1 text-gray-300">
                                                                    <ShieldCheck className="w-4 h-4" />
                                                                    <span>System Administrator</span>
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="departments" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats?.departments?.map((dept) => (
                                <Card key={dept.name} className="overflow-hidden border-gray-200">
                                    <div className="h-2 bg-blue-600"></div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xl">{dept.name}</CardTitle>
                                        <CardDescription>Departmental Repository Overview</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="text-center flex-1 border-r border-gray-200">
                                                <p className="text-2xl font-bold text-gray-900">{dept.project_count}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Projects</p>
                                            </div>
                                            <div className="text-center flex-1">
                                                <p className="text-2xl font-bold text-gray-900">{Math.floor(dept.project_count * 4.5)}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Views</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full mt-4 rounded-xl border-gray-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                                            Manage Department
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;
