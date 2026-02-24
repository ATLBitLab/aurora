'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

export function useRequireAuth() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setIsValidating(false);
      setIsAuthorized(false);
      router.push('/');
      return;
    }

    setIsValidating(false);
    setIsAuthorized(true);
  }, [session, isPending, router]);

  return { isValidating: isPending || isValidating, isAuthorized };
}
