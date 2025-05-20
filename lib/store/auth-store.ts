import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { persist } from 'zustand/middleware';
import { UserRoleWithRelations } from '@/types/auth';

interface AuthState {
  user: User | null;
  profile: UserRoleWithRelations | null;
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserRoleWithRelations | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  redirectToRole: (profile: UserRoleWithRelations) => void;
  getSessionState: () => {
    isAuthenticated: boolean;
    hasProfile: boolean;
    role: string | null;
  };
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      initialized: false,
      error: null,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getSessionState: () => {
        const state = get();
        return {
          isAuthenticated: !!state.user,
          hasProfile: !!state.profile,
          role: state.profile?.role ?? null,
        };
      },

      initialize: async () => {
        if (get().initialized) return;

        try {
          await get().checkSession();
        } finally {
          set({ initialized: true, isLoading: false });
        }
      },

      redirectToRole: (profile) => {
        const path =
          profile.role === 'ADMIN'
            ? '/admin'
            : profile.role === 'NASABAH'
            ? '/dashboard'
            : profile.role === 'PEMERINTAH'
            ? '/statistics'
            : profile.role === 'PERUSAHAAN'
            ? '/transactions'
            : '/';
        window.location.href = path;
      },

      checkSession: async () => {
        const supabase = createClient();
        try {
          set({ isLoading: true, error: null });
          const {
            data: { user },
            error: sessionError,
          } = await supabase.auth.getUser();

          if (sessionError) throw sessionError;
          set({ user });

          if (user) {
            try {
              const response = await fetch('/api/profile');
              if (!response.ok) throw new Error('Failed to fetch profile');

              const profile = await response.json();
              set({ profile });
            } catch (profileError) {
              console.error('Error fetching profile:', profileError);
              set({ profile: null });
            }
          } else {
            set({ profile: null });
          }
        } catch (error) {
          console.error('Error checking session:', error);
          set({
            user: null,
            profile: null,
            error: 'Failed to check session',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        const supabase = createClient();
        try {
          set({ isLoading: true, error: null });
          const { data, error: signInError } =
            await supabase.auth.signInWithPassword({
              email,
              password,
            });

          if (signInError) throw signInError;

          if (data.user) {
            set({ user: data.user });
            try {
              const response = await fetch('/api/profile');
              if (!response.ok) throw new Error('Failed to fetch profile');

              const profile = await response.json();
              set({ profile });
              get().redirectToRole(profile);
            } catch (profileError) {
              console.error(
                'Error fetching profile after login:',
                profileError,
              );
              throw new Error('Failed to fetch user profile');
            }
          }
        } catch (error) {
          console.error('Login error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to log in',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const supabase = createClient();
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({ user: null, profile: null });
          window.location.href = '/';
        } catch (error) {
          console.error('Error signing out:', error);
          set({ error: 'Failed to sign out' });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        initialized: state.initialized,
      }),
    },
  ),
);
