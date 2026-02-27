import React, { useMemo, useState } from 'react';
import { Bell, Search, Menu, X, Plus, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/helpers';

export const Navbar: React.FC = () => {
  const { user, onboard, logout } = useAuth();
  const navigate = useNavigate();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [activeProfileDialog, setActiveProfileDialog] = useState<null | 'editProfile' | 'skills'>(null);

  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [editYear, setEditYear] = useState<number>(2);

  const [skillInput, setSkillInput] = useState('');
  const currentSkills = useMemo(() => user?.skills || [], [user?.skills]);

  const openEditProfile = () => {
    setIsProfileMenuOpen(false);
    setIsNotificationsOpen(false);
    setEditName(user?.name || '');
    setEditBio(user?.bio || '');
    setEditBranch(user?.branch || '');
    setEditYear(user?.year || 2);
    setActiveProfileDialog('editProfile');
  };

  const openSkills = () => {
    setIsProfileMenuOpen(false);
    setIsNotificationsOpen(false);
    setSkillInput('');
    setActiveProfileDialog('skills');
  };

  const closeDialog = () => setActiveProfileDialog(null);

  const addSkillsFromInput = () => {
    const additions = skillInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (additions.length === 0) return;
    const merged = Array.from(new Set([...(user?.skills || []), ...additions]));
    onboard({ skills: merged });
    setSkillInput('');
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30 transition-colors">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => {
              // Handle mobile menu toggle
              console.log('Mobile menu toggled');
            }}
            className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search for projects, students, or skills..." 
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsProfileMenuOpen(false);
            }}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full relative transition-all"
            aria-label="Open notifications"
            aria-expanded={isNotificationsOpen}
            aria-haspopup="true"
            type="button"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
          </button>
          <div className="relative flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 px-2 py-1 transition-colors"
              aria-haspopup="true"
              aria-expanded={isProfileMenuOpen}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{user?.role}</p>
              </div>
              <img 
                src={user?.avatar} 
                alt={user?.name || 'Your profile'} 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
            </button>

            {isProfileMenuOpen && (
              <div
                className="absolute right-0 top-11 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-40"
                role="menu"
              >
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => {
                    navigate('/profile');
                    setIsProfileMenuOpen(false);
                  }}
                  role="menuitem"
                >
                  My Profile
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  onClick={openEditProfile}
                  role="menuitem"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  onClick={openSkills}
                  role="menuitem"
                >
                  Add / Remove Skills
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  onClick={() => {
                    logout();
                    navigate('/');
                    setIsProfileMenuOpen(false);
                  }}
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {isNotificationsOpen && (
            <div
              className="absolute right-24 top-12 w-80 max-w-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-3 z-40"
              role="dialog"
              aria-label="Notifications"
            >
              <div className="px-4 pb-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Notifications</p>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-500">
                  New
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors"
                >
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    New teammate suggestion
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                    We found students with similar skills and interests in your branch. Tap to review.
                  </p>
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors"
                >
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    Upcoming campus event
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                    Hackathon this weekend. Don&apos;t forget to register with your team.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {activeProfileDialog && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={activeProfileDialog === 'editProfile' ? 'Edit profile' : 'Manage skills'}
        >
          <div
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            onClick={closeDialog}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute left-1/2 top-20 -translate-x-1/2 w-[92vw] max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-500">
                  My profile
                </p>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  {activeProfileDialog === 'editProfile' ? 'Edit Profile' : 'Manage Skills'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeProfileDialog === 'editProfile' ? (
              <div className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="space-y-1">
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Name</span>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Branch</span>
                    <input
                      value={editBranch}
                      onChange={(e) => setEditBranch(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="E.g. Computer Science"
                    />
                  </label>
                </div>
                <label className="space-y-1 block">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Bio</span>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                    placeholder="Write anything about yourself..."
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Year</span>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={editYear}
                    onChange={(e) => setEditYear(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </label>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onboard({ name: editName, bio: editBio, branch: editBranch, year: editYear });
                      closeDialog();
                    }}
                    className="px-4 py-2 rounded-xl text-sm font-black bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Type skills separated by commas, then click Add. You can also remove existing skills.
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkillsFromInput();
                        }
                      }}
                      className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="E.g. React, Node.js, SQL"
                    />
                    <button
                      type="button"
                      onClick={addSkillsFromInput}
                      className="px-4 py-3 rounded-2xl bg-emerald-500 text-white font-black text-sm hover:bg-emerald-600 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        const next = (user?.skills || []).filter(s => s !== skill);
                        onboard({ skills: next });
                      }}
                      className={cn(
                        "px-3 py-2 rounded-xl border text-xs font-black transition-colors flex items-center gap-2",
                        "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400"
                      )}
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3.5 h-3.5" />
                      {skill}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </header>
  );
};
