import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from './components/landingPage';
import SignInPage from './components/signInPage';
import App from './App';
import { auth } from './firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

const AuthenticatedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or similar
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/signin',
    element: <SignInPage />
  },
  {
    path: '/app',
    element: (
      <AuthenticatedRoute>
        <App />
      </AuthenticatedRoute>
    )
  }
]);

export default router; 