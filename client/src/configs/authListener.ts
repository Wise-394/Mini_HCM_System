import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from './firebase.ts';
import { useAuthStore } from '../store/useAuthStore.ts';
import type { UserProfileType } from '../types/types.ts';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API;

export const initAuthListener = () => {
  const { login, logout, setAuthLoading } = useAuthStore.getState();

  onAuthStateChanged(auth, async (user) => {
    if (user && user.email) {
      try {
        const idToken = await getIdToken(user, true);
        const res = await fetch(`${API_BASE_URL}/users/${user.uid}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const { data: profile }: { data: UserProfileType } = await res.json();

        if (!profile.role) {
          logout();
        } else {
          login({ uid: user.uid, email: user.email, role: profile.role });
        }
      } catch {
        logout();
      }
    } else {
      logout();
    }

    setAuthLoading(false);
  });
};
