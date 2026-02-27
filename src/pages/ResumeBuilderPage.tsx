import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Eye, 
  Layout,
  CheckCircle2,
  Zap,
  Briefcase,
  GraduationCap,
  Loader2,
  Sparkles,
  Wand2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';
import { optimizeResume, recommendSkills } from '../services/aiService';
import { StorageService } from '../services/storageService';

export const ResumeBuilderPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{ score: number; suggestions: string[] } | null>(null);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [generationStep, setGenerationStep] = useState<'collecting' | 'optimizing' | 'designing' | 'done'>('collecting');
  const [skillRecoLoading, setSkillRecoLoading] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [skillRecoReasoning, setSkillRecoReasoning] = useState<string | null>(null);
  const [experienceNotes, setExperienceNotes] = useState<string>('');
  
  // Load resume data from localStorage on mount
  const [resumeData, setResumeData] = useState(() => {
    const savedData = localStorage.getItem(`resume_${user?.id || 'default'}`);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      summary: 'Passionate student developer looking for opportunities to build impactful solutions.',
      experience: [
        { company: 'Tech Solutions Inc.', role: 'Intern', period: 'Summer 2025', desc: 'Assisted in building a React-based dashboard.' }
      ],
      projects: [
        { name: 'Simply Connect', role: 'Lead Developer', desc: 'Built a student networking platform using React and AI.' }
      ]
    };
  });

  // Save resume data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`resume_${user.id}`, JSON.stringify(resumeData));
    }
  }, [resumeData, user]);

  const handleRecommendSkills = async () => {
    if (skillRecoLoading) return;
    setSkillRecoLoading(true);
    try {
      const baseSkills = user?.skills || [];
      const result = await recommendSkills({
        summary: resumeData.summary,
        experience: resumeData.experience,
        projects: resumeData.projects,
        existingSkills: baseSkills,
      });
      if (result?.suggestedSkills) {
        setSuggestedSkills(result.suggestedSkills);
        setSkillRecoReasoning(result.reasoning || null);
      }
    } catch (error) {
      console.error('Error recommending skills:', error);
    } finally {
      setSkillRecoLoading(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizeResume({ ...resumeData, skills: user?.skills });
      if (result) {
        setOptimizationResult(result);
        // Save optimization result to localStorage
        StorageService.saveUserPreferences({ notifications: true }); // Example of using storage
      }
    } catch (error) {
      console.error('Error optimizing resume:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleMakeResume = async () => {
    if (isGeneratingResume) return;
    setIsGeneratingResume(true);
    setGenerationStep('collecting');

    // Smooth staged animation steps
    setTimeout(() => setGenerationStep('optimizing'), 700);
    setTimeout(() => setGenerationStep('designing'), 1400);

    try {
      await handleOptimize();
      setActiveTab('preview');
      setTimeout(() => setGenerationStep('done'), 2000);
    } finally {
      setTimeout(() => {
        setIsGeneratingResume(false);
        setGenerationStep('collecting');
      }, 2600);
    }
  };

  const handleDownload = () => {
    // Create a simple text version of the resume for download
    const resumeText = `
${user?.name}
${user?.email} | ${user?.branch} | Year ${user?.year}

SUMMARY
${resumeData.summary}

EXPERIENCE
${resumeData.experience.map(exp => `${exp.role} at ${exp.company} (${exp.period})\n${exp.desc}`).join('\n\n')}

PROJECTS
${resumeData.projects.map(proj => `${proj.name} - ${proj.role}\n${proj.desc}`).join('\n\n')}

SKILLS
${user?.skills.join(', ')}
    `;
    
    // Create and download the file
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user?.name || 'resume'}_resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-500" /> AI Resume Builder
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create a professional resume optimized for campus placements.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex">
            <button 
              onClick={() => setActiveTab('edit')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                activeTab === 'edit' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <Layout className="w-4 h-4" /> Edit
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                activeTab === 'preview' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleMakeResume}
              disabled={isGeneratingResume}
              className="px-5 py-3 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 disabled:opacity-70 transition-all flex items-center gap-2 shadow-lg"
            >
              {isGeneratingResume ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {isGeneratingResume ? 'Crafting your resume...' : 'Make My Resume'}
            </button>
            <button 
              onClick={handleDownload}
              className="px-5 py-3 bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" /> Download Resume
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Side */}
        <div className={cn("space-y-6", activeTab === 'preview' && "hidden lg:block")}>
          <section className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Professional Summary</h2>
            <textarea 
              value={resumeData.summary}
              onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white h-32 resize-none text-sm"
              placeholder="Write a brief summary of your professional background..."
            />
          </section>

          <section className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                Past Experience Overview
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Give a short, free-form description of your internships, part-time work, and key campus activities. We use this to fine-tune skill suggestions.
            </p>
            <textarea
              value={experienceNotes}
              onChange={(e) => setExperienceNotes(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white h-28 resize-none text-sm"
              placeholder="E.g. Worked as a frontend intern building dashboards in React, volunteered as a college fest coordinator, mentored juniors in DSA..."
            />
          </section>

          <section className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Experience</h2>
              <button 
                onClick={() => setResumeData({
                  ...resumeData,
                  experience: [...resumeData.experience, { company: '', role: '', period: '', desc: '' }]
                })}
                className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 relative group">
                  <button 
                    onClick={() => {
                      const newExp = resumeData.experience.filter((_, index) => index !== i);
                      setResumeData({ ...resumeData, experience: newExp });
                    }}
                    className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input 
                      type="text" 
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[i].company = e.target.value;
                        setResumeData({ ...resumeData, experience: newExp });
                      }}
                      className="bg-transparent font-bold text-sm dark:text-white border-b border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 outline-none pb-1"
                      placeholder="Company"
                    />
                    <input 
                      type="text" 
                      value={exp.period}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[i].period = e.target.value;
                        setResumeData({ ...resumeData, experience: newExp });
                      }}
                      className="bg-transparent text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 outline-none pb-1 text-right"
                      placeholder="Period"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={exp.role}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[i].role = e.target.value;
                      setResumeData({ ...resumeData, experience: newExp });
                    }}
                    className="w-full bg-transparent text-xs font-bold text-emerald-500 mb-2 outline-none"
                    placeholder="Role"
                  />
                  <textarea 
                    value={exp.desc}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[i].desc = e.target.value;
                      setResumeData({ ...resumeData, experience: newExp });
                    }}
                    className="w-full bg-transparent text-xs text-zinc-500 resize-none outline-none"
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Projects</h2>
              <button 
                onClick={() => setResumeData({
                  ...resumeData,
                  projects: [...resumeData.projects, { name: '', role: '', desc: '' }]
                })}
                className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {resumeData.projects.map((proj, i) => (
                <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 relative group">
                  <button 
                    onClick={() => {
                      const newProj = resumeData.projects.filter((_, index) => index !== i);
                      setResumeData({ ...resumeData, projects: newProj });
                    }}
                    className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <input 
                    type="text" 
                    value={proj.name}
                    onChange={(e) => {
                      const newProj = [...resumeData.projects];
                      newProj[i].name = e.target.value;
                      setResumeData({ ...resumeData, projects: newProj });
                    }}
                    className="w-full bg-transparent font-bold text-sm dark:text-white border-b border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 outline-none pb-1 mb-4"
                    placeholder="Project Name"
                  />
                  <input 
                    type="text" 
                    value={proj.role}
                    onChange={(e) => {
                      const newProj = [...resumeData.projects];
                      newProj[i].role = e.target.value;
                      setResumeData({ ...resumeData, projects: newProj });
                    }}
                    className="w-full bg-transparent text-xs font-bold text-emerald-500 mb-2 outline-none"
                    placeholder="Your Role"
                  />
                  <textarea 
                    value={proj.desc}
                    onChange={(e) => {
                      const newProj = [...resumeData.projects];
                      newProj[i].desc = e.target.value;
                      setResumeData({ ...resumeData, projects: newProj });
                    }}
                    className="w-full bg-transparent text-xs text-zinc-500 resize-none outline-none"
                    placeholder="Project Description"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400">AI Optimization</h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-500 uppercase font-black tracking-widest">Powered by Gemini</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 disabled:opacity-70 transition-all flex items-center gap-2"
                >
                  {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {isOptimizing ? 'Analyzing...' : 'Optimize Resume'}
                </button>
                <button
                  type="button"
                  onClick={handleRecommendSkills}
                  disabled={skillRecoLoading}
                  className="px-4 py-2 bg-white/90 dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-white disabled:opacity-70 transition-all flex items-center gap-2 border border-emerald-200/60 dark:border-emerald-500/30"
                >
                  {skillRecoLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  {skillRecoLoading ? 'Finding skills...' : 'Suggest Skills'}
                </button>
              </div>
            </div>

            {optimizationResult ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black text-emerald-500">{optimizationResult.score}%</div>
                  <div className="flex-1 h-2 bg-emerald-500/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${optimizationResult.score}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
                <ul className="space-y-2">
                  {optimizationResult.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-500 leading-relaxed">
                Click "Optimize Resume" to let our AI analyze your resume and provide specific suggestions for improvement.
              </p>
            )}

            {suggestedSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-emerald-500/20 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.18em]">
                    AI Skill Recommendations
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill) => {
                    const alreadyHas = user?.skills?.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        disabled={alreadyHas}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all",
                          alreadyHas
                            ? "bg-emerald-50/40 dark:bg-emerald-500/10 border-emerald-300/40 text-emerald-500 cursor-not-allowed"
                            : "bg-white dark:bg-zinc-900 border-emerald-200/50 text-emerald-600 hover:bg-emerald-50/80 dark:hover:bg-emerald-500/10"
                        )}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {skill}
                      </button>
                    );
                  })}
                </div>
                {skillRecoReasoning && (
                  <p className="text-[10px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
                    {skillRecoReasoning}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Preview Side */}
        <div className={cn("relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden", activeTab === 'edit' && "hidden lg:block")}>
          <div className="h-full p-12 md:p-16 space-y-10">
            {/* Resume Header */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">{user?.name}</h2>
              <div className="flex justify-center gap-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                <span>{user?.email}</span>
                <span>•</span>
                <span>{user?.branch}</span>
                <span>•</span>
                <span>Year {user?.year}</span>
              </div>
              <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
            </div>

            {/* Resume Summary */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-800 pb-2">Professional Summary</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                "{resumeData.summary}"
              </p>
            </div>

            {/* Resume Skills */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-800 pb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills.map(s => (
                  <span key={s} className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Experience */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-800 pb-2">Experience</h3>
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-500" /> {exp.company}
                      </h4>
                      <p className="text-xs font-bold text-emerald-500 mt-0.5">{exp.role}</p>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{exp.period}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-6 border-l-2 border-zinc-100 dark:border-zinc-800">
                    {exp.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Resume Projects */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-800 pb-2">Key Projects</h3>
              {resumeData.projects.map((proj, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-emerald-500" /> {proj.name}
                      </h4>
                      <p className="text-xs font-bold text-emerald-500 mt-0.5">{proj.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-6 border-l-2 border-zinc-100 dark:border-zinc-800">
                    {proj.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {isGeneratingResume && (
            <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md mx-auto bg-zinc-900/90 border border-emerald-500/40 rounded-3xl p-6 space-y-4 text-white shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.22em]">
                      AI is crafting
                    </p>
                    <h3 className="text-sm font-black">Building your campus-ready resume</h3>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      generationStep === 'collecting' ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                    )} />
                    <span>Collecting your details and experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      generationStep === 'optimizing' ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                    )} />
                    <span>Optimizing content for ATS and recruiters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      generationStep === 'designing' ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                    )} />
                    <span>Polishing layout and visual balance</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: "10%" }}
                    animate={{ width: generationStep === 'collecting' ? "30%" : generationStep === 'optimizing' ? "65%" : "100%" }}
                    transition={{ ease: "easeInOut", duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500"
                  />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
