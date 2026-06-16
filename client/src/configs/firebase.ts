import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC85OiYUTdmTzA1lzH8DqNOqcv6hGSPBMw",
  authDomain: "mini-hcm-system.firebaseapp.com",
  projectId: "mini-hcm-system",
  storageBucket: "mini-hcm-system.firebasestorage.app",
  messagingSenderId: "763858017160",
  appId: "1:763858017160:web:6a4d3ae07519257456b83d",
  measurementId: "G-V5LSFW6QLY",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
