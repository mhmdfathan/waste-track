import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Paths for authentication flow
  const authPaths = ['/login', '/register', '/auth/confirm', '/verify-email'];

  // Define protected paths that require authentication
  const adminPaths = [
    '/admin',
    '/admin/posts',
    '/admin/categories',
    '/admin/users',
  ];
  const nasabahPaths = ['/dashboard', '/timbang', '/transactions'];
  const pemerintahPaths = ['/statistics', '/users']; // Note: /users can also be admin
  const perusahaanPaths = ['/transactions']; // Note: /transactions can also be nasabah
  const commonProtectedPaths = ['/profile', '/browse', '/listing']; // Added /browse and /listing

  const uniqueProtectedPaths = Array.from(
    new Set([
      ...adminPaths,
      ...nasabahPaths,
      ...pemerintahPaths,
      ...perusahaanPaths,
      ...commonProtectedPaths,
    ]),
  );

  if (user) {
    // User is logged in
    if (pathname === '/') {
      // Redirect from root to /browse if logged in
      return NextResponse.redirect(new URL('/browse', request.url));
    }
    if (authPaths.some((p) => pathname.startsWith(p))) {
      // Redirect from auth pages to /browse if logged in
      return NextResponse.redirect(new URL('/browse', request.url));
    }
    // Allow access to other pages. Role-specific authorization (e.g., for /admin)
    // should be handled within those pages/layouts using Prisma to check roles.
  } else {
    // User is not logged in
    // Allow access to static assets and API routes without further checks here
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname === '/favicon.ico' ||
      /\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname)
    ) {
      return response;
    }

    // Check if the path is protected
    if (uniqueProtectedPaths.some((p) => pathname.startsWith(p))) {
      const redirectTo = pathname + request.nextUrl.search; // Preserve query params
      return NextResponse.redirect(
        new URL(
          `/login?redirect=${encodeURIComponent(redirectTo)}`,
          request.url,
        ),
      );
    }
    // Allow access to non-protected public pages (e.g., /about, /contact, and authPaths themselves)
  }

  return response;
}
