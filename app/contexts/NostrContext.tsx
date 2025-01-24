'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getPublicKey, nip19, type Event } from 'nostr-tools';

interface NostrContextType {
  publicKey: string | null;
  npub: string | null;
  login: () => Promise<void>;
  logout: () => void;
  generateAuthEvent: (url: string, method: string) => Promise<Event | null>;
}

const NostrContext = createContext<NostrContextType | null>(null);

export function NostrProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [npub, setNpub] = useState<string | null>(null);

  const login = useCallback(async () => {
    try {
      // Check if window.nostr exists (Alby or other Nostr extension)
      if (!window.nostr) {
        throw new Error('No Nostr extension found. Please install Alby or another Nostr extension.');
      }

      // Request public key from extension
      const pubkey = await window.nostr.getPublicKey();
      setPublicKey(pubkey);
      setNpub(nip19.npubEncode(pubkey));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setPublicKey(null);
    setNpub(null);
  }, []);

  const generateAuthEvent = useCallback(async (url: string, method: string): Promise<Event | null> => {
    if (!publicKey || !window.nostr) return null;

    const event: Partial<Event> = {
      kind: 27235, // NIP-98 HTTP Auth
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['u', url],
        ['method', method],
      ],
      content: '',
      pubkey: publicKey,
    };

    try {
      // Request signature from extension
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