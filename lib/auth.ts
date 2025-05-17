import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getUserSession() {
  const supabase = await createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const session = await getUserSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getUserSession();
  if (session) {
    redirect('/dashboard');
  }
  return session;
}
