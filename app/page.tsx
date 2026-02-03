'use client';

import { useAuth } from "./contexts/AuthContext";
import Button from "./components/Button";
import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        const result = await signIn.email({
          email,
          password,
        });
        
        if (result.error) {
          setError(result.error.message || 'Failed to sign in');
        } else {
          setShowForm(false);
          window.location.reload();
        }
      } else {
        const result = await signUp.email({
          email,
          password,
          name,
        });
        
        if (result.error) {
          setError(result.error.message || 'Failed to sign up');
        } else {
          setShowForm(false);
          window.location.reload();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main>
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {isAuthenticated ? (
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
                Your gateway to lightning prisms. Sign in to begin.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                text="Sign In"
                style="Primary"
                showIcon={false}
              />
            </div>
          </div>

          {/* Login/Signup Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4">
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLoginMode && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      text={isSubmitting ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                      style="Primary"
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      onClick={() => setShowForm(false)}
                      text="Cancel"
                      style="Secondary"
                    />
                  </div>
                </form>

                <div className="mt-4 text-center text-sm text-gray-400">
                  {isLoginMode ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        onClick={() => {
                          setIsLoginMode(false);
                          setError(null);
                        }}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setIsLoginMode(true);
                          setError(null);
                        }}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
