import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  TrendingUp, 
  Award, 
  Target, 
  Users, 
  Brain,
  Zap,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FeedbackService, FeedbackRating, FeedbackHistory } from '../services/feedbackService';
import { cn } from '../utils/helpers';

export const FeedbackFormPage: React.FC = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackRating | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackHistory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'history'>('overview');
  const [selectedType, setSelectedType] = useState<'ai-analysis' | 'peer-review' | 'self-assessment'>('ai-analysis');

  useEffect(() => {
    if (user) {
      generateFeedback('ai-analysis');
      setFeedbackHistory(FeedbackService.getFeedbackHistory(user.id));
    }
  }, [user]);

  const generateFeedback = async (type: 'ai-analysis' | 'peer-review' | 'self-assessment') => {
    if (!user) return;
    
    setIsGenerating(true);
    setSelectedType(type);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let newFeedback: FeedbackRating;
    
    switch (type) {
      case 'ai-analysis':
        newFeedback = FeedbackService.generateAIFeedback(user);
        break;
      case 'peer-review':
        newFeedback = FeedbackService.getPeerFeedback(user.id);
        break;
      case 'self-assessment':
        newFeedback = FeedbackService.calculateUserRating(user);
        break;
      default:
        newFeedback = FeedbackService.generateAIFeedback(user);
    }
    
    setFeedback(newFeedback);
    FeedbackService.saveFeedback(user.id, newFeedback, type);
    setFeedbackHistory(FeedbackService.getFeedbackHistory(user.id));
    setIsGenerating(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-blue-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 75) return 'bg-blue-500/10 border-blue-500/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Advanced': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Intermediate': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'Beginner': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  if (!feedback) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Generating Your AI Feedback</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Analyzing your skills, achievements, and contributions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-emerald-500" /> AI Feedback & Ratings
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Get personalized AI-powered feedback based on your skills, achievements, and contributions.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => generateFeedback(selectedType)}
            disabled={isGenerating}
            className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isGenerating && "animate-spin")} />
            Refresh
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Feedback Type Selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Feedback Type</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: 'ai-analysis', label: 'AI Analysis', desc: 'Advanced AI-powered insights', icon: Brain },
            { type: 'peer-review', label: 'Peer Review', desc: 'Feedback from community members', icon: Users },
            { type: 'self-assessment', label: 'Self Assessment', desc: 'Evaluate your own progress', icon: Target }
          ].map(({ type, label, desc, icon: Icon }) => (
            <button
              key={type}
              onClick={() => generateFeedback(type as any)}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all text-left",
                selectedType === type
                  ? "border-emerald-500 bg-emerald-500/5"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              <Icon className="w-6 h-6 text-emerald-500 mb-2" />
              <h4 className="font-bold text-zinc-900 dark:text-white">{label}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Performance Score</h2>
              <p className="text-emerald-50">Based on your skills, achievements, and contributions</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black">{feedback.overallScore}</div>
              <div className="text-emerald-100">out of 100</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={cn("px-4 py-2 rounded-xl text-sm font-bold", getLevelColor(feedback.level))}>
              {feedback.level} Level
            </div>
            <div className="flex-1 bg-white/20 rounded-full h-3">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-1000"
                style={{ width: `${feedback.overallScore}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'details', label: 'Detailed Analysis', icon: Star },
            { id: 'history', label: 'History', icon: Clock }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all",
                activeTab === id
                  ? "text-emerald-500 border-b-2 border-emerald-500"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Category Scores */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Performance by Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(feedback.categories).map(([category, score]) => (
                      <div key={category} className={cn("p-4 rounded-2xl border", getScoreBgColor(score))}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className={cn("text-sm font-bold", getScoreColor(score))}>{score}</span>
                        </div>
                        <div className="bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                          <div 
                            className={cn("h-2 rounded-full transition-all duration-1000", 
                              score >= 90 ? "bg-emerald-500" :
                              score >= 75 ? "bg-blue-500" :
                              score >= 60 ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      Your Strengths
                    </h3>
                    <div className="space-y-3">
                      {feedback.strengths.map((strength, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      Areas for Improvement
                    </h3>
                    <div className="space-y-3">
                      {feedback.improvements.map((improvement, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">{improvement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Achievements */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    Recent Achievements
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {feedback.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <Award className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-500" />
                    Personalized Recommendations
                  </h3>
                  <div className="space-y-3">
                    {feedback.recommendations.map((recommendation, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Milestone */}
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Next Milestone
                  </h3>
                  <p className="text-indigo-100">{feedback.nextMilestone}</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Feedback History</h3>
                {feedbackHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-500 dark:text-zinc-400">No feedback history available</p>
                  </div>
                ) : (
                  feedbackHistory.map((entry, idx) => (
                    <div key={entry.id} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-lg uppercase">
                            {entry.type}
                          </div>
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-zinc-900 dark:text-white">
                            {entry.rating.overallScore}
                          </span>
                          <div className={cn("px-2 py-1 rounded-lg text-xs font-bold", getLevelColor(entry.rating.level))}>
                            {entry.rating.level}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
