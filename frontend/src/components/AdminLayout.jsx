import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, ChartBar } from 'lucide-react';

export default function AdminLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Resources', path: '/admin/resources', icon: BookOpen },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: ChartBar },
    { name: 'AI Model', path: '/admin/model', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider text-white flex items-center gap-2">
            <span className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center text-white">LW</span>
            LearnWise <span className="text-xs text-indigo-400 align-top ml-1">Admin</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Topnav Mobile */}
      <div className="md:hidden bg-slate-900 text-white flex items-center justify-between p-4 sticky top-0 z-50">
        <h1 className="font-bold text-lg flex items-center gap-2">
          <span className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center text-xs">LW</span>
          LearnWise Admin
        </h1>
        <button onClick={handleLogout} className="text-red-400 p-2">
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      <div className="md:hidden bg-slate-800 p-2 overflow-x-auto flex gap-2 hide-scrollbar">
         {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm shrink-0 transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen md:h-screen w-full relative">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
