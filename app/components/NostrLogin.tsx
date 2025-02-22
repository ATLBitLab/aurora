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
          <div className="relative w-[140px] group">
            <div className="text-sm font-mono text-gray-400 truncate">
              {npub}
            </div>
            <div className="hidden group-hover:block fixed transform -translate-x-1/2 left-1/2 mt-1 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded shadow-lg">
              <span className="text-sm font-mono text-gray-400">
                {npub}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900 text-red-200 text-sm rounded border border-red-800/50 transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="px-3 py-1.5 bg-purple-900/50 hover:bg-purple-900 text-purple-200 text-sm rounded border border-purple-800/50 transition-colors"
        >
          Login with Nostr
        </button>
      )}
    </div>
  );
} 