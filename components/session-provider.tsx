/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { createClient } from '@/lib/supabase/client';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { initialize, checkSession } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on mount
    initialize();

    // Set up Supabase auth state change listener
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        event === 'SIGNED_IN' ||
        event === 'SIGNED_OUT' ||
        event === 'USER_UPDATED'
      ) {
        await checkSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, checkSession]);

  return <>{children}</>;
}
