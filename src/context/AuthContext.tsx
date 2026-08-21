import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, ApiResponse } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchUserRole: (role: UserRole) => void;
  apiFetch: <T = any>(endpoint: string, options?: RequestInit) => Promise<ApiResponse<T>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'dubai_tms_auth_token';
const USER_KEY = 'dubai_tms_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authenticated fetch wrapper
  const apiFetch = useCallback(
    async <T = any,>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
      const headers = new Headers(options.headers || {});
      headers.set('Content-Type', 'application/json');

      const currentToken = token || localStorage.getItem(TOKEN_KEY);
      if (currentToken) {
        headers.set('Authorization', `Bearer ${currentToken}`);
      }

      try {
        const response = await fetch(endpoint, {
          ...options,
          headers,
        });

        const data = await response.json();
        return data;
      } catch (err: any) {
        return {
          success: false,
          error: err.message || 'Network error occurred',
        };
      }
    },
    [token]
  );

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        try {
          const res = await apiFetch<User>('/api/auth/me');
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data));
          } else {
            // Token expired or invalid
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setUser(null);
            setToken(null);
          }
        } catch {
          // Keep cached user for offline/test convenience
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [apiFetch]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json: ApiResponse<{ user: User; token: string }> = await res.json();

      if (json.success && json.data) {
        setUser(json.data.user);
        setToken(json.data.token);
        localStorage.setItem(TOKEN_KEY, json.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(json.data.user));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: json.error || 'Failed to sign in' };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const signUp = async (data: Partial<User> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json: ApiResponse<{ user: User; token: string }> = await res.json();

      if (json.success && json.data) {
        setUser(json.data.user);
        setToken(json.data.token);
        localStorage.setItem(TOKEN_KEY, json.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(json.data.user));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: json.error || 'Failed to sign up' };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  };

  // Helper to switch active persona during development
  const switchUserRole = (newRole: UserRole) => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        signIn,
        signUp,
        signOut,
        switchUserRole,
        apiFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
