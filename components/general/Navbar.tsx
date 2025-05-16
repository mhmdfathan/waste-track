'use client';

import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { ModeToggle } from './ModeToggle';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export function Navbar() {
  const router = useRouter();
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
            {user ? (
              <div className="flex items-center gap-4">
                <ModeToggle />
                <p className="text-sm">{user.email}</p>{' '}
                {/* Display user's email */}
                <button
                  onClick={handleLogout}
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  Logout
                </button>
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
