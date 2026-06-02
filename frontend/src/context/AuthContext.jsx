import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
       const storedUser = localStorage.getItem('user');
       if(storedUser) {
           setUser(JSON.parse(storedUser));
       }
    }
    setLoading(false);

    // Add a global response interceptor to handle 401s (token expired/invalid)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
           // Token expired or invalid
           logout();
           window.location.href = '/login?expired=true';
        }
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when unmounting or token changes
    return () => axios.interceptors.response.eject(interceptor);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data.user.role; // Return role for redirect
    } catch (error) {
      throw error.response?.data?.message || 'Something went wrong';
    }
  };

  const register = async (name, email, password, role) => {
    try {
      await axios.post('http://localhost:5000/api/register', { name, email, password, role });
    } catch (error) {
      throw error.response?.data?.message || 'Something went wrong';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
