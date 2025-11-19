'use client';

import { useNostr } from '../contexts/NostrContext';
import Button from '@/app/components/Button';

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
          <Button
            onClick={logout}
            text="Logout"
            style="Secondary"
            className="text-red-200 border-red-800/50"
          />
        </>
      ) : (
        <Button
          onClick={handleLogin}
          text="Login with Nostr"
          style="Primary"
          className="text-purple-200"
        />
      )}
    </div>
  );
}