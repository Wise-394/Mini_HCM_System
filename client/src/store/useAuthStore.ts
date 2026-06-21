import { create } from 'zustand';

interface AuthUser {
  uid: string;
  email: string;
  role: 'admin' | 'employee';
}

interface AuthState {
  user: AuthUser | null;
  isAuthLoading: boolean;
  login: (user: AuthUser) => void;
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
