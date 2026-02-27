import React, { useMemo, useState } from 'react';
import { 
  User, 
  Users,
  MapPin, 
  Link as LinkIcon, 
  Twitter, 
  Github, 
  Linkedin,
  Edit3,
  Plus,
  Trophy,
  Zap,
  CheckCircle2,
  ExternalLink,
  Heart,
  Share2,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { MOCK_PROJECTS } from '../data/mockData';
import { cn } from '../utils/helpers';
import { StorageService } from '../services/storageService';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, onboard } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [likedProjects, setLikedProjects] = useState<string[]>(() => StorageService.getLikedProjects());
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'activity'>('projects');

  const [toast, setToast] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<null | 'badges' | 'project'>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [editYear, setEditYear] = useState<number>(2);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const profileUrl = useMemo(() => {
    const id = user?.id;
    if (!id) return window.location.href;
    return `${window.location.origin}/profile/${id}`;
  }, [user?.id]);

  const startEditing = () => {
    setEditName(user?.name || '');
    setEditBio(user?.bio || '');
    setEditBranch(user?.branch || '');
    setEditYear(user?.year || 2);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewSkill('');
    setNewInterest('');
  };

  const saveProfile = () => {
    onboard({ name: editName, bio: editBio, branch: editBranch, year: editYear });
    setIsEditing(false);
    setToast('Profile saved');
    setTimeout(() => setToast(null), 1500);
  };

  const addSkill = () => {
    const cleaned = newSkill.trim();
    if (!cleaned) return;
    const merged = Array.from(new Set([...(user?.skills || []), cleaned]));
    onboard({ skills: merged });
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    const next = (user?.skills || []).filter(s => s !== skill);
    onboard({ skills: next });
  };

  const addInterest = () => {
    const cleaned = newInterest.trim();
    if (!cleaned) return;
    const merged = Array.from(new Set([...(user?.interests || []), cleaned]));
    onboard({ interests: merged });
    setNewInterest('');
  };

  const removeInterest = (interest: string) => {
    const next = (user?.interests || []).filter(i => i !== interest);
    onboard({ interests: next });
  };

  const openBadges = () => setActiveModal('badges');
  const openProject = (id: string) => {
    setActiveProjectId(id);
    setActiveModal('project');
  };
  const closeModal = () => {
    setActiveModal(null);
    setActiveProjectId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Animated background elements */}
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 right-8 w-12 h-12 bg-white/10 rounded-full"
          />
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => (isEditing ? cancelEditing() : startEditing())}
            className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all"
          >
            <Edit3 className="w-5 h-5" />
          </motion.button>
        </div>
        
        <div className="px-8 -mt-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
              <motion.img 
                src={user?.avatar} 
                alt={user?.name} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] object-cover border-8 border-zinc-50 dark:border-zinc-950 shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div 
                className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-950"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <CheckCircle2 className="w-4 h-4" />
              </motion.div>
            </div>
            <div className="text-center md:text-left pb-2">
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">{user?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-2 text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user?.branch}</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Year {user?.year}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pb-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (isEditing ? cancelEditing() : startEditing())}
              className={cn(
                "px-6 py-3 border rounded-2xl font-bold text-sm transition-all flex items-center gap-2",
                isEditing
                  ? "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-white"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
            >
              <Edit3 className="w-4 h-4" /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(profileUrl);
                  setToast('Profile link copied');
                  setTimeout(() => setToast(null), 1500);
                } catch {
                  setToast('Could not copy link');
                  setTimeout(() => setToast(null), 1500);
                }
              }}
              className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share Profile
            </motion.button>
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveProfile}
                className="px-6 py-3 bg-white/90 dark:bg-zinc-900 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-sm hover:bg-white dark:hover:bg-zinc-800 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="px-4 py-2 rounded-2xl bg-zinc-900 text-white text-xs font-bold shadow-xl">
            {toast}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* About */}
          <section className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">About</h2>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Name</span>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Branch</span>
                    <input
                      value={editBranch}
                      onChange={(e) => setEditBranch(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </label>
                </div>
                <label className="space-y-1 block">
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Bio</span>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                    placeholder="Write what you want..."
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Year</span>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={editYear}
                    onChange={(e) => setEditYear(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-4 py-2 rounded-xl text-xs font-black text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveProfile}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {user?.bio || "No bio added yet. Tell the community about yourself!"}
              </p>
            )}
            <div className="mt-6 flex gap-4">
              {[
                { icon: Github, label: 'GitHub' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Twitter, label: 'Twitter' },
                { icon: LinkIcon, label: 'Website' }
              ].map((social, i) => (
                <motion.a
                  key={social.label}
                  href={isEditing ? undefined : '#'}
                  onClick={(e) => {
                    if (isEditing) {
                      e.preventDefault();
                      setToast('Add social links in your bio for now');
                      setTimeout(() => setToast(null), 1600);
                    }
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-emerald-500 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </section>

          {/* Stats Summary */}
          <section className="p-8 bg-zinc-900 rounded-[2.5rem] text-white">
            <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Stats Summary
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '12', label: 'Projects', icon: Trophy },
                { value: '48', label: 'Collabs', icon: Users },
                { value: '850', label: 'Skill Pts', icon: Zap },
                { value: '15', label: 'Badges', icon: Award }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 mx-auto mb-2 bg-emerald-500/20 rounded-lg flex items-center justify-center"
                  >
                    <stat.icon className="w-4 h-4 text-emerald-400" />
                  </motion.div>
                  <motion.p 
                    className="text-2xl font-black"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Badges */}
          <section className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Badges</h2>
              <button
                type="button"
                onClick={openBadges}
                className="text-xs font-bold text-emerald-500 hover:underline"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {user?.badges.map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={openBadges}
                >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center group hover:bg-emerald-500 transition-all">
                    <Trophy className="w-6 h-6 text-emerald-500 group-hover:text-white" />
                  </div>
                  <span className="text-[8px] font-black text-zinc-500 uppercase text-center leading-tight">{badge}</span>
                </motion.div>
              ))}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700">
                  <Plus className="w-5 h-5 text-zinc-400" />
                </div>
                <span className="text-[8px] font-black text-zinc-400 uppercase text-center leading-tight">New Badge</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skills & Interests */}
          <section className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user?.skills.map(skill => (
                    <motion.span 
                      key={skill} 
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-colors",
                        isEditing
                          ? "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      )}
                      onClick={() => {
                        if (isEditing) removeSkill(skill);
                      }}
                      title={isEditing ? 'Click to remove' : undefined}
                    >
                      {skill}
                    </motion.span>
                  ))}
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-white text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Type a skill"
                        aria-label="New skill"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        startEditing();
                        setToast('Editing enabled — add skills below');
                        setTimeout(() => setToast(null), 1500);
                      }}
                      className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-bold rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                    >
                      Add Skill +
                    </button>
                  )}
                </div>
                {isEditing && (
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-3">
                    Tip: click a skill to remove it.
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {user?.interests.map(interest => (
                    <motion.span 
                      key={interest} 
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors border",
                        isEditing
                          ? "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-transparent"
                      )}
                      onClick={() => {
                        if (isEditing) removeInterest(interest);
                      }}
                      title={isEditing ? 'Click to remove' : undefined}
                    >
                      {interest}
                    </motion.span>
                  ))}
                  {isEditing && (
                    <div className="flex items-center gap-2">
                      <input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addInterest();
                          }
                        }}
                        className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-white text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Add an interest"
                        aria-label="New interest"
                      />
                      <button
                        type="button"
                        onClick={addInterest}
                        className="px-4 py-2 bg-emerald-500 text-white text-xs font-black rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-3">
                    Tip: click an interest to remove it.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Projects</h2>
              <button
                type="button"
                onClick={() => navigate('/team-builder')}
                className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> New Project
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {MOCK_PROJECTS.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 group relative"
                >
                  <button 
                    onClick={() => {
                      StorageService.toggleLikeProject(project.id);
                      setLikedProjects(StorageService.getLikedProjects());
                    }}
                    className={cn(
                      "absolute top-4 right-4 p-2 rounded-xl transition-all",
                      likedProjects.includes(project.id)
                        ? "bg-red-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", likedProjects.includes(project.id) && "fill-current")} />
                  </button>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                      <Zap className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                    </div>
                    <span className={cn(
                      "px-2 py-1 text-[8px] font-black rounded-lg uppercase tracking-widest",
                      project.status === 'ongoing' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">{project.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-2.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-black rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                    <span
                      onClick={() => openProject(project.id)}
                      className="flex items-center justify-center gap-2 w-full"
                    >
                      View Details <ExternalLink className="w-3 h-3" />
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={closeModal} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute left-1/2 top-20 -translate-x-1/2 w-[92vw] max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-500">Profile</p>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  {activeModal === 'badges' ? 'Badges' : 'Project Details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="px-3 py-2 rounded-xl text-xs font-black text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Close
              </button>
            </div>

            <div className="p-6">
              {activeModal === 'badges' ? (
                <div className="flex flex-wrap gap-2">
                  {(user?.badges || []).map((b) => (
                    <span
                      key={b}
                      className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-600 dark:text-emerald-400"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              ) : (
                (() => {
                  const project = MOCK_PROJECTS.find(p => p.id === activeProjectId);
                  if (!project) {
                    return <p className="text-sm text-zinc-600 dark:text-zinc-400">Project not found.</p>;
                  }
                  return (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xl font-black text-zinc-900 dark:text-white">{project.title}</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{project.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(t => (
                          <span key={t} className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-200">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={closeModal}
                          className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
