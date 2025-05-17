'use client';

import Link from 'next/link';
// import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Home, LayoutDashboard, Scale, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function BottomNav() {
  // const { getUser } = useKindeBrowserClient();
  // const user = getUser();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="flex items-center justify-around border-t bg-background px-4 py-2">
        {user ? (
          <>
            <Link
              href="/"
              className={cn(
                'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                pathname === '/' ? 'text-emerald-500' : 'text-muted-foreground',
              )}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                pathname === '/dashboard'
                  ? 'text-emerald-500'
                  : 'text-muted-foreground',
              )}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/timbang"
              className={cn(
                'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                pathname === '/timbang'
                  ? 'text-emerald-500'
                  : 'text-muted-foreground',
              )}
            >
              <Scale size={20} />
              <span>Timbang</span>
            </Link>
            <Link
              href="/statistics"
              className={cn(
                'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                pathname === '/statistics'
                  ? 'text-emerald-500'
                  : 'text-muted-foreground',
              )}
            >
              <BarChart2 size={20} />
              <span>Statistics</span>
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}
