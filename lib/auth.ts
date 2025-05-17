import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import prisma from '@/app/utils/db';
import { type Role } from '@prisma/client';

export async function getUserSession() {
  const supabase = await createClient();
  try {
    // Get authenticated user data
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('[Auth Debug] Error getting user:', userError);
      return null;
    }

    // Get session data
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[Auth Debug] Error getting session:', sessionError);
      return null;
    }

    console.log('[Auth Debug] Auth state:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      sessionExists: !!session,
      sessionExpiry: session?.expires_at,
    });

    // Only return session if we have both valid user and session
    return user && session ? session : null;
  } catch (error) {
    console.error('[Auth Debug] Unexpected error:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getUserSession();
  if (!session) {
    console.log(
      '[Auth Debug] requireAuth: No session found, redirecting to /login',
    );
    redirect('/login');
  }
  return session;
}

export async function getUserProfile() {
  const supabase = await createClient();

  // Get authenticated user data directly
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log(
      '[Auth Debug] No authenticated user found:',
      userError?.message ?? 'No user data',
    );
    return null;
  }

  // Get user role and include relevant relations based on role
  try {
    const profile = await prisma.userRole.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        companyProfile: true,
        timbangData: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            transaction: true,
          },
        },
      },
    });

    console.log('[Auth Debug] Profile fetch result:', {
      found: !!profile,
      userId: user.id,
      userEmail: user.email,
      role: profile?.role,
      hasCompanyProfile: !!profile?.companyProfile,
    });
    if (!profile) {
      // If we have an authenticated user but no profile, create one
      try {
        console.log('[Auth Debug] Creating new profile for user:', user.id);

        // Determine if this is a company account based on email domain
        const isCompany =
          user.email?.toLowerCase().includes('company') ||
          user.email?.toLowerCase().includes('corp') ||
          user.email?.toLowerCase().includes('ltd') ||
          user.email?.toLowerCase().includes('inc');

        const role = isCompany ? 'PERUSAHAAN' : 'NASABAH';
        console.log('[Auth Debug] Detected role for new profile:', role);

        const newProfile = await prisma.userRole.create({
          data: {
            userId: user.id,
            email: user.email ?? '',
            name: user.email?.split('@')[0] ?? 'User',
            role: role,
            // If it's a company, create the company profile automatically
            ...(role === 'PERUSAHAAN' && {
              companyProfile: {
                create: {
                  companyName: user.email?.split('@')[0] ?? 'New Company',
                  address: '',
                  latitude: 0,
                  longitude: 0,
                  phone: '',
                  description: '',
                  deliveryRadius: 50,
                  deliveryFeeBase: 10000,
                  feePerKm: 1000,
                  acceptedWasteTypes: ['RECYCLABLE', 'NON_RECYCLABLE'],
                },
              },
            }),
          },
          include: {
            companyProfile: true,
            timbangData: {
              take: 5,
              orderBy: {
                createdAt: 'desc',
              },
              include: {
                transaction: true,
              },
            },
          },
        });

        console.log('[Auth Debug] New profile created:', {
          userId: newProfile.userId,
          role: newProfile.role,
        });

        return newProfile;
      } catch (createError) {
        console.error('[Auth Debug] Error creating new profile:', createError);
        return null;
      }
    }

    return profile;
  } catch (error) {
    console.error('[Auth Debug] Error fetching profile:', error);
    return null;
  }
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  const profile = await getUserProfile();

  console.log('[Auth Debug] requireRole check:', {
    hasProfile: !!profile,
    userRole: profile?.role,
    allowedRoles,
    allowed: profile ? allowedRoles.includes(profile.role) : false,
  });

  if (!profile || !allowedRoles.includes(profile.role)) {
    console.log('[Auth Debug] Invalid role, redirecting to /error');
    redirect('/error');
  }

  return { session, profile };
}

export async function redirectIfAuthenticated() {
  const session = await getUserSession();
  if (session) {
    console.log(
      '[Auth Debug] User already authenticated, redirecting to /dashboard',
    );
    redirect('/dashboard');
  }
  return session;
}
