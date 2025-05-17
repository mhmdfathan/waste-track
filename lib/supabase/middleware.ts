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

  // Protected routes that require authentication
  const protectedPaths = [
    '/dashboard',
    '/timbang',
    '/statistics',
    '/private',
    '/listing',
    '/profile',
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

  if (!user && isProtectedPath) {
    // If user is not logged in and trying to access protected route
    console.log(
      '[Middleware Debug] Unauthorized access attempt - redirecting to /login',
    );
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
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
