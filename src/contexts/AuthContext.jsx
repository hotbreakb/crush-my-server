import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const getUserInfo = (token) => {
  if (!token) return { id: null };
  const decoded = jwtDecode(token);
  return { id: decoded.jti };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id: null, nickname: null });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedNickname = localStorage.getItem('userNickname');
    if (token) {
      const { id } = getUserInfo(token);
      setUser({ id, nickname: storedNickname });
    }
  }, []);

  const signIn = (tokens, nickname) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('userNickname', nickname);
    const { id } = getUserInfo(tokens.accessToken);
    setUser({ id, nickname });
  };

  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userNickname');
    setUser({ id: null, nickname: null });
  };

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
