import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../service/authService';

interface AuthContextType {
  token: string | null;
  user: { username: string; email: string } | null;
  setAuthToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    if (token) {
      // Fetch user data when token changes
      authService.getCurrentUser(token)
        .then(userData => setUser(userData))
        .catch(() => {
          // If getting user data fails, clear token and user
          setToken(null);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [token]);

  const setAuthToken = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setAuthToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
