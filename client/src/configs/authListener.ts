import { onAuthStateChanged } from 'firebase/auth';
import { getIdToken } from 'firebase/auth';
import { auth } from './firebase.ts';
import { useAuthStore } from '../store/useAuthStore.tsx';

export const initAuthListener = () => {
  const { login, logout, setAuthLoading } = useAuthStore.getState();

  onAuthStateChanged(auth, async (user) => {
    if (user && user.email) {
      await getIdToken(user, true);
      login({ uid: user.uid, email: user.email });
    } else {
      logout();
    }
    setAuthLoading(false);
  });
};
