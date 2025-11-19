'use client';

import { useNostr } from "./contexts/NostrContext";
import Button from "./components/Button";

export default function Home() {
  const { publicKey, login } = useNostr();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to login with Nostr');
    }
  };

  return (
    <main>
      {publicKey ? (
        // Logged in view
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Aurora</h1>
            <p className="text-gray-400 text-lg">
              Your lightning prism management interface. Navigate through the menu to access different features.
            </p>
          </div>
        </div>
      ) : (
        // Logged out view with aurora background
        <div className="relative min-h-[calc(100vh-4rem)]">
          {/* Abstract Aurora Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
            <div className="absolute inset-0">
              <div className="absolute inset-0 opacity-30">
                {/* Aurora-like gradients */}
                <div className="absolute top-1/4 -left-1/4 w-3/4 h-3/4 bg-purple-500 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full blur-[96px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/3 w-1/3 h-1/3 bg-green-500 rounded-full blur-[64px] animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 pt-32 pb-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400">
                Welcome to Aurora
              </h1>
              <p className="text-xl text-gray-300 mb-12">
                Your gateway to lightning prisms. Connect with Nostr to begin.
              </p>
              <Button
                onClick={handleLogin}
                text="Connect with Nostr"
                style="Primary"
                showIcon={false}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
