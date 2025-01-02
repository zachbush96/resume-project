import React from 'react';
import { BrainCog } from 'lucide-react';
import { NavigationBar } from './NavigationBar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function Layout({ children, sidebar }: Props) {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <header className="bg-white shadow-md fixed w-full z-10">
        <div className="container mx-auto px-4 flex items-center h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <BrainCog className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Job Getter AI</h1>
          </div>
          {!isLandingPage && (
            <div className="flex-1 flex justify-between items-center">
              {user ? (
                <NavigationBar user={user} />
              ) : (
                <div className="flex-1 flex justify-end gap-4">
                  <button
                    onClick={() => navigate('/signin')}
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signin')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Sign Up Free
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <div className="pt-16 flex">
        {sidebar && (
          <div className="w-64 fixed h-[calc(100vh-4rem)]">
            {sidebar}
          </div>
        )}
        <main className={`flex-1 ${sidebar ? 'ml-64' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

