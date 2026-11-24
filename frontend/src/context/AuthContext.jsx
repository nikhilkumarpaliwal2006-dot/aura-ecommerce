import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('aura_token'));
  const [loading, setLoading] = useState(true);

  const normalizeUser = (u) => {
    if (!u || typeof u !== 'object') return null;
    let safeName = 'Valued Collector';
    if (typeof u.name === 'string' && u.name.trim()) {
      safeName = u.name.trim();
    } else if (typeof u.email === 'string' && u.email.includes('@')) {
      safeName = u.email.split('@')[0] || 'Collector';
    }
    const safeEmail = typeof u.email === 'string' ? u.email : '';
    return { ...u, name: safeName, email: safeEmail };
  };

  useEffect(() => {
    if (token) {
      api.getMe()
        .then(res => {
          if (res.success && res.user) {
            setUser(normalizeUser(res.user));
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('aura_token', res.token);
      setToken(res.token);
      setUser(normalizeUser(res.user));
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    if (res.success) {
      localStorage.setItem('aura_token', res.token);
      setToken(res.token);
      setUser(normalizeUser(res.user));
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('aura_token');
    setToken(null);
    setUser(null);
  };

  const quickDemoLogin = async (role = 'customer') => {
    if (role === 'admin') {
      return login('admin@aura.com', 'admin123');
    }
    return login('demo@aura.com', 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        quickDemoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
