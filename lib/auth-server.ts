// This file provides server-side authentication utilities
import { cookies } from 'next/headers';
import { validateSession } from './auth-utils';
import type { User } from '@/types/auth';

// Gets the current user on the server side
export async function getServerUser(): Promise<{
  data: { user: User | null };
  error: Error | null;
}> {
  try {
    const user = await validateSession();
    return {
      data: { user },
      error: null,
    };
  } catch (error) {
    return {
      data: { user: null },
      error: error instanceof Error ? error : new Error('Failed to get user'),
    };
  }
}

// For RSC and API routes - checks if user is authenticated
export async function requireServerAuth() {
  const user = await validateSession();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

// For RSC and API routes - checks if user has required role
export async function requireServerRole(allowedRoles: string[]) {
  const user = await validateSession();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const profile = await prisma.userRole.findUnique({
    where: { userId: user.id },
  });

  if (!profile || !allowedRoles.includes(profile.role)) {
    throw new Error('Forbidden');
  }

  return { user, profile };
}
