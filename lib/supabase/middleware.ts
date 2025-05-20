import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/app/utils/db';
import { CookieOptions } from '@supabase/ssr';
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log('[Middleware Debug] Request path:', request.nextUrl.pathname);
    console.log('[Middleware Debug] Auth state:', {
      isAuthenticated: !!user,
      userId: user?.id,
      userEmail: user?.email,
    });

    // Get user role if authenticated
    let userRole: Role | null = null;
    if (user) {
      try {
        const profile = await prisma.userRole.findUnique({
          where: {
            userId: user.id,
          },
          select: {
            role: true,
          },
        });
        userRole = profile?.role ?? null;
      } catch (error) {
        console.error('[Middleware Debug] Error fetching user role:', error);
      }
    }

    // Define protected paths by role
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

    // All protected paths combined
    const protectedPaths = [
      ...adminPaths,
      ...nasabahPaths,
      ...pemerintahPaths,
      ...perusahaanPaths,
      ...commonPaths,
    ];

    const currentPath = request.nextUrl.pathname;
    const isProtectedPath = protectedPaths.some(
      (path) => currentPath === path || currentPath.startsWith(`${path}/`),
    );

    const publicPaths = ['/login', '/register', '/auth', '/verify-email'];
    const isPublicPath = publicPaths.some(
      (path) => currentPath === path || currentPath.startsWith(`${path}/`),
    );

    // If user is logged in and tries to access public paths, redirect to home
    if (user && isPublicPath) {
      console.log(
        '[Middleware Debug] Authenticated user attempting to access public path',
      );
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If not authenticated and trying to access protected route
    if (!user && isProtectedPath) {
      console.log('[Middleware Debug] Unauthenticated access attempt');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based access control
    if (user && userRole) {
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

      const hasAccess =
        (userRole === Role.ADMIN && isAdminPath) ||
        (userRole === Role.NASABAH && isNasabahPath) ||
        (userRole === Role.PEMERINTAH && isPemerintahPath) ||
        (userRole === Role.PERUSAHAAN && isPerusahaanPath) ||
        commonPaths.some(
          (path) => currentPath === path || currentPath.startsWith(`${path}/`),
        );

      if (isProtectedPath && !hasAccess) {
        console.log('[Middleware Debug] Unauthorized role access attempt');
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('[Middleware Debug] Unexpected error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
