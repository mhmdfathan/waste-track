/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import prisma from '@/app/utils/db';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Constants
const SESSION_TOKEN_COOKIE_NAME = 'session-token';
const SESSION_EXPIRY_DAYS = 7;
const SALT_ROUNDS = 10;

// Helper to generate a session token
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

// Helper to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Helper to verify passwords
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create a new session for a user
export async function createSession(userId: string): Promise<string> {
  // Create expiry date (7 days from now)
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_EXPIRY_DAYS);

  // Generate a new session token
  const sessionToken = generateSessionToken();

  // Create a session record in the database
  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires,
    },
  });

  // Set the session cookie
  cookies().set({
    name: SESSION_TOKEN_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/',
  });

  return sessionToken;
}

// Validate a session and return the user
export async function validateSession() {
  try {
    // Get the session token from cookies
    const sessionToken = cookies().get(SESSION_TOKEN_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    // Look up the session
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    // If no session found or session is expired, return null
    if (!session || new Date() > session.expires) {
      if (session) {
        // Clean up expired session
        await prisma.session.delete({ where: { id: session.id } });
      }
      cookies().delete(SESSION_TOKEN_COOKIE_NAME);
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

// Get the current session user with profile
export async function getCurrentUser() {
  const user = await validateSession();

  if (!user) {
    return null;
  }

  // Fetch the user role/profile
  const profile = await prisma.userRole.findUnique({
    where: { userId: user.id },
  });

  return {
    user,
    profile,
  };
}

// Login a user and create a session
export async function loginUser(email: string, password: string) {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify the password
    const passwordValid = await verifyPassword(password, user.hashedPassword);

    if (!passwordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create a session
    const sessionToken = await createSession(user.id);

    // Fetch the user profile
    const profile = await prisma.userRole.findUnique({
      where: { userId: user.id },
    });

    return {
      success: true,
      user,
      profile,
      sessionToken,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

// Register a new user
export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: Role,
) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: 'Email already in use' };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user and profile in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          hashedPassword,
          name,
        },
      });

      // Create user role/profile
      const profile = await prisma.userRole.create({
        data: {
          userId: user.id,
          role,
          name,
          email: email.toLowerCase(),
        },
      });

      // Create a session
      const sessionToken = generateSessionToken();
      const expires = new Date();
      expires.setDate(expires.getDate() + SESSION_EXPIRY_DAYS);

      await prisma.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires,
        },
      });

      return { user, profile, sessionToken, expires };
    });

    // Set the session cookie
    cookies().set({
      name: SESSION_TOKEN_COOKIE_NAME,
      value: result.sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: result.expires,
      path: '/',
    });

    return {
      success: true,
      user: result.user,
      profile: result.profile,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'An error occurred during registration' };
  }
}

// Logout a user by deleting their session
export async function logoutUser() {
  try {
    const sessionToken = cookies().get(SESSION_TOKEN_COOKIE_NAME)?.value;

    if (sessionToken) {
      await prisma.session.deleteMany({
        where: { sessionToken },
      });
    }

    cookies().delete(SESSION_TOKEN_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'An error occurred during logout' };
  }
}

// For middleware - validate session from request
export async function validateSessionFromRequest(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(SESSION_TOKEN_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return null;
    }

    // Look up the session
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    // If no session found or session is expired, return null
    if (!session || new Date() > session.expires) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error validating session from request:', error);
    return null;
  }
}

// Check if user has required role
export async function checkRole(userId: string, allowedRoles: Role[]) {
  try {
    const profile = await prisma.userRole.findUnique({
      where: { userId },
      select: { role: true },
    });

    if (!profile || !allowedRoles.includes(profile.role)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
}

// Check if user is an admin
export async function checkAdmin(userId: string) {
  return checkRole(userId, [Role.ADMIN]);
}

// Requirement function for protected routes
export async function requireAuth() {
  const session = await getCurrentUser();
  return session?.user;
}
