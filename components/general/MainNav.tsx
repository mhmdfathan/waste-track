/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Role } from '@prisma/client';
import { useAuthStore } from '@/lib/store/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

// Shared navigation items that are always shown
const publicNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Tentang Kami', href: '/about' },
  { name: 'Artikel', href: '/post' },
  { name: 'Kontak', href: '/contact' },
];

// Role-specific navigation items
const roleNavigation: Record<Role, { name: string; href: string }[]> = {
  NASABAH: [
    { name: 'Browse', href: '/browse' },
    { name: 'Riwayat Transaksi', href: '/transactions' },
    { name: 'Timbang Sampah', href: '/timbang' },
    { name: 'Profil', href: '/profile' },
  ],
  PERUSAHAAN: [
    { name: 'Browse', href: '/browse' },
    { name: 'Riwayat Transaksi', href: '/transactions' },
    { name: 'Timbang Sampah', href: '/timbang' },
    { name: 'Profil', href: '/profile' },
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Pengguna', href: '/users' },
    { name: 'Kategori', href: '/admin/categories' },
    { name: 'Postingan', href: '/admin/posts' },
    { name: 'Profil', href: '/profile' },
  ],
  PEMERINTAH: [
    { name: 'Statistik', href: '/statistics' },
    { name: 'Pengguna', href: '/users' },
    { name: 'Profil', href: '/profile' },
  ],
};

export function MainNav() {
  const pathname = usePathname();
  const { user, profile, logout } = useAuthStore();

  const userRole = profile?.role || 'NASABAH'; // Default to NASABAH for safety, though UI should hide/show based on actual login
  const roleSpecificNavigation = roleNavigation[userRole] || [];

  // Determine navigation items based on authentication state
  const currentNavigation = profile?.role
    ? roleSpecificNavigation
    : publicNavigation;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <h1 className="text-3xl font-semibold">
                Trash<span className="text-emerald-500">It</span>
              </h1>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-6">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-emerald-500',
                    pathname === item.href
                      ? 'text-emerald-500'
                      : 'text-muted-foreground',
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />

            {user && profile ? ( // Ensure profile is also loaded
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
                    onClick={() => logout()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex lg:items-center lg:space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {currentNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'text-sm font-medium transition-colors hover:text-emerald-500',
                        pathname === item.href
                          ? 'text-emerald-500'
                          : 'text-muted-foreground',
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {!user && ( // Show login/register only if not logged in
                    <div className="flex flex-col space-y-4 pt-4">
                      <Button variant="outline" asChild>
                        <Link href="/login">Masuk</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register">Daftar</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
