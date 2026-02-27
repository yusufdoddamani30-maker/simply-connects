import React, { useMemo, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Award, 
  ArrowUpRight,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { getSkillInsightSuggestion } from '../services/aiService';

const data = [
  { name: 'React', level: 85, color: '#10b981' },
  { name: 'Python', level: 65, color: '#3b82f6' },
  { name: 'UI Design', level: 90, color: '#f59e0b' },
  { name: 'Node.js', level: 45, color: '#8b5cf6' },
  { name: 'SQL', level: 70, color: '#ec4899' },
];

const trendingSkills = [
  { name: 'Generative AI', growth: '+124%', icon: Sparkles },
  { name: 'Cybersecurity', growth: '+85%', icon: Target },
  { name: 'Cloud Native', growth: '+62%', icon: Zap },
];

export const SkillInsightsPage: React.FC = () => {
  const { user } = useAuth();

  const [activeModal, setActiveModal] = useState<null | 'leaderboard' | 'aiSuggestion'>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [workStep, setWorkStep] = useState<'collect' | 'analyze' | 'done'>('collect');

  const [leaderboard, setLeaderboard] = useState<{ name: string; branch: string; score: number; skills: number; badges: number }[]>([]);
  const [aiResult, setAiResult] = useState<null | {
    recommendedSkill: string;
    why?: string;
    plan: string[];
    projects?: string[];
  }>(null);

  const computedLeaderboard = useMemo(() => {
    const all = StorageService.getUsers()
      .filter(u => u.role === 'student')
      .filter(u => (user?.branch ? u.branch === user.branch : true))
      .map(u => {
        const skillCount = u.skills?.length || 0;
        const badgeCount = u.badges?.length || 0;
        // Simple scoring to rank students consistently
        const score = skillCount * 12 + badgeCount * 25 + (u.year || 0) * 2;
        return { name: u.name, branch: u.branch, score, skills: skillCount, badges: badgeCount };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    return all;
  }, [user?.branch]);

  const openLeaderboard = async () => {
    setActiveModal('leaderboard');
    setAiResult(null);
    setIsWorking(true);
    setWorkStep('collect');
    setTimeout(() => setWorkStep('analyze'), 600);
    await new Promise(r => setTimeout(r, 1200));
    setLeaderboard(computedLeaderboard);
    setWorkStep('done');
    setTimeout(() => setIsWorking(false), 300);
  };

  const openAiSuggestion = async () => {
    setActiveModal('aiSuggestion');
    setLeaderboard([]);
    setIsWorking(true);
    setWorkStep('collect');
    setTimeout(() => setWorkStep('analyze'), 600);
    try {
      const result = await getSkillInsightSuggestion({
        skills: user?.skills || [],
        interests: user?.interests || [],
        branch: user?.branch,
      });
      if (result) setAiResult(result);
      setWorkStep('done');
    } finally {
      setTimeout(() => setIsWorking(false), 300);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsWorking(false);
    setAiResult(null);
    setLeaderboard([]);
    setWorkStep('collect');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Skill Insights</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Visualize your growth and stay ahead of campus trends.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your Skill Proficiency</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Updated today
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-zinc-900 text-white p-3 rounded-xl shadow-xl border border-zinc-800">
                            <p className="text-xs font-bold uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                            <p className="text-xl font-black text-emerald-500">{payload[0].value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="level" radius={[10, 10, 10, 10]} barSize={40}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-8 bg-emerald-500 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-2">Top Performer</h3>
                <p className="text-emerald-50 text-sm opacity-80 mb-6">You're in the top 5% of UI Designers in your branch.</p>
                  <button
                    type="button"
                    onClick={openLeaderboard}
                    className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-black text-xs hover:scale-105 transition-all"
                  >
                  View Leaderboard
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-all"></div>
            </div>

            <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black mb-2">AI Suggestion</h3>
                <p className="text-zinc-400 text-sm mb-6">Based on your interests, learning <span className="text-white font-bold">Three.js</span> could boost your profile.</p>
                  <button
                    type="button"
                    onClick={openAiSuggestion}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-xs hover:scale-105 transition-all"
                  >
                  Start Learning
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-110 transition-all"></div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Trending on Campus</h2>
            <div className="space-y-4">
              {trendingSkills.map((skill, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 group hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
                      <skill.icon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{skill.name}</p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{skill.growth} growth</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                </div>
              ))}
            </div>
          </section>

          <section className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Underrepresented Skills</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              These skills are in high demand for campus projects but have few experts. Learning these will make you highly sought after.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Rust', 'Solidity', 'Kubernetes', 'UX Writing', 'Data Ethics'].map(s => (
                <span key={s} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold rounded-lg border border-zinc-200 dark:border-zinc-700">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section className="p-8 bg-zinc-100 dark:bg-zinc-900/50 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-center">
            <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Set a Learning Goal</h3>
            <p className="text-[10px] text-zinc-500 mt-1">Track your progress towards a new skill.</p>
            <button 
              onClick={() => {
                // Handle adding a learning goal
                console.log('Adding learning goal');
              }}
              className="mt-4 text-xs font-black text-emerald-500 hover:underline uppercase tracking-widest"
            >
              Add Goal +
            </button>
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
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-500">
                  Skill insights
                </p>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  {activeModal === 'leaderboard' ? 'Top Performers' : 'AI Learning Suggestion'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isWorking ? (
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Working on it...</p>
                </div>
                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", workStep === 'collect' ? "bg-emerald-500 animate-pulse" : "bg-zinc-300 dark:bg-zinc-700")} />
                    Collecting your data
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", workStep === 'analyze' ? "bg-emerald-500 animate-pulse" : "bg-zinc-300 dark:bg-zinc-700")} />
                    Analyzing trends and ranking
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", workStep === 'done' ? "bg-emerald-500 animate-pulse" : "bg-zinc-300 dark:bg-zinc-700")} />
                    Preparing results
                  </div>
                </div>
                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "15%" }}
                    animate={{ width: workStep === 'collect' ? "35%" : workStep === 'analyze' ? "70%" : "95%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="p-6">
                {activeModal === 'leaderboard' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Ranked using a simple score based on skills + badges (filtered to your branch when available).
                    </p>
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                      {leaderboard.map((row, idx) => (
                        <div key={row.name} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black",
                              idx === 0 ? "bg-amber-500/15 text-amber-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                            )}>
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">{row.name}</p>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                {row.branch} • {row.skills} skills • {row.badges} badges
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-emerald-500">{row.score}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">score</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiResult ? (
                      <>
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                            Recommended skill
                          </p>
                          <p className="text-xl font-black text-zinc-900 dark:text-white">{aiResult.recommendedSkill}</p>
                          {aiResult.why && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{aiResult.why}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">4-step plan</p>
                          <ol className="space-y-2">
                            {aiResult.plan.map((step, i) => (
                              <li key={i} className="text-sm text-zinc-700 dark:text-zinc-200 flex gap-3">
                                <span className="w-6 h-6 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black text-zinc-500">
                                  {i + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        {aiResult.projects && aiResult.projects.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Project ideas</p>
                            <div className="flex flex-wrap gap-2">
                              {aiResult.projects.map((p) => (
                                <span key={p} className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-200">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">No AI result available right now.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
