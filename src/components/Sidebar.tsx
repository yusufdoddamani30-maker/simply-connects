import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wand2, 
  MessageSquareShare, 
  BarChart3, 
  UserCircle, 
  FileText,
  LogOut,
  Settings,
  Calendar,
  Brain
} from 'lucide-react';
import { cn } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Find Teammates', path: '/find' },
  { icon: Wand2, label: 'Team Builder', path: '/team-builder' },
  { icon: MessageSquareShare, label: 'Micro Collab', path: '/micro' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Brain, label: 'AI Feedback', path: '/feedback' },
  { icon: BarChart3, label: 'Skill Insights', path: '/insights' },
  { icon: FileText, label: 'Resume Builder', path: '/resume' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-40 transition-colors">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Simply-connect</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
        <button 
          onClick={() => {
            // Handle settings navigation
            console.log('Settings clicked');
          }}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button 
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
