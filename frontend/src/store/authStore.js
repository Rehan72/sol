import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

/**
 * Interface definition for auth state
 * @typedef {Object} AuthState
 * @property {string|null} token
 * @property {string|null} user
 * @property {string|null} role
 * @property {boolean} isAuthenticated
 * @property {function(string): void} login
 * @property {function(): void} logout
 */

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,

      login: (token) => {
        try {
          const decoded = jwtDecode(token);
          set({
            token,
            user: {
              name: decoded.name || null,
              email: decoded.email || null,
              id: decoded.sub
            },
            role: decoded.role,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Failed to decode token", error);
          set({ token: null, user: null, role: null, isAuthenticated: false });
        }
      },

      logout: () => {
        set({ token: null, user: null, role: null, isOnboarded: false, isAuthenticated: false });
        localStorage.clear(); // Clear everything as requested
      },

      setOnboardingStatus: (isOnboarded) => {
        set({ isOnboarded });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2, // Increment version to trigger migration or clear
      migrate: (persistedState, version) => {
        if (version < 2 && persistedState && typeof persistedState.user === 'string') {
          // If we have an old string user, clear it so it can be re-fetched on next login
          return { ...persistedState, user: null };
        }
        return persistedState;
      },
      partialize: (state) => ({ token: state.token, user: state.user, role: state.role, isAuthenticated: state.isAuthenticated }),
    }
  )
);
