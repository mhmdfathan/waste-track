'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { checkSession, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      checkSession();
    }
  }, [checkSession, initialized]);

  return <>{children}</>;
}
