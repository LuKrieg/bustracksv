import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check environment variable for auto-login
  const autoLoginTestUser = import.meta.env.VITE_AUTO_LOGIN_TEST_USER === 'true';

  useEffect(() => {
    if (autoLoginTestUser) {
      // Auto-login test user
      const testUser = {
        id: 1,
        email: 'usuario@test.com',
        name: 'Usuario',
        role: 'user'
      };
      setUser(testUser);
      localStorage.setItem('user', JSON.stringify(testUser));
    } else {
      // Check if user is logged in on app start
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, [autoLoginTestUser]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
