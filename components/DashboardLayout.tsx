'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ListTodo, 
  Layers, 
  FileText, 
  TestTube,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'blue' },
  { name: 'Project', href: '/dashboard/project', icon: FolderKanban, color: 'emerald' },
  { name: 'Product Backlog', href: '/dashboard/product-backlog', icon: ListTodo, color: 'violet' },
  { name: 'Sprints', href: '/dashboard/sprints', icon: Layers, color: 'purple' },
  { name: 'Epics', href: '/dashboard/epics', icon: FileText, color: 'orange' },
  { name: 'User Stories', href: '/dashboard/user-stories', icon: FileText, color: 'cyan' },
  { name: 'Test Cases', href: '/dashboard/test-cases', icon: TestTube, color: 'pink' },
  { name: 'Roles', href: '/dashboard/roles', icon: Users, color: 'indigo' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Layers className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Agile PM</h1>
                <p className="text-xs text-slate-400">Project Manager</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="mb-6">
              <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Main Menu
              </p>
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50' 
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <div className={`
                            p-2 rounded-lg mr-3 transition-colors
                            ${isActive 
                              ? 'bg-white/20' 
                              : `bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20`
                            }
                          `}>
                            <item.icon size={20} />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        {isActive && <ChevronRight size={18} />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* User info */}
          <div className="border-t border-slate-700/50 p-4 bg-slate-900/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {user?.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.previlige.replace('_', ' ')}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all duration-200 group"
            >
              <LogOut size={18} className="mr-2" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10 border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-lg">
                <Search size={18} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-64"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user?.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
