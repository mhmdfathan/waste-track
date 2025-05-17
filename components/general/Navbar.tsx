'use client';

import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { ModeToggle } from './ModeToggle';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { UserRole } from '@prisma/client';

export function Navbar() {
  const router = useRouter();
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
        const response = await fetch('/api/profile?userId=' + user.id);
        if (response.ok) {
          const profileData = await response.json();
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
          const response = await fetch('/api/profile?userId=' + currentUser.id);
          if (response.ok) {
            const profileData = await response.json();
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
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
                href="/"
              >
                Home
              </Link>
              {user && (
                <>
                  <Link
                    className="text-sm font-medium hover:text-emerald-500 transition-colors"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-emerald-500 transition-colors"
                    href="/timbang"
                  >
                    Timbang
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-emerald-500 transition-colors"
                    href="/statistics"
                  >
                    Statistics
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {' '}
            {user ? (
              <div className="flex items-center gap-4">
                <ModeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar className="h-8 w-8 hover:opacity-75 transition">
                      <AvatarFallback className="bg-emerald-500 text-white">
                        {profile?.name
                          ? profile.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                          : user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.name && (
                          <p className="font-medium">{profile.name}</p>
                        )}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleLogout}
                    >
                      Log out
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
