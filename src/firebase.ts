import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// Web Client ID : 169810374201-adqdrbv5eqratspoj2tqr7rvf5ecokkc.apps.googleusercontent.com
// Client Secret : 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
const firebaseConfig = {
  apiKey: "AIzaSyCRdXMRmqN1a1Ykfqz8lmTjvzVThkM40D0",
  authDomain: "resumegenerator-403319.firebaseapp.com",
  projectId: "resumegenerator-403319",
  storageBucket: "resumegenerator-403319.appspot.com",
  messagingSenderId: "169810374201",
  appId: "1:169810374201:web:d5e38aeb055166a6ece7e8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();