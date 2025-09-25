'use client';

/**
 * User Context Provider
 *
 * Provides a simple, shared state for the authenticated user.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthVerificationResponse } from '@/types/auth';

// 1. Define the context type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

// 2. Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// 3. Create the provider component
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/user');

      if (response.ok) {
        const data: AuthVerificationResponse = await response.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.error('Failed to fetch user session', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Render a loading state or null while fetching the initial user session
  if (loading) {
    return null;
  }

  const contextValue: UserContextType = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

// 4. Create the custom hook for consuming the context
export function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
