import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '../api/client';
import type { User, AuthContextValue, AuthApiResponse } from '../types';

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth(): Promise<void> {
    try {
      console.log('top');
      const token = await SecureStore.getItemAsync('accessToken');
      console.log('token :>> ', token);
      const userData = await SecureStore.getItemAsync('userData');
      console.log('userData :>> ', userData);
      if (token && userData) {
        setUser(JSON.parse(userData) as User);
      }
    } catch (e) {
      console.log('Failed to load stored auth:', e);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<User> {
    const { data } = await client.post<AuthApiResponse>('/auth/login', { email, password });
    await SecureStore.setItemAsync('accessToken', data.token);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function signup(email: string, password: string, displayName: string): Promise<User> {
    const { data } = await client.post<AuthApiResponse>('/auth/signup', { email, password, displayName });
    await SecureStore.setItemAsync('accessToken', data.token);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function logout(): Promise<void> {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userData');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
