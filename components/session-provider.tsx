'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { initialize, checkSession } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on mount
    initialize();

    // Set up periodic session checks
    const intervalId = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // Check session every 5 minutes

    return () => {
      clearInterval(intervalId);
    };
  }, [initialize, checkSession]);

  return <>{children}</>;
}
