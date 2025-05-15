'use client';

import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { ModeToggle } from './ModeToggle';

export function Navbar() {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();

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
                <p>{user.given_name}</p>
                <LogoutLink
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  Logout
                </LogoutLink>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <ModeToggle />
                <LoginLink className={buttonVariants()}>Login</LoginLink>
                <RegisterLink
                  className={buttonVariants({ variant: 'secondary' })}
                >
                  Sign up
                </RegisterLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
