import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    try {
      // For demo purposes, we'll use a simple check
      // In production, this would be an API call
      if (email === 'demo@example.com' && password === 'password') {
        const user = {
          id: 1,
          email,
          name: 'Demo User',
          role: 'user'
        };
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setError(null);
        return true;
      }
      setError('Invalid email or password');
      return false;
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    }
  };

  const register = (name, email, password) => {
    try {
      // For demo purposes, we'll simulate registration
      // In production, this would be an API call
      const user = {
        id: Date.now(),
        email,
        name,
        role: 'user'
      };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setError(null);
      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
