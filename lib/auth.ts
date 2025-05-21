import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import prisma from '@/app/utils/db';
import {
  getCurrentUser,
  requireAuth as requireAuthUtil,
  checkRole,
  checkAdmin,
} from '@/lib/auth-utils';

// Get user session - returns the User object if authenticated, null otherwise
export async function getUserSession() {
  const session = await getCurrentUser();
  return session?.user || null;
}

// Require authentication - redirects to login if not authenticated
export async function requireAuth() {
  const user = await requireAuthUtil();
  if (!user) {
    console.log(
      '[Auth Debug] requireAuth: No session found, redirecting to /login',
    );
    redirect('/login');
  }
  return user;
}

// Get user profile with role information
export async function getUserProfile(userId: string) {
  try {
    const profile = await prisma.userRole.findUnique({
      where: { userId },
      select: {
        role: true,
        name: true,
        email: true,
      },
    });
    return profile;
  } catch (error) {
    console.error('[Auth Debug] Error getting user profile:', error);
    return null;
  }
}

// Check if user has required role - redirects to home if not
export async function checkRoleWithRedirect(
  userId: string,
  allowedRoles: Role[],
) {
  const hasRole = await checkRole(userId, allowedRoles);

  if (!hasRole) {
    console.log('[Auth Debug] User does not have required role', allowedRoles);
    redirect('/');
  }

  return true;
}

// Re-export checkAdmin for consistency
export { checkAdmin };

// Check if user is authenticated - redirects to dashboard if already logged in
export async function checkAuthenticatedRedirect() {
  const user = await getUserSession();
  if (user) {
    console.log(
      '[Auth Debug] User already authenticated, redirecting to /dashboard',
    );
    redirect('/dashboard');
  }
}
