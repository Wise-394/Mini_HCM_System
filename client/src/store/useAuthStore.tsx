import { create } from 'zustand';

interface AuthState {
  user: { uid: string; email: string } | null;
  idToken: string | null;
  isAuthLoading: boolean;
  login: (user: { uid: string; email: string }, idToken: string) => void;
  logout: () => void;
  setAuthLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  idToken: null,
  isAuthLoading: true,
  login: (user, idToken) => set({ user, idToken }),
  logout: () => set({ user: null, idToken: null }),
  setAuthLoading: (value) => set({ isAuthLoading: value }),
}));
