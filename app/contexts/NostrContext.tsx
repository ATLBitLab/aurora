'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { getPublicKey, nip19, type Event } from 'nostr-tools';

interface NostrContextType {
  publicKey: string | null;
  npub: string | null;
  login: () => Promise<void>;
  logout: () => void;
  generateAuthEvent: (url: string, method: string) => Promise<Event | null>;
}

interface StoredAuth {
  publicKey: string;
  npub: string;
  timestamp: number;
  initialTimestamp: number;
}

const NostrContext = createContext<NostrContextType | null>(null);

const STORAGE_KEY = 'nostr_auth';
const AUTH_TIMEOUT = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
const MAX_AUTH_LIFETIME = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
const ACTIVITY_THRESHOLD = 30 * 60 * 1000; // 30 minutes in milliseconds

export function NostrProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [npub, setNpub] = useState<string | null>(null);

  const updateAuthTimestamp = useCallback(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (!savedAuth) return;

    try {
      const auth = JSON.parse(savedAuth) as StoredAuth;
      const now = Date.now();
      
      // Check if we've exceeded the maximum lifetime
      if (now - auth.initialTimestamp > MAX_AUTH_LIFETIME) {
        console.log('Auth has reached maximum lifetime');
        localStorage.removeItem(STORAGE_KEY);
        setPublicKey(null);
        setNpub(null);
        return;
      }

      // Only update if enough time has passed to avoid excessive writes
      if (now - auth.timestamp > ACTIVITY_THRESHOLD) {
        auth.timestamp = now;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      }
    } catch (error) {
      console.error('Error updating auth timestamp:', error);
    }
  }, []);

  // Load saved auth state on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (savedAuth) {
      try {
        const auth = JSON.parse(savedAuth) as StoredAuth;
        const now = Date.now();
        
        // Check maximum lifetime first
        if (now - auth.initialTimestamp > MAX_AUTH_LIFETIME) {
          console.log('Auth has reached maximum lifetime');
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        // Then check normal timeout
        if (now - auth.timestamp > AUTH_TIMEOUT) {
          console.log('Stored auth has expired');
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        setPublicKey(auth.publicKey);
        setNpub(auth.npub);
      } catch (error) {
        console.error('Error loading saved auth state:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Set up activity listeners
  useEffect(() => {
    if (!publicKey) return;

    const handleActivity = () => {
      updateAuthTimestamp();
    };

    // Update timestamp on user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Clean up listeners
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [publicKey, updateAuthTimestamp]);

  const login = useCallback(async () => {
    try {
      if (!window.nostr) {
        throw new Error('No Nostr extension found. Please install Alby or another Nostr extension.');
      }

      const pubkey = await window.nostr.getPublicKey();
      const encodedNpub = nip19.npubEncode(pubkey);
      const now = Date.now();
      
      // Save auth state with both timestamps
      const auth: StoredAuth = {
        publicKey: pubkey,
        npub: encodedNpub,
        timestamp: now,
        initialTimestamp: now,
      };
      
      setPublicKey(pubkey);
      setNpub(encodedNpub);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setPublicKey(null);
    setNpub(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const generateAuthEvent = useCallback(async (url: string, method: string): Promise<Event | null> => {
    if (!publicKey || !window.nostr) return null;

    // Update timestamp on API calls
    updateAuthTimestamp();

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
  }, [publicKey, updateAuthTimestamp]);

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