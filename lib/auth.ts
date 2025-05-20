import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import prisma from '@/app/utils/db';
import type { User } from '@supabase/supabase-js';

// Get user session - returns the User object if authenticated, null otherwise
export async function getUserSession(): Promise<User | null> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('[Auth Debug] Error getting user:', userError);
      return null;
    }

    return user;
  } catch (error) {
    console.error('[Auth Debug] Unexpected error:', error);
    return null;
  }
}

// Require authentication - redirects to login if not authenticated
export async function requireAuth(): Promise<User> {
  const user = await getUserSession();
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
export async function checkRole(userId: string, allowedRoles: Role[]) {
  const profile = await getUserProfile(userId);

  if (!profile || !allowedRoles.includes(profile.role)) {
    console.log(
      '[Auth Debug] User does not have required role',
      profile?.role,
      allowedRoles,
    );
    redirect('/');
  }

  return true;
}

// Check if a user is an admin
export async function checkAdmin(userId: string) {
  const profile = await getUserProfile(userId);
  return profile?.role === Role.ADMIN;
}

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
