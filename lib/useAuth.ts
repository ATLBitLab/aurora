'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function useRequireAuth() {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // Check if auth cookie exists
        const authCookie = Cookies.get('nostr_auth');
        const authStateCookie = Cookies.get('nostr_auth_state');

        console.log('Auth check - Cookies:', { authCookie, authStateCookie });

        if (!authCookie || !authStateCookie) {
          console.log('Auth check - Missing cookies');
          if (mounted) {
            setIsValidating(false);
            setIsAuthorized(false);
            setTimeout(() => router.push('/'), 100);
          }
          return;
        }

        // Validate auth by making a request to a protected endpoint
        const response = await fetch('/api/auth/validate', {
          // Add cache busting
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await response.json();

        console.log('Auth check - Validation response:', {
          status: response.status,
          data
        });

        if (!response.ok) {
          console.log('Auth check - Validation failed, clearing cookies');
          Cookies.remove('nostr_auth');
          Cookies.remove('nostr_auth_state');
          if (mounted) {
            setIsValidating(false);
            setIsAuthorized(false);
            setTimeout(() => router.push('/'), 100);
          }
          return;
        }

        console.log('Auth check - Validation successful');
        if (mounted) {
          setIsValidating(false);
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        Cookies.remove('nostr_auth');
        Cookies.remove('nostr_auth_state');
        if (mounted) {
          setIsValidating(false);
          setIsAuthorized(false);
          setTimeout(() => router.push('/'), 100);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  return { isValidating, isAuthorized };
} 