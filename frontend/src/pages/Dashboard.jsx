import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, LayoutDashboard, Map as MapIcon, Bookmark, Target, User as UserIcon, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch profile
      const profileRes = await axios.get('http://localhost:5000/api/user/input', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(profileRes.data);

      // Fetch roadmap overview (we only need high-level stats here)
      const roadmapRes = await axios.get('http://localhost:5000/api/roadmap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoadmap(roadmapRes.data);

    } catch (err) {
      // If 404 on profile, they need to do input collection
      if (err.response && err.response.status === 404 && err.config.url.includes('/api/user/input')) {
         navigate('/input');
      } else {
         setError('Failed to load dashboard data.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider text-white flex items-center gap-2">
            <span className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center text-white">LW</span>
            LearnWise
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex w-full items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-sm font-medium text-sm">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </button>
          <button onClick={() => navigate('/roadmap')} className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium text-sm">
            <MapIcon className="h-5 w-5" /> My Roadmap
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-colors font-medium text-sm">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Topnav Mobile */}
      <div className="md:hidden bg-slate-900 text-white flex items-center justify-between p-4 sticky top-0 z-50">
        <h1 className="font-bold text-lg flex items-center gap-2">
          <span className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center text-xs">LW</span>
          LearnWise
        </h1>
        <button onClick={handleLogout} className="text-red-400 p-2"><LogOut className="h-5 w-5" /></button>
      </div>

      <div className="md:hidden bg-slate-800 p-2 overflow-x-auto flex gap-2 hide-scrollbar">
         <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm shrink-0 bg-indigo-600 text-white">
           <LayoutDashboard className="h-4 w-4" /> Dashboard
         </button>
         <button onClick={() => navigate('/roadmap')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm shrink-0 text-slate-400 hover:text-white transition-colors">
           <MapIcon className="h-4 w-4" /> My Roadmap
         </button>
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back, {user?.name}</h2>
            <p className="text-sm text-slate-500">Here's an overview of your learning journey.</p>
          </div>

           {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Skill Level</p>
                  <p className="text-lg font-bold text-slate-900 capitalize">{profile?.skillLevel || 'Not Set'}</p>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <MapIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Topics</p>
                  <p className="text-lg font-bold text-slate-900">{roadmap?.topics?.length || 0}</p>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Career Goal</p>
                  <p className="text-lg font-bold text-slate-900 truncate max-w-[150px]">{profile?.careerGoals || 'Not Set'}</p>
                </div>
             </div>
          </div>

          {/* Action Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
               <div className="relative z-10">
                 <h3 className="text-xl font-bold mb-2">Continue Learning</h3>
                 <p className="text-indigo-100 mb-6 max-w-sm">Jump right back into your AI-generated roadmap and pick up where you left off.</p>
                 <button onClick={() => navigate('/roadmap')} className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center gap-2">
                   View Roadmap <MapIcon className="h-4 w-4" />
                 </button>
               </div>
               <MapIcon className="absolute -bottom-4 -right-4 h-48 w-48 text-indigo-400 opacity-20 rotate-12" />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
               <h3 className="text-lg font-bold text-slate-900 mb-2">Your Profile</h3>
               <div className="space-y-3 mt-4">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-500">Name</span>
                   <span className="font-medium text-slate-900">{user?.name}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                   <span className="text-slate-500">Email</span>
                   <span className="font-medium text-slate-900">{user?.email}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                   <span className="text-slate-500">Known Languages</span>
                   <span className="font-medium text-slate-900 text-right max-w-[180px] truncate">{profile?.knownLanguages?.join(', ') || 'None'}</span>
                 </div>
               </div>
               <button onClick={() => navigate('/input')} className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm">
                 Update Profile
               </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
