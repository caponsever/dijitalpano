import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, MonitorPlay, LogOut } from 'lucide-react';
import clsx from 'clsx';

const AdminLayout = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Genel Ayarlar', path: '/admin' },
        { icon: MonitorPlay, label: 'Ders Saatleri', path: '/admin/schedule' },
        { icon: Settings, label: 'Nöbetçi Öğretmen', path: '/admin/duty' },
        { icon: Settings, label: 'Yemek Listesi', path: '/admin/food' },
        { icon: Settings, label: 'Doğum Günü', path: '/admin/birthdays' },
        { icon: Settings, label: 'Belirli Günler', path: '/admin/specific-days' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                location.pathname === item.path
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}

                    <a
                        href="/display"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 mt-4 border-t"
                    >
                        <MonitorPlay size={20} />
                        <span className="font-medium">Open Display</span>
                    </a>
                </nav>
                <div className="p-4 border-t">
                    <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
