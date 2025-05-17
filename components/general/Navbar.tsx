'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getUserProfile } from '@/lib/auth';
import type { UserRole } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const router = useRouter();
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
        const profileData = await getUserProfile();
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
          const profileData = await getUserProfile();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/'); // Redirect to home page after logout
    router.refresh(); // Refresh to ensure server components update
  };

  return (
    <nav className="fixed top-0 w-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <h1 className="text-3xl font-semibold">
                Trash<span className="text-emerald-500">It</span>
              </h1>
            </Link>
            <div className="hidden sm:flex items-center gap-6">
              <Link
                className={cn(
                  'text-sm font-medium transition-colors hover:text-emerald-500',
                  pathname === '/'
                    ? 'text-emerald-500'
                    : 'text-muted-foreground',
                )}
                href="/"
              >
                Home
              </Link>
              {user && (
                <>
                  <Link
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-emerald-500',
                      pathname === '/dashboard'
                        ? 'text-emerald-500'
                        : 'text-muted-foreground',
                    )}
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                  <Link
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-emerald-500',
                      pathname === '/timbang'
                        ? 'text-emerald-500'
                        : 'text-muted-foreground',
                    )}
                    href="/timbang"
                  >
                    Timbang
                  </Link>
                  <Link
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-emerald-500',
                      pathname === '/statistics'
                        ? 'text-emerald-500'
                        : 'text-muted-foreground',
                    )}
                    href="/statistics"
                  >
                    Statistics
                  </Link>
                  <Link
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-emerald-500',
                      pathname === '/transactions'
                        ? 'text-emerald-500'
                        : 'text-muted-foreground',
                    )}
                    href="/transactions"
                  >
                    Transactions
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                <ModeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar className="h-8 w-8 hover:opacity-75 transition">
                      <AvatarFallback className="bg-emerald-500 text-white">
                        {profile?.name
                          ? profile.name.charAt(0).toUpperCase()
                          : user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>
                      {profile?.name || user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile Settings</Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <ModeToggle />
                <Link href="/login" className={buttonVariants()}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
