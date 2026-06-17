import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.ts';
import { useAuthStore } from '../store/useAuthStore.tsx';

// Syncs Firebase auth state changes to Zustand
export const initAuthListener = () => {
  const { login, logout, setAuthLoading } = useAuthStore.getState();

  onAuthStateChanged(auth, async (user) => {
    if (user && user.email) {
      login({ uid: user.uid, email: user.email });
    } else {
      logout();
    }
    setAuthLoading(false);
  });
};
