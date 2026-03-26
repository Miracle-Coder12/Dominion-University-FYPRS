import React from 'react';
import { Card } from '../components/ui/Card';
import { Settings as SettingsIcon, User, Bell, Lock, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';

const Settings = () => {
    const { user } = useSelector((state) => state.auth);

    const sections = [
        { name: 'Profile Information', icon: User, description: 'Update your personal details and account email.' },
        { name: 'Notifications', icon: Bell, description: 'Manage how and when you receive alerts.' },
        { name: 'Security', icon: Lock, description: 'Change your password and secure your account.' },
        { name: 'Privacy', icon: Shield, description: 'Control who can see your project activity.' },
    ];

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account preferences and security.</p>
            </div>

            <div className="grid gap-4">
                {sections.map((section) => (
                    <Card key={section.name} className="p-6 flex items-center gap-6 border border-gray-100 rounded-2xl hover:border-blue-100 cursor-pointer transition-all hover:bg-gray-50 group">
                        <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                            <section.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{section.name}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">{section.description}</p>
                        </div>
                    </Card>
                ))}
            </div>
            
            <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 text-center">
                <p className="text-sm font-medium text-blue-700">Signed in as <span className="font-black text-blue-800">{user?.email || user?.username}</span></p>
            </div>
        </div>
    );
};

export default Settings;
