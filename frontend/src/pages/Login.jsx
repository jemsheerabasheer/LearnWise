import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, GraduationCap } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setError('Session expired. Please login again');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const role = await login(email, password);
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        // Learner - check if input profile exists
        const token = localStorage.getItem('token');
        try {
           await axios.get('http://localhost:5000/api/user/input', {
             headers: { Authorization: `Bearer ${token}` }
           });
           // If successful (200), profile exists -> go to dashboard
           navigate('/dashboard');
        } catch (inputErr) {
           // If 404, profile doesn't exist -> go to input collection
           if (inputErr.response && inputErr.response.status === 404) {
              navigate('/input');
           } else {
              // Some other error, better just send to dashboard or show error
              navigate('/dashboard');
           }
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[440px] w-full space-y-8 premium-card">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-indigo-100">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
          <p className="mt-3 text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="link-secondary">
              Create an account
            </Link>
          </p>
        </div>
        
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="alert-error">
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Email Address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="styled-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between ml-1 mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="styled-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                'Sign in to LearnWise'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
