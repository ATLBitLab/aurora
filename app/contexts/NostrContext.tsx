'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { nip19, type Event } from 'nostr-tools';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface NostrContextType {
  publicKey: string | null;
  npub: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  generateAuthEvent: (url: string, method: string) => Promise<Event | null>;
}

interface StoredAuth {
  publicKey: string;
  npub: string;
  timestamp: number;
}

const NostrContext = createContext<NostrContextType | null>(null);

const STORAGE_KEY = 'nostr_auth_state';

export function NostrProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [npub, setNpub] = useState<string | null>(null);
  const router = useRouter();

  // Load auth state on mount and cookie changes
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    const isAuthenticated = Cookies.get('nostr_auth_state') === 'true';

    // If not authenticated, clear state
    if (!isAuthenticated) {
      setPublicKey(null);
      setNpub(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    // If authenticated but no saved state, clear state
    if (!savedAuth) {
      setPublicKey(null);
      setNpub(null);
      return;
    }

    // If authenticated and has saved state, restore it
    try {
      const auth = JSON.parse(savedAuth) as StoredAuth;
      setPublicKey(auth.publicKey);
      setNpub(auth.npub);
    } catch (error) {
      console.error('Error parsing saved auth state:', error);
      setPublicKey(null);
      setNpub(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async () => {
    try {
      if (!window.nostr) {
        throw new Error('No Nostr extension found. Please install Alby or another Nostr extension.');
      }

      const pubkey = await window.nostr.getPublicKey();
      const encodedNpub = nip19.npubEncode(pubkey);

      console.log('Login - Attempting auth with npub:', encodedNpub);

      // Attempt to authenticate with the server
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ npub: encodedNpub }),
      });

      const data = await response.json();
      console.log('Login - Auth response:', {
        status: response.status,
        data
      });

      if (!response.ok) {
        throw new Error(data.error || 'Unauthorized: Super Admin access required');
      }

      // Save auth state
      const auth: StoredAuth = {
        publicKey: pubkey,
        npub: encodedNpub,
        timestamp: Date.now(),
      };
      
      setPublicKey(pubkey);
      setNpub(encodedNpub);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));

      // Verify the cookie was set
      const authCookie = Cookies.get('nostr_auth');
      console.log('Login - Auth cookie after login:', authCookie);

      // Check for return URL from window location (client-side only)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl');
        if (returnUrl) {
          router.push(returnUrl);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      // Clear any existing auth state if login fails
      setPublicKey(null);
      setNpub(null);
      localStorage.removeItem(STORAGE_KEY);
      throw error;
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to clear cookies
      await fetch('/api/auth', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of server response
      setPublicKey(null);
      setNpub(null);
      localStorage.removeItem(STORAGE_KEY);
      router.push('/');
    }
  }, [router]);

  const generateAuthEvent = useCallback(async (url: string, method: string): Promise<Event | null> => {
    if (!publicKey || !window.nostr) return null;

    const event: Partial<Event> = {
      kind: 27235,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['u', url],
        ['method', method],
      ],
      content: '',
      pubkey: publicKey,
    };

    try {
      const signedEvent = await window.nostr.signEvent(event);
      return signedEvent as Event;
    } catch (error) {
      console.error('Error signing event:', error);
      return null;
    }
  }, [publicKey]);

  return (
    <NostrContext.Provider value={{ publicKey, npub, login, logout, generateAuthEvent }}>
      {children}
    </NostrContext.Provider>
  );
}

export function useNostr() {
  const context = useContext(NostrContext);
  if (!context) {
    throw new Error('useNostr must be used within a NostrProvider');
  }
  return context;
}

// Add TypeScript support for window.nostr
declare global {
  interface Window {
    nostr?: {
      getPublicKey: () => Promise<string>;
      signEvent: (event: Partial<Event>) => Promise<Event>;
    };
  }
} 