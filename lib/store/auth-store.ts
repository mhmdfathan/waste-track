import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRoleWithRelations } from '@/types/auth';

type User = {
  id: string;
  email: string;
  name: string;
};

interface AuthState {
  user: User | null;
  profile: UserRoleWithRelations | null;
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
  isCheckingSession: boolean;
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
      isLoading: true, // Initial loading state until first checkSession completes
      initialized: false,
      error: null,
      isCheckingSession: false,

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
        // Set isLoading to true when initialization starts,
        // checkSession will set it to false when done.
        set({ isLoading: true });
        try {
          await get().checkSession();
        } catch (initError) {
          console.error('AuthStore: Error during initialization:', initError);
          set({ error: 'Initialization failed.' });
        } finally {
          // Ensure isLoading is false after initialization attempt,
          // and initialized is true.
          set({ initialized: true, isLoading: false });
        }
      },

      redirectToRole: (profile) => {
        if (typeof window === 'undefined') return;
        const path =
          profile.role === 'ADMIN'
            ? '/admin'
            : profile.role === 'NASABAH'
            ? '/browse' // Updated: NASABAH redirects to /browse
            : profile.role === 'PEMERINTAH'
            ? '/statistics'
            : profile.role === 'PERUSAHAAN'
            ? '/browse' // Updated: PERUSAHAAN redirects to /browse
            : '/browse'; // Default redirect for authenticated users
        window.location.href = path;
      },

      checkSession: async () => {
        if (get().isCheckingSession) {
          return;
        }

        set({ isLoading: true, error: null, isCheckingSession: true });

        try {
          // Fetch session info from the server
          const response = await fetch('/api/auth/session');

          if (response.ok) {
            const sessionData = await response.json();

            if (sessionData.user) {
              // Update user if it's different from what we have
              if (!get().user || get().user.id !== sessionData.user.id) {
                set({ user: sessionData.user });
              }

              // Now fetch the user profile
              try {
                const profileResponse = await fetch('/api/profile');
                if (profileResponse.ok) {
                  const profileData = await profileResponse.json();
                  set({ profile: profileData, error: null });
                } else {
                  const errorText = await profileResponse.text();
                  console.error(
                    `AuthStore: Failed to fetch profile: ${profileResponse.status} ${profileResponse.statusText}`,
                    errorText,
                  );

                  if (
                    profileResponse.status === 401 ||
                    profileResponse.status === 403 ||
                    profileResponse.status === 404
                  ) {
                    set({
                      profile: null,
                      error: `Profile not accessible or not found (status: ${profileResponse.status}). User may need to complete registration, fix permissions, or the profile may not exist.`,
                    });
                  } else {
                    // For other server-side errors (e.g., 5xx), it's possible the issue is temporary.
                    // In this case, we'll keep the potentially stale profile (if one exists in the store)
                    // and display an error message.
                    set({
                      error: `Failed to fetch profile due to a server error (status: ${profileResponse.status}). Displaying cached profile if available.`,
                    });
                  }
                }
              } catch (profileError) {
                console.error(
                  'AuthStore: Exception fetching profile in checkSession:',
                  profileError,
                );
                set({
                  error: `Exception fetching profile. Displaying cached profile if available. ${
                    profileError instanceof Error ? profileError.message : ''
                  }`,
                });
              }
            } else {
              // No user in the session
              if (get().user || get().profile) {
                set({ user: null, profile: null });
              }
            }
          } else {
            // Session check failed
            console.error(
              'AuthStore: Session check failed with status:',
              response.status,
            );
            set({
              user: null,
              profile: null,
              error: `Session check failed (status: ${response.status})`,
            });
          }
        } catch (error) {
          console.error('AuthStore: Error in checkSession:', error);
          set({
            user: null,
            profile: null,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to check session',
          });
        } finally {
          set({ isLoading: false, isCheckingSession: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          if (data.user) {
            set({ user: data.user, profile: data.profile });

            // Redirect based on role if profile exists
            if (data.profile) {
              get().redirectToRole(data.profile);
            } else {
              console.warn(
                'AuthStore: Login successful, but profile not loaded. User might be stuck.',
              );
            }
          } else {
            throw new Error('Login did not return a user object.');
          }
        } catch (error) {
          console.error('AuthStore: Login error:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to log in';
          set({ error: errorMessage, user: null, profile: null });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/auth/logout', {
            method: 'POST',
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Logout failed');
          }
        } catch (error) {
          console.error('AuthStore: Logout failed:', error);
          if (error instanceof Error) {
            set({ error: error.message });
          } else {
            set({ error: 'Logout failed due to an unexpected error.' });
          }
        } finally {
          set({ user: null, profile: null, isLoading: false });
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
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
