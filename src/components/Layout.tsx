import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, X, Code2 } from 'lucide-react';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500 p-1.5 rounded-lg">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">DevMentor<span className="text-indigo-400">AI</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-400 hover:text-white">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 bg-zinc-950`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
