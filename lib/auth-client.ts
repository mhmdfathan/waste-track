/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuthStore } from './store/auth-store';
import prisma from '@/app/utils/db';

// This function replaces supabase.auth.getUser() in client components
export async function getCurrentUser() {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const { user } = await response.json();
      return {
        data: { user },
        error: null,
      };
    }

    return {
      data: { user: null },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return {
      data: { user: null },
      error,
    };
  }
}

export async function getUserProfileClient() {
  try {
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const profile = await response.json();
      // Update the auth store with the profile
      const { setProfile } = useAuthStore.getState();
      setProfile(profile);
      return profile;
    }

    throw new Error('Failed to fetch user profile');
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Clear profile in store if there's an error
    const { setProfile } = useAuthStore.getState();
    setProfile(null);
    throw error; // Re-throw the error to be handled by the caller
  }
}
