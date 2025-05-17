import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
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
        getAll: () => {
          return request.cookies.getAll();
        },
        setAll: (cookies) => {
          cookies.forEach(({ name, value, ...options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            });
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
      const prisma = (await import('@/app/utils/db')).default;
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
  const commonPaths = ['/profile']; // Common protected paths for all roles

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
  );
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/auth', '/verify-email'];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  console.log('[Middleware Debug] Path type:', {
    isProtectedPath,
    isPublicPath,
    currentPath: request.nextUrl.pathname,
  });

  // If user is logged in and tries to access login/register pages, redirect to home
  if (user && isPublicPath) {
    console.log(
      '[Middleware Debug] Authenticated user attempting to access public route - redirecting to /',
    );
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (!user && isProtectedPath) {
    // If user is not logged in and trying to access protected route
    console.log(
      '[Middleware Debug] Unauthorized access attempt - redirecting to /login',
    );
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based access control
  if (user && userRole) {
    const currentPath = request.nextUrl.pathname;

    // Check if user is trying to access a path they shouldn't
    const isNasabahPath = nasabahPaths.some((path) =>
      currentPath.startsWith(path),
    );
    const isPemerintahPath = pemerintahPaths.some((path) =>
      currentPath.startsWith(path),
    );
    const isPerusahaanPath = perusahaanPaths.some((path) =>
      currentPath.startsWith(path),
    );

    const hasAccess =
      (userRole === 'NASABAH' && isNasabahPath) ||
      (userRole === 'PEMERINTAH' && isPemerintahPath) ||
      (userRole === 'PERUSAHAAN' && isPerusahaanPath) ||
      commonPaths.some((path) => currentPath.startsWith(path));

    if (!hasAccess && isProtectedPath) {
      console.log(
        `[Middleware Debug] User with role ${userRole} attempted to access unauthorized path ${currentPath}`,
      );
      const redirectUrl = new URL('/', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (user && isPublicPath) {
    // If user is logged in and trying to access login/register pages
    console.log(
      '[Middleware Debug] Logged-in user accessing public route - redirecting to /dashboard',
    );
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
