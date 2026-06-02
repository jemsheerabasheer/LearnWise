import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Users, Map, Book, Activity, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  if (error) {
    return <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-sm text-slate-500">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        {/* Total Roadmaps */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <Map className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Roadmaps</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.totalRoadmaps || 0}</p>
          </div>
        </div>

        {/* Total Resources */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Book className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Resources</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.totalResources || 0}</p>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Users</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.activeUsers || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <h3 className="text-lg font-bold text-slate-800 mt-10">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => navigate('/admin/resources')} className="p-4 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-xl text-left items-center justify-between flex text-slate-700 font-medium text-sm">
          Manage Resources <span>→</span>
        </button>
        <button onClick={() => navigate('/admin/users')} className="p-4 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-xl text-left items-center justify-between flex text-slate-700 font-medium text-sm">
          Manage Users <span>→</span>
        </button>
        <button onClick={() => navigate('/admin/analytics')} className="p-4 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-xl text-left items-center justify-between flex text-slate-700 font-medium text-sm">
          View Analytics <span>→</span>
        </button>
        <button onClick={() => navigate('/admin/model')} className="p-4 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-xl text-left items-center justify-between flex text-slate-700 font-medium text-sm">
          Update AI Model <span>→</span>
        </button>
      </div>

    </div>
  );
}
