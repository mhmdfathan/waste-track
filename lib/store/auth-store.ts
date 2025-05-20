import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@prisma/client';
import { User } from '@supabase/supabase-js';
import { getUserProfileClient } from '@/lib/auth-client';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  profile: UserRole | null;
  isLoading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserRole | null) => void;
  setLoading: (isLoading: boolean) => void;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      initialized: false,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      checkSession: async () => {
        const supabase = createClient();
        try {
          // Only check if we don't have a user already
          if (!get().user || !get().initialized) {
            set({ isLoading: true });
            const {
              data: { user },
            } = await supabase.auth.getUser();
            set({ user });

            if (user) {
              const profile = await getUserProfileClient();
              set({ profile });
            } else {
              set({ profile: null });
            }
          }
        } catch (error) {
          console.error('Error checking session:', error);
          set({ user: null, profile: null });
        } finally {
          set({ isLoading: false, initialized: true });
        }
      },
      logout: async () => {
        const supabase = createClient();
        try {
          set({ isLoading: true });
          await supabase.auth.signOut();
          set({ user: null, profile: null });
          window.location.href = '/';
        } catch (error) {
          console.error('Error signing out:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, profile: state.profile }),
    },
  ),
);
