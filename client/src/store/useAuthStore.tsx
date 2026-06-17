import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  idToken: string | null;
  login: (user: User, idToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  idToken: null,
  login: (user, idToken) => set({ user, idToken }),
  logout: () => set({ user: null, idToken: null }),
}));
