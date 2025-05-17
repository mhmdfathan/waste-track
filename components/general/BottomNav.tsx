'use client';

import Link from 'next/link';
import {
  Home,
  LayoutDashboard,
  Scale,
  BarChart2,
  Users,
  Receipt,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserRole } from '@prisma/client';
import { getUserProfileClient } from '@/lib/auth-client';

export function BottomNav() {
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserRole | null>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const profileData = await getUserProfileClient();
        if (profileData) {
          setProfile(profileData);
        }
      }
    };

    fetchUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          const profileData = await getUserProfileClient();
          if (profileData) {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="flex items-center justify-around border-t bg-background px-4 py-2">
        {user && profile ? (
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

            {profile.role === 'NASABAH' && (
              <>
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
                  href="/transactions"
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                    pathname === '/transactions'
                      ? 'text-emerald-500'
                      : 'text-muted-foreground',
                  )}
                >
                  <Receipt size={20} />
                  <span>Transactions</span>
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
              </>
            )}

            {profile.role === 'PEMERINTAH' && (
              <>
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
                <Link
                  href="/users"
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                    pathname === '/users'
                      ? 'text-emerald-500'
                      : 'text-muted-foreground',
                  )}
                >
                  <Users size={20} />
                  <span>Users</span>
                </Link>
              </>
            )}

            {profile.role === 'PERUSAHAAN' && (
              <Link
                href="/transactions"
                className={cn(
                  'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                  pathname === '/transactions'
                    ? 'text-emerald-500'
                    : 'text-muted-foreground',
                )}
              >
                <Receipt size={20} />
                <span>Transactions</span>
              </Link>
            )}
          </>
        ) : null}
      </div>
    </nav>
  );
}
