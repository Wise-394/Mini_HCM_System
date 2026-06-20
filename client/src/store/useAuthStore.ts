import { create } from 'zustand';

interface AuthState {
  user: { uid: string; email: string } | null;
  isAuthLoading: boolean;
  login: (user: { uid: string; email: string }) => void;
  logout: () => void;
  setAuthLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoading: true,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  setAuthLoading: (value) => set({ isAuthLoading: value }),
}));

// TODO ADD NAME
