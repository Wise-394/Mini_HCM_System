import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from './firebase.ts';
import { useAuthStore } from '../store/useAuthStore.tsx';

export const initAuthListener = () => {
  const { login, logout, setAuthLoading } = useAuthStore.getState();

  onAuthStateChanged(auth, async (user) => {
    if (user && user.email) {
      const idToken = await getIdToken(user);
      login({ uid: user.uid, email: user.email }, idToken);
    } else {
      logout();
    }
    setAuthLoading(false);
  });
};
