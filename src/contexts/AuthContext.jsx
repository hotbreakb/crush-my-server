import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const getId = (token) => {
  const decoded = jwtDecode(token);
  return decoded.jti;
};

export const AuthProvider = ({ children }) => {
  const [id, setId] = useState();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    token && setId(getId(token));
  }, []);

  const login = (tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    setId(getId(tokens.accessToken));
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setId(getId(null));
  };

  return <AuthContext.Provider value={{ id, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
