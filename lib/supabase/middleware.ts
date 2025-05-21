import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/app/utils/db';
import { CookieOptions } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
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
    let userRole = null;
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
        userRole = profile?.role;
      } catch (error) {
        console.error('[Middleware Debug] Error fetching user role:', error);
      }
    }

    // Role-based route protection
    const nasabahPaths = ['/dashboard', '/timbang', '/transactions'];
    const pemerintahPaths = ['/statistics', '/users'];
    const perusahaanPaths = ['/transactions'];
    const commonPaths = ['/profile'];

    // All protected paths combined
    const protectedPaths = [
      ...new Set([
        ...nasabahPaths,
        ...pemerintahPaths,
        ...perusahaanPaths,
        ...commonPaths,
      ]),
    ];

    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path),
    ); // Public paths that don't require authentication
    const publicPaths = [
      '/login',
      '/register',
      '/auth',
      '/verify-email',
      '/browse',
    ];
    const isPublicPath = publicPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path),
    );

    // If user is logged in and tries to access login/register pages, redirect to home
    if (user && isPublicPath) {
      console.log(
        '[Middleware Debug] Authenticated user attempting to access public path, redirecting to home',
      );
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If user is not logged in and tries to access protected route
    if (!user && isProtectedPath) {
      console.log(
        '[Middleware Debug] Unauthorized access attempt - redirecting to login',
      );
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based access control
    if (user && userRole) {
      const currentPath = request.nextUrl.pathname;

      const isNasabahPath = nasabahPaths.some((path) =>
        currentPath.startsWith(path),
      );
      const isPemerintahPath = pemerintahPaths.some((path) =>
        currentPath.startsWith(path),
      );
      const isPerusahaanPath = perusahaanPaths.some((path) =>
        currentPath.startsWith(path),
      );
      const isCommonPath = commonPaths.some((path) =>
        currentPath.startsWith(path),
      );

      const hasAccess =
        (userRole === 'NASABAH' && isNasabahPath) ||
        (userRole === 'PEMERINTAH' && isPemerintahPath) ||
        (userRole === 'PERUSAHAAN' && isPerusahaanPath) ||
        isCommonPath;

      if (!hasAccess && isProtectedPath) {
        console.log(
          `[Middleware Debug] Access denied for ${userRole} attempting to access ${currentPath}`,
        );
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('[Middleware Debug] Unexpected error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
