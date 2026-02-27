import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareShare,
  Plus,
  X,
  Clock,
  Zap,
  User,
  Search,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Share2,
  MessageCircle,
  Filter,
  SlidersHorizontal,
  Loader2,
  Flag,
  Sparkles,
  Crown
} from 'lucide-react';
import { MOCK_TASKS } from '../data/mockData';
import { cn, formatDate } from '../utils/helpers';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

const SAVED_KEY = 'simply_connect_saved_micro_tasks';
const COMPLETED_KEY = 'simply_connect_completed_micro_tasks';
const STATS_KEY = 'simply_connect_micro_stats';

export const MicroCollaborationPage: React.FC = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState(() => {
    const stored = StorageService.getTasks();
    if (stored.length > 0) return stored;
    StorageService.saveTasks(MOCK_TASKS);
    return MOCK_TASKS;
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeRightModal, setActiveRightModal] = useState<null | 'leaderboard'>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [view, setView] = useState<'all' | 'mine' | 'saved' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const [savedTaskIds, setSavedTaskIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [isWorking, setIsWorking] = useState(false);
  const [workLabel, setWorkLabel] = useState<string>('Working...');

  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    reward: '',
    skills: ''
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    StorageService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedTaskIds));
  }, [savedTaskIds]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  const activeTask = useMemo(() => tasks.find(t => t.id === activeTaskId) || null, [tasks, activeTaskId]);

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => t.skillsRequired.forEach(s => set.add(s)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = tasks.filter(t => {
      const inSearch =
        q.length === 0 ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.skillsRequired.some(s => s.toLowerCase().includes(q));

      const inSkill = !skillFilter || t.skillsRequired.includes(skillFilter);

      const inView =
        view === 'all' ? true :
        view === 'mine' ? t.author === 'You' :
        view === 'saved' ? savedTaskIds.includes(t.id) :
        completedTaskIds.includes(t.id);

      return inSearch && inSkill && inView;
    });

    const sorted = [...base].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? db - da : da - db;
    });

    return sorted;
  }, [tasks, searchQuery, skillFilter, view, savedTaskIds, completedTaskIds, sortBy]);

  const toggleSaved = (taskId: string) => {
    setSavedTaskIds((prev) => prev.includes(taskId) ? prev.filter(id => id !== taskId) : [taskId, ...prev]);
  };

  const markCompleted = (taskId: string) => {
    setCompletedTaskIds((prev) => prev.includes(taskId) ? prev : [taskId, ...prev]);

    if (user?.id) {
      try {
        const current = JSON.parse(localStorage.getItem(STATS_KEY) || '{}') as Record<string, number>;
        const next = { ...current, [user.id]: (current[user.id] || 0) + 1 };
        localStorage.setItem(STATS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
    }

    setToast('Marked as completed');
    setTimeout(() => setToast(null), 1400);
  };

  const copyTaskLink = async (taskId: string) => {
    try {
      const url = `${window.location.origin}/micro?task=${encodeURIComponent(taskId)}`;
      await navigator.clipboard.writeText(url);
      setToast('Link copied');
      setTimeout(() => setToast(null), 1400);
    } catch {
      setToast('Could not copy link');
      setTimeout(() => setToast(null), 1400);
    }
  };

  const openTask = (taskId: string) => {
    setActiveTaskId(taskId);
    setIsMessageOpen(false);
    setMessageText('');
  };

  const closeTask = () => {
    setActiveTaskId(null);
    setIsMessageOpen(false);
    setMessageText('');
  };

  const sendMessage = async () => {
    if (!activeTask) return;
    const text = messageText.trim();
    if (!text) return;

    const recipient = StorageService.getUsers().find(u => u.name === activeTask.author);
    const toUserId = recipient?.id || 'unknown';
    const fromUserId = user?.id || 'unknown';

    StorageService.addMessage({
      id: `m${Date.now()}`,
      fromUserId,
      toUserId,
      content: text,
      timestamp: new Date().toISOString(),
      read: false,
    });

    setToast('Message sent');
    setTimeout(() => setToast(null), 1400);
    setMessageText('');
    setIsMessageOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task = {
      id: `t${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      author: 'You',
      skillsRequired: newTask.skills.split(',').map(s => s.trim()).filter(Boolean),
      reward: newTask.reward,
      createdAt: new Date().toISOString()
    };
    setTasks([task, ...tasks]);
    StorageService.addTask(task);
    setIsCreateModalOpen(false);
    setNewTask({ title: '', description: '', reward: '', skills: '' });
    setToast('Request posted');
    setTimeout(() => setToast(null), 1400);
  };

  const completedCount = useMemo(() => {
    let stats: Record<string, number> = {};
    try {
      stats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
    } catch {
      stats = {};
    }
    return user?.id ? (stats[user.id] || 0) : 0;
  }, [user?.id, completedTaskIds]);

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-2xl bg-zinc-900 text-white text-xs font-bold shadow-xl">
            {toast}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <MessageSquareShare className="w-8 h-8 text-emerald-500" /> Micro Collaborations
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Get quick help or offer your skills for small tasks.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              setSkillFilter(null);
              setSearchQuery('');
              setView('all');
              setSortBy('newest');
              setToast('Filters reset');
              setTimeout(() => setToast(null), 1200);
            }}
            className="px-5 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-2xl font-black text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            <Filter className="w-5 h-5" /> Reset
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-5 h-5" /> Create Request
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, authors, skills..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white outline-none"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'mine', 'saved', 'completed'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    "px-3 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-colors",
                    view === v
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  )}
                >
                  {v === 'all' ? `All (${tasks.length})` :
                   v === 'mine' ? 'My Requests' :
                   v === 'saved' ? `Saved (${savedTaskIds.length})` :
                   `Completed (${completedTaskIds.length})`}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSortBy((p) => (p === 'newest' ? 'oldest' : 'newest'))}
                className="px-3 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {sortBy === 'newest' ? 'Newest' : 'Oldest'}
              </button>
            </div>
          </div>

          {filteredTasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all group cursor-pointer",
                completedTaskIds.includes(task.id) && "opacity-80"
              )}
              onClick={() => openTask(task.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openTask(task.id);
              }}
            >
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">{task.title}</h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Requested by {task.author}</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-lg uppercase tracking-widest">
                  {task.reward}
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                {task.description}
              </p>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex flex-wrap gap-1.5">
                  {task.skillsRequired.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSkillFilter((prev) => (prev === s ? null : s));
                      }}
                      className={cn(
                        "px-2 py-1 text-[10px] font-bold rounded-md transition-colors",
                        skillFilter === s
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-emerald-500 hover:text-white"
                      )}
                      aria-label={`Filter by ${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> {formatDate(task.createdAt)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaved(task.id);
                      setToast(savedTaskIds.includes(task.id) ? 'Removed from saved' : 'Saved');
                      setTimeout(() => setToast(null), 1200);
                    }}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-emerald-500 hover:text-white transition-colors"
                    aria-label={savedTaskIds.includes(task.id) ? 'Unsave task' : 'Save task'}
                  >
                    {savedTaskIds.includes(task.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyTaskLink(task.id);
                    }}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-emerald-500 hover:text-white transition-colors"
                    aria-label="Share task link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTask(task.id);
                      setIsMessageOpen(true);
                      setMessageText(`Hey ${task.author}, I can help with "${task.title}". Here’s what I can do:\n\n`);
                    }}
                    className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-xl hover:bg-emerald-600 transition-all uppercase tracking-widest"
                  >
                    Help Out
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="p-10 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center">
              <p className="text-sm font-bold text-zinc-900 dark:text-white">No tasks found</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Try clearing filters or create a new request.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-xl font-black mb-6">Your Impact</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-sm font-bold opacity-80">Tasks Completed</span>
                  </div>
                  <span className="text-2xl font-black">{completedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold opacity-80">Saved Tasks</span>
                  </div>
                  <span className="text-2xl font-black">{savedTaskIds.length}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveRightModal('leaderboard')}
                className="w-full mt-8 py-4 bg-white text-zinc-900 rounded-2xl font-black text-xs hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                View Leaderboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Trending Skills</h3>
              <button
                type="button"
                onClick={() => {
                  setToast('Pick a skill to filter tasks');
                  setTimeout(() => setToast(null), 1200);
                }}
                className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline"
              >
                Tip
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'Python', 'UI Design', 'Debugging', 'SQL', 'Figma'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSkillFilter((prev) => (prev === s ? null : s))}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer",
                    skillFilter === s
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-500 hover:text-white"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Browse Skills</h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.slice(0, 16).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSkillFilter((prev) => (prev === s ? null : s))}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors",
                    skillFilter === s
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 hover:text-emerald-500"
                  )}
                >
                  {s}
                </button>
              ))}
              {allSkills.length === 0 && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">No skills yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {activeTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeTask}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-500 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Micro Request
                  </p>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white">{activeTask.title}</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
                    Requested by {activeTask.author} • {formatDate(activeTask.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeTask}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                {activeTask.description}
              </p>

              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div className="flex flex-wrap gap-2">
                  {activeTask.skillsRequired.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="px-3 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-xl uppercase tracking-widest">
                  Reward: {activeTask.reward}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => toggleSaved(activeTask.id)}
                  className="flex-1 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 font-black text-xs flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {savedTaskIds.includes(activeTask.id) ? <BookmarkCheck className="w-4 h-4 text-emerald-500" /> : <Bookmark className="w-4 h-4" />}
                  {savedTaskIds.includes(activeTask.id) ? 'Saved' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => copyTaskLink(activeTask.id)}
                  className="flex-1 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 font-black text-xs flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMessageOpen(true);
                    setMessageText(`Hey ${activeTask.author}, I can help with "${activeTask.title}".\n\n`);
                  }}
                  className="flex-1 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4" /> Message
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-3">
                <button
                  type="button"
                  onClick={async () => {
                    setIsWorking(true);
                    setWorkLabel('Claiming task...');
                    await new Promise(r => setTimeout(r, 900));
                    setIsWorking(false);
                    setToast('Task claimed (demo)');
                    setTimeout(() => setToast(null), 1400);
                  }}
                  className="flex-1 px-4 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-xs hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Claim Task
                </button>
                <button
                  type="button"
                  onClick={() => markCompleted(activeTask.id)}
                  className="flex-1 px-4 py-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-black text-xs hover:bg-emerald-500/15 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Completed
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToast('Reported (demo)');
                    setTimeout(() => setToast(null), 1400);
                  }}
                  className="flex-1 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-black text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Flag className="w-4 h-4" /> Report
                </button>
              </div>

              <AnimatePresence>
                {isMessageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                        Send a message
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsMessageOpen(false)}
                        className="text-xs font-black text-zinc-500 hover:underline"
                      >
                        Hide
                      </button>
                    </div>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none h-28 resize-none"
                      placeholder="Write your message..."
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setIsMessageOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-black text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={sendMessage}
                        className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isWorking && (
                <div className="mt-4 flex items-center gap-3 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  {workLabel}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {activeRightModal === 'leaderboard' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveRightModal(null)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-500 flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5" /> Helpers leaderboard
                  </p>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Top Helpers</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Based on completed tasks (local demo).</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveRightModal(null)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-2">
                {(() => {
                  let stats: Record<string, number> = {};
                  try {
                    stats = JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
                  } catch {
                    stats = {};
                  }
                  const rows = StorageService.getUsers()
                    .filter(u => u.role === 'student')
                    .map(u => ({ id: u.id, name: u.name, score: stats[u.id] || 0 }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 8);
                  return rows.map((r, idx) => (
                    <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black",
                          idx === 0 ? "bg-amber-500/15 text-amber-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                        )}>
                          {idx + 1}
                        </div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{r.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-500">{r.score}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">completed</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Request Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 lg:p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Create Request</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Title</label>
                  <input 
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g. Need help with React Hooks"
                    className="w-full mt-2 p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Description</label>
                  <textarea 
                    required
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Explain what you need help with..."
                    className="w-full mt-2 p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white h-32 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Reward</label>
                    <input 
                      type="text"
                      required
                      value={newTask.reward}
                      onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                      placeholder="e.g. Coffee, Shoutout"
                      className="w-full mt-2 p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 ml-1">Skills (comma separated)</label>
                    <input 
                      type="text"
                      required
                      value={newTask.skills}
                      onChange={(e) => setNewTask({ ...newTask, skills: e.target.value })}
                      placeholder="React, CSS"
                      className="w-full mt-2 p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
                >
                  Post Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
