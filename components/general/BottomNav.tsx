'use client';

import Link from 'next/link';
import {
  Home,
  LayoutDashboard,
  BarChart2,
  Users,
  Receipt,
  Search,
  User as UserIcon,
  LogIn,
  UserPlus,
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
    const isMounted = true;

    const fetchUserAndProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        setUser(user);
        if (user) {
          const profileData = await getUserProfileClient();
          if (isMounted && profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error fetching user and profile:', error);
      }
    };

    fetchUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          try {
            const profileData = await getUserProfileClient();
            if (isMounted && profileData) {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Error fetching profile on auth change:', error);
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
          href="/browse"
          className={cn(
            'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
            pathname === '/browse'
              ? 'text-emerald-500'
              : 'text-muted-foreground',
          )}
        >
          <Search size={20} />
          <span>Browse</span>
        </Link>

        {user && profile ? (
          <>
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
                  <span>Orders</span>
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
                  <span>Stats</span>
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

            <Link
              href="/profile"
              className={cn(
                'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                pathname === '/profile'
                  ? 'text-emerald-500'
                  : 'text-muted-foreground',
              )}
            >
              <UserIcon size={20} />
              <span>Profile</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={cn(
                'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                pathname === '/login'
                  ? 'text-emerald-500'
                  : 'text-muted-foreground',
              )}
            >
              <LogIn size={20} />
              <span>Login</span>
            </Link>
            <Link
              href="/register"
              className={cn(
                'flex flex-col items-center gap-1 p-2 text-xs transition-colors hover:text-emerald-500',
                pathname === '/register'
                  ? 'text-emerald-500'
                  : 'text-muted-foreground',
              )}
            >
              <UserPlus size={20} />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
