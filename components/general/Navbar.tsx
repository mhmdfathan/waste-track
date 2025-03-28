'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useTheme } from '@/lib/hooks/useTheme';

export default function Navbar() {
  const { getUser } = useKindeBrowserClient();
  const { theme, toggleTheme } = useTheme();
  const user = getUser();

  return (
    <nav className="w-full bg-base-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left section with logo and navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-semibold">
              Waste<span className="text-primary">Track</span>
            </Link>

            <div className="hidden sm:flex items-center gap-6">
              <Link
                className="text-sm font-medium hover:text-primary transition-colors"
                href="/"
              >
                Home
              </Link>
              <Link
                className="text-sm font-medium hover:text-primary transition-colors"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Right section with theme toggle and auth */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
              {theme === 'light' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                  />
                </svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                {/* Create Post Button */}
                <Link
                  href="/dashboard/create"
                  className="hidden sm:inline-flex btn btn-primary"
                >
                  Create Post
                </Link>

                {/* User Menu */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full relative">
                      <Image
                        src={user.picture || 'https://picsum.photos/200/300'}
                        alt={user.given_name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <span className="font-medium">{user.given_name}</span>
                    </li>
                    <li>
                      <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <LogoutLink>Logout</LogoutLink>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LoginLink className="btn btn-ghost">Sign in</LoginLink>
                <RegisterLink className="btn btn-primary">Sign up</RegisterLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
