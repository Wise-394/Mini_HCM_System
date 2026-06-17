import { create } from 'zustand';

interface AuthState {
  user: { uid: string; email: string } | null;
  idToken: string | null;
  login: (user: { uid: string; email: string }, idToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  idToken: null,
  login: (user, idToken) => set({ user, idToken }),
  logout: () => set({ user: null, idToken: null }),
}));
