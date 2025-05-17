import { createClient } from '@/lib/supabase/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import prisma from '@/app/utils/db';

export async function getUserProfileClient() {
  const supabase = createClient();

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
    const response = await fetch('/api/profile?userId=' + user.id);
    const profile = await response.json();

    return profile;
  } catch (error) {
    console.error('[Auth Debug] Error fetching profile:', error);
    return null;
  }
}
