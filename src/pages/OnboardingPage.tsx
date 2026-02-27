import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  BookOpen, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Skills & Interests', icon: BookOpen },
  { id: 3, title: 'Preferences', icon: Target },
];

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    branch: '',
    year: 1,
    skills: [] as string[],
    interests: [] as string[],
    preferences: {
      remoteOnly: false,
      mentorSeeking: true,
      openToProjects: true
    }
  });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  
  const { onboard } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onboard(formData);
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const addTag = (type: 'skills' | 'interests', value: string) => {
    if (!value.trim()) return;
    if (!formData[type].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
      }));
    }
    if (type === 'skills') setSkillInput('');
    else setInterestInput('');
  };

  const removeTag = (type: 'skills' | 'interests', tag: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(t => t !== tag)
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 transition-colors">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  currentStep >= step.id 
                    ? "bg-emerald-500 border-emerald-500 text-white" 
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                )}>
                  {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  currentStep >= step.id ? "text-emerald-500" : "text-zinc-400"
                )}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 lg:p-12"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Tell us about yourself</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Bio</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Write a short bio about your passions and goals..."
                      className="w-full mt-2 p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white h-32 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Branch / Major</label>
                      <input 
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                        placeholder="Computer Science"
                        className="w-full mt-2 p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Year of Study</label>
                      <select 
                        value={formData.year}
                        onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        className="w-full mt-2 p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      >
                        {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">What are your skills?</h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Skills</label>
                    <div className="flex gap-2 mt-2">
                      <input 
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag('skills', skillInput)}
                        placeholder="React, Python, Figma..."
                        className="flex-1 p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      />
                      <button 
                        onClick={() => addTag('skills', skillInput)}
                        className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-full flex items-center gap-2">
                          {skill}
                          <button onClick={() => removeTag('skills', skill)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Interests</label>
                    <div className="flex gap-2 mt-2">
                      <input 
                        type="text"
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag('interests', interestInput)}
                        placeholder="AI, Sustainability, Gaming..."
                        className="flex-1 p-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      />
                      <button 
                        onClick={() => addTag('interests', interestInput)}
                        className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.interests.map(interest => (
                        <span key={interest} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium rounded-full flex items-center gap-2">
                          {interest}
                          <button onClick={() => removeTag('interests', interest)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Final Preferences</h2>
                <div className="space-y-4">
                  {[
                    { id: 'remoteOnly', label: 'Open to remote collaboration', desc: 'Willing to work on projects virtually.' },
                    { id: 'mentorSeeking', label: 'Looking for a mentor', desc: 'Interested in guidance from seniors or professors.' },
                    { id: 'openToProjects', label: 'Open to new project invites', desc: 'Allow others to invite you to their teams.' },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{pref.label}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{pref.desc}</p>
                      </div>
                      <button 
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, [pref.id]: !prev.preferences[pref.id as keyof typeof prev.preferences] }
                        }))}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          formData.preferences[pref.id as keyof typeof formData.preferences] ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          formData.preferences[pref.id as keyof typeof formData.preferences] ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-white disabled:opacity-0 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 hover:scale-105 transition-all flex items-center gap-2"
            >
              {currentStep === STEPS.length ? 'Complete Profile' : 'Continue'} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
