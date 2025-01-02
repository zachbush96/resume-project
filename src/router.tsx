import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from './components/landingPage';
import SignInPage from './components/signInPage';
import AdminDashboard from './components/AdminDashboard';
import App from './App';
import { InterviewPrep } from './components/InterviewPrep';
import { TokenPurchase } from './components/TokenPurchase';
import { auth } from './firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Layout } from './components/Layout';

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
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user has admin role (implement your admin check logic)
        const isUserAdmin = user.email?.endsWith('@jobgetterai.com') || false;
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/app" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <LandingPage />
      </Layout>
    )
  },
  {
    path: '/signin',
    element: (
      <Layout>
        <SignInPage />
      </Layout>
    )
  },
  {
    path: '/app',
    element: (
      <AuthenticatedRoute>
        
          <App />
        
      </AuthenticatedRoute>
    )
  },
  {
    path: '/interview',
    element: (
      <AuthenticatedRoute>
        <Layout>
          <InterviewPrep onSubmit={() => {}} />
        </Layout>
      </AuthenticatedRoute>
    )
  },
  {
    path: '/tokens',
    element: (
      <AuthenticatedRoute>
        <Layout>
          <TokenPurchase currentBalance={0} />
        </Layout>
      </AuthenticatedRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <AdminRoute>
        <Layout>
          <AdminDashboard />
        </Layout>
      </AdminRoute>
    )
  }
]);

export default router; 