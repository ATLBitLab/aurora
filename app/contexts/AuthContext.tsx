'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, signOut } from '@/lib/auth-client';

interface AuthContextType {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null | undefined;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    });
  };

  const value: AuthContextType = {
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    } : null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
