// src/store/useAuthStore.ts

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
  user: { id: string; email: string; name: string | null } | null;
  isHydrated: boolean;
  setAuth: (data: { token: string; user: { id: string; email: string; name: string | null } }) => void;
  logout: () => void;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isHydrated: false, 
      setAuth: (data) => set({ token: data.token, user: data.user }),
      logout: () => set({ token: null, user: null, isHydrated: true }), 
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);