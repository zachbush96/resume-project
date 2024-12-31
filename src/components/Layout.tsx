import React from 'react';
import { BrainCog } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function Layout({ children, sidebar }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <header className="bg-white shadow-md fixed w-full z-10">
        <div className="container mx-auto px-4 py-6 flex items-center gap-3">
          <BrainCog className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Job Getter AI</h1>
        </div>
      </header>
      {sidebar}
      <main className="pt-20 pl-64">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

