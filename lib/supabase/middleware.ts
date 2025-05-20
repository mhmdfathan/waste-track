import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/app/utils/db';
import type { CookieOptions } from '@supabase/ssr';
import { Role } from '@prisma/client';

export async function updateSession(request: NextRequest) {
  // Skip session update for static assets and public routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Set up supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      },
    );

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Define protected and public paths
    const adminPaths = [
      '/admin',
      '/admin/posts',
      '/admin/categories',
      '/admin/users',
    ];
    const nasabahPaths = ['/dashboard', '/timbang', '/transactions'];
    const pemerintahPaths = ['/statistics', '/users'];
    const perusahaanPaths = ['/transactions'];
    const commonPaths = ['/profile'];
    const protectedPaths = [
      ...adminPaths,
      ...nasabahPaths,
      ...pemerintahPaths,
      ...perusahaanPaths,
      ...commonPaths,
    ];
    const publicPaths = ['/login', '/register', '/auth', '/verify-email'];

    const currentPath = request.nextUrl.pathname;
    const isProtectedPath = protectedPaths.some(
      (path) => currentPath === path || currentPath.startsWith(`${path}/`),
    );
    const isPublicPath = publicPaths.some(
      (path) => currentPath === path || currentPath.startsWith(`${path}/`),
    );

    // If user is authenticated and tries to access public paths (like login), redirect to home
    if (user && isPublicPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If not authenticated and trying to access protected route
    if (!user && isProtectedPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based access control for authenticated users
    if (user && isProtectedPath) {
      try {
        const profile = await prisma.userRole.findUnique({
          where: { userId: user.id },
          select: { role: true },
        });

        if (!profile) {
          return NextResponse.redirect(new URL('/', request.url));
        }

        const isAdminPath = adminPaths.some(
          (path) => currentPath === path || currentPath.startsWith(`${path}/`),
        );
        const isNasabahPath = nasabahPaths.some(
          (path) => currentPath === path || currentPath.startsWith(`${path}/`),
        );
        const isPemerintahPath = pemerintahPaths.some(
          (path) => currentPath === path || currentPath.startsWith(`${path}/`),
        );
        const isPerusahaanPath = perusahaanPaths.some(
          (path) => currentPath === path || currentPath.startsWith(`${path}/`),
        );
        const isCommonPath = commonPaths.some(
          (path) => currentPath === path || currentPath.startsWith(`${path}/`),
        );

        const hasAccess =
          (profile.role === Role.ADMIN && isAdminPath) ||
          (profile.role === Role.NASABAH && isNasabahPath) ||
          (profile.role === Role.PEMERINTAH && isPemerintahPath) ||
          (profile.role === Role.PERUSAHAAN && isPerusahaanPath) ||
          isCommonPath;

        if (!hasAccess) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        return NextResponse.redirect(new URL('/error', request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
