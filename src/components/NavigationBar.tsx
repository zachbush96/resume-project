import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface Props {
  user: any;
}

export function NavigationBar({ user }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex-1 ml-8">
      <div className="flex justify-between items-center h-full">
        <div className="flex space-x-8">
          <button
            onClick={() => navigate('/app')}
            className={`${
              isActive('/app')
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } inline-flex items-center px-1 h-16 border-b-2 text-sm font-medium`}
          >
            Resume Generator
          </button>
          <button
            onClick={() => navigate('/interview')}
            className={`${
              isActive('/interview')
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } inline-flex items-center px-1 h-16 border-b-2 text-sm font-medium`}
          >
            Interview Prep
          </button>
          <button
            onClick={() => navigate('/tokens')}
            className={`${
              isActive('/tokens')
                ? 'border-indigo-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } inline-flex items-center px-1 h-16 border-b-2 text-sm font-medium`}
          >
            Purchase Tokens
          </button>
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            {user.photoURL ? (
              <img
                className="h-8 w-8 rounded-full"
                src={user.photoURL}
                alt=""
              />
            ) : (
              <User className="h-8 w-8 p-1 rounded-full bg-gray-100" />
            )}
            <span className="text-sm font-medium">{user.displayName || user.email}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 