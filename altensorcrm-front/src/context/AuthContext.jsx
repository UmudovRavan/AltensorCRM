import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, setAuthToken, getCurrentUser, setCurrentUser, authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Synchronously extract token from URL if present on app initialization
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlToken = searchParams.get('token');
      if (urlToken) {
        setAuthToken(urlToken);
        if (!getCurrentUser()) {
          setCurrentUser({ username: 'Authorized User', role: 'User' });
        }
        // Clean URL query parameter without page reload
        searchParams.delete('token');
        const newSearch = searchParams.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
        return urlToken;
      }
    }
    return getAuthToken();
  });

  const [user, setUser] = useState(() => {
    const existing = getCurrentUser();
    if (existing) return existing;
    if (token) return { username: 'Authorized User', role: 'User' };
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(token));
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Initial authentication state check
    const currentToken = getAuthToken();
    const currentUser = getCurrentUser();

    if (currentToken) {
      setToken(currentToken);
      setUser(currentUser || { username: 'Authorized User', role: 'User' });
      setIsAuthenticated(true);
    } else {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }

    setAuthChecked(true);
  }, []);

  const login = async (username, password) => {
    const data = await authApi.login(username, password);
    if (data && data.token) {
      setToken(data.token);
      const userObj = data.user || { username, role: 'User' };
      setUser(userObj);
      setIsAuthenticated(true);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout warning:', err);
    } finally {
      setAuthToken(null);
      setCurrentUser(null);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        authChecked,
        login,
        logout,
        setToken,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
