import { create } from 'zustand';

//----------------------------------------------------------------
//responsible for storing states for logged in user

interface AuthUser {
  uid: string;
  email: string;
  role: 'admin' | 'employee';
}

interface AuthState {
  user: AuthUser | null;
  isAuthLoading: boolean;
  isRedirecting: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setAuthLoading: (value: boolean) => void;
  setRedirecting: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoading: true,
  isRedirecting: false,
  login: (user) => set({ user }),
  logout: () => set({ user: null, isRedirecting: false }),
  setAuthLoading: (value) => set({ isAuthLoading: value }),
  setRedirecting: (value) => set({ isRedirecting: value }),
}));
