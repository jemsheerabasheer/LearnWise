import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2, GraduationCap } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner'
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[480px] w-full space-y-8 premium-card">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-indigo-100">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an account</h2>
          <p className="mt-3 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="link-secondary">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="alert-error">
              <p>{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="alert-success">
              <p>{successMsg}</p>
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="styled-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="styled-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>



            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="styled-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 ml-1 mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="styled-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
