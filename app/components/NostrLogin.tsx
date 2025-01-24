'use client';

import { useNostr } from '../contexts/NostrContext';

export default function NostrLogin() {
  const { publicKey, npub, login, logout } = useNostr();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to login with Nostr');
    }
  };

  return (
    <div className="flex items-center gap-4">
      {publicKey ? (
        <>
          <span className="text-sm font-mono truncate max-w-[200px]" title={npub || ''}>
            {npub}
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Login with Nostr
        </button>
      )}
    </div>
  );
} 