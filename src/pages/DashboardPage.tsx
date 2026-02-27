import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  Zap, 
  Trophy, 
  ArrowUpRight,
  Plus,
  Lightbulb,
  Loader2,
  X,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, MOCK_EVENTS, MOCK_PROJECTS } from '../data/mockData';
import { cn, formatDate } from '../utils/helpers';
import { generateProjectIdea } from '../services/aiService';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState<{ title: string; description: string; features: string[] } | null>(null);

  const handleGenerateIdea = async () => {
    setIsGeneratingIdea(true);
    const idea = await generateProjectIdea(user?.skills || [], user?.interests || []);
    if (idea) {
      setGeneratedIdea(idea);
    }
    setIsGeneratingIdea(false);
  };

  const stats = [
    { label: 'Active Projects', value: '3', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Team Requests', value: '12', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Upcoming Events', value: '2', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Trophy, label: 'Skill Points', value: '850', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Here's what's happening in your network today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              // Navigate to calendar or show calendar modal
              const today = new Date();
              navigate('/calendar');
            }}
            className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Calendar
          </button>
          <button 
            onClick={() => navigate('/team-builder')}
            className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => {
              // Navigate to relevant pages based on stat type
              if (stat.label === 'Active Projects') {
                navigate('/projects');
              } else if (stat.label === 'Team Requests') {
                navigate('/find');
              } else if (stat.label === 'Upcoming Events') {
                navigate('/events');
              } else if (stat.label === 'Skill Points') {
                navigate('/insights');
              }
            }}
            className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-emerald-500/50 transition-all group"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Suggestions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Suggested Teammates
              </h2>
              <button 
                onClick={() => navigate('/find')}
                className="text-sm font-bold text-emerald-500 hover:underline"
              >
                View all
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {MOCK_USERS.filter(u => u.id !== user?.id).slice(0, 2).map((u, i) => (
                <div key={i} className="p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-2xl object-cover" />
                      <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">{u.name}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{u.branch}</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg uppercase">
                      {u.compatibility}% Match
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {u.skills.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => navigate(`/profile/${u.id}`)}
                    className="w-full py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    View Profile <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* AI Project Idea Generator */}
          <section className="p-8 bg-emerald-500 rounded-[2rem] text-white relative overflow-hidden shadow-xl shadow-emerald-500/20">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Stuck for an idea?</h2>
              </div>
              <p className="text-emerald-50 mb-8 max-w-md">
                Our AI can analyze your skills and interests to generate unique project ideas tailored just for you.
              </p>
              <button 
                onClick={handleGenerateIdea}
                disabled={isGeneratingIdea}
                className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg flex items-center gap-2 disabled:opacity-70"
              >
                {isGeneratingIdea ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isGeneratingIdea ? 'Generating...' : 'Generate Project Idea'}
              </button>
              
              {/* Display generated idea */}
              {generatedIdea && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
                >
                  <h3 className="font-bold text-lg mb-2">{generatedIdea.title}</h3>
                  <p className="text-emerald-50 text-sm mb-3">{generatedIdea.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-100">Key Features:</p>
                    {generatedIdea.features.map((feature, idx) => (
                      <p key={idx} className="text-xs text-emerald-50 ml-2">• {feature}</p>
                    ))}
                  </div>
                  <button 
                    onClick={() => navigate('/team-builder')}
                    className="mt-4 px-4 py-2 bg-white text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all"
                  >
                    Build This Team
                  </button>
                </motion.div>
              )}
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </section>

          {/* Activity Feed */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Activity</h2>
              <button 
                onClick={() => navigate('/activity')}
                className="text-sm font-bold text-emerald-500 hover:underline"
              >
                View all
              </button>
            </div>
            <div className="space-y-4">
              {[
                { user: 'Sarah Chen', action: 'posted a new micro task', time: '2h ago', icon: Zap, link: '/micro' },
                { user: 'Alex Johnson', action: 'joined "Simply Connect"', time: '5h ago', icon: Users, link: '/projects' },
                { user: 'Dr. Miller', action: 'verified your skill: React', time: '1d ago', icon: Trophy, link: '/insights' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => item.link && navigate(item.link)}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                    <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-900 dark:text-white">
                      <span className="font-bold">{item.user}</span> {item.action}
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider">{item.time}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Upcoming Events</h2>
              <button 
                onClick={() => navigate('/events')}
                className="text-xs font-bold text-emerald-500 hover:underline"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_EVENTS.map((event, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center text-[10px] font-black uppercase group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      {event.type.slice(0, 4)}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">{event.title}</h3>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                    <span>{formatDate(event.date)}</span>
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mini Calendar Preview */}
          <section className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">February 2026</h2>
              <button 
                onClick={() => navigate('/calendar')}
                className="text-xs font-bold text-emerald-500 hover:underline"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={`${d}-${i}`} className="text-[10px] font-bold text-zinc-400 mb-2">{d}</span>
              ))}
              {Array.from({ length: 28 }).map((_, i) => {
                const isToday = i + 1 === 26;
                const hasEvent = [5, 12, 19, 26].includes(i + 1);
                return (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/calendar?day=${i + 1}`)}
                    className={cn(
                      "aspect-square flex items-center justify-center text-[10px] font-bold rounded-lg transition-all cursor-pointer relative",
                      isToday 
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {i + 1}
                    {hasEvent && !isToday && (
                      <div className="absolute bottom-1 right-1 w-1 h-1 bg-emerald-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="p-6 bg-zinc-900 dark:bg-zinc-800 rounded-3xl text-white">
            <h2 className="text-sm font-bold mb-4 uppercase tracking-widest opacity-50">Network Strength</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>Connections</span>
                  <span className="font-bold">128</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[65%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>Endorsements</span>
                  <span className="font-bold">42</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[40%]"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Idea Modal */}
      <AnimatePresence>
        {generatedIdea && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGeneratedIdea(null)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 lg:p-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white">AI Project Idea</h2>
                </div>
                <button onClick={() => setGeneratedIdea(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-emerald-500">{generatedIdea.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {generatedIdea.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Key Features</h4>
                  <ul className="space-y-2">
                    {generatedIdea.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setGeneratedIdea(null)}
                    className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-black text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                  >
                    Close
                  </button>
                  <button className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                    Save to Projects
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
