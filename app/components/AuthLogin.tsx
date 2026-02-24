'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signIn, signUp } from '@/lib/auth-client';
import Button from '@/app/components/Button';

export default function AuthLogin() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
          setEmail('');
          setPassword('');
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
          setEmail('');
          setPassword('');
          setName('');
          window.location.reload();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="relative w-[140px] group">
          <div className="text-sm font-mono text-gray-400 truncate">
            {user.email}
          </div>
          <div className="hidden group-hover:block fixed transform -translate-x-1/2 left-1/2 mt-1 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded shadow-lg">
            <span className="text-sm font-mono text-gray-400">
              {user.email}
            </span>
          </div>
        </div>
        <Button
          onClick={logout}
          text="Logout"
          style="Secondary"
          className="text-red-200 border-red-800/50"
        />
      </div>
    );
  }

  if (showForm) {
    return (
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
    );
  }

  return (
    <Button
      onClick={() => setShowForm(true)}
      text="Sign In"
      style="Primary"
      className="text-purple-200"
    />
  );
}
