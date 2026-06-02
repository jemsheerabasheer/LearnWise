import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import InputCollection from './pages/InputCollection';
import Roadmap from './pages/Roadmap';
import LearningMaterials from './pages/LearningMaterials';

import Landing from './pages/Landing';

// Admin Imports
import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminResources from './pages/admin/AdminResources';
import AdminUsers from './pages/admin/AdminUsers';
import AdminModel from './pages/admin/AdminModel';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, loading } = React.useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    
    if (decoded.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }

    return children;

  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

import Dashboard from './pages/Dashboard';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['learner']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
             path="/admin" 
             element={
               <AdminRoute>
                 <AdminLayout />
               </AdminRoute>
             } 
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="model" element={<AdminModel />} />
          </Route>

          <Route
            path="/input"
            element={
              <ProtectedRoute allowedRoles={['learner']}>
                <InputCollection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute allowedRoles={['learner']}>
                <Roadmap />
              </ProtectedRoute>
            }
          />

          <Route
            path="/materials"
            element={
              <ProtectedRoute allowedRoles={['learner']}>
                <LearningMaterials />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
