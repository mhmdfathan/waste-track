/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@/lib/supabase/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import prisma from '@/app/utils/db';

export async function getUserProfileClient() {
  try {
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - might need to refresh session
        const supabase = createClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (session) {
          // Retry the request if we have a session
          const retryResponse = await fetch('/api/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }
      }
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
