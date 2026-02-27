import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, 
  Wand2, 
  Zap, 
  BarChart3, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Rocket,
  Star
} from 'lucide-react';

const features = [
  { icon: Users, title: 'Smart Teammate Matching', desc: 'Find the perfect partners based on skills, interests, and compatibility scores.' },
  { icon: Wand2, title: 'AI Team Builder', desc: 'Let our AI suggest the ideal team composition for your next big project.' },
  { icon: Zap, title: 'Micro Collaborations', desc: 'Get quick help or offer your skills for small tasks within the campus community.' },
  { icon: BarChart3, title: 'Skill Insights', desc: 'Track your growth and see which skills are trending in your field.' },
  { icon: Shield, title: 'Verified Mentors', desc: 'Connect with experienced seniors and professors for guidance.' },
  { icon: Globe, title: 'Campus Network', desc: 'Build a professional network that starts right here on campus.' },
];

const stats = [
  { label: 'Active Students', value: '5,000+', icon: Users, color: 'emerald' },
  { label: 'Projects Launched', value: '1,200+', icon: Rocket, color: 'blue' },
  { label: 'Events Hosted', value: '450+', icon: Star, color: 'purple' },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">CampusNet</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#features" className="hover:text-emerald-500 transition-colors">Features</a>
          <a href="#stats" className="hover:text-emerald-500 transition-colors">Stats</a>
          <Link to="/login" className="hover:text-emerald-500 transition-colors">Login</Link>
          <Link to="/register" className="px-5 py-2.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-32 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full">
              The Future of Campus Collaboration
            </span>
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-white">
            SIMPLY<br />
            <motion.span className="text-emerald-500" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
              CONNECT
            </motion.span>
          </h1>
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-zinc-600 dark:text-zinc-400 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Simply Connect connects students with the right teammates, mentors, and projects. 
            Powered by AI to help you succeed in your academic journey.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                Join the Network <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-zinc-50 dark:bg-zinc-900/50 py-32 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Ready to Connect?</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">Join thousands of students already using Simply Connect.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <f.icon className="w-6 h-6 text-emerald-500 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {stats.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all"
                >
                  <s.icon className="w-8 h-8 text-white" />
                </motion.div>
                <motion.p 
                  className="text-5xl font-black text-emerald-500 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                >
                  {s.value}
                </motion.p>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-widest text-xs">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-12">What Students Say</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl text-left">
              <p className="text-lg italic mb-6">"Simply Connect helped me find a designer for my final year project in just two days. The compatibility score was spot on!"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                <div>
                  <p className="font-bold">Emily Watson</p>
                  <p className="text-sm opacity-80">CS Student, Stanford</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl text-left">
              <p className="text-lg italic mb-6">"As a mentor, it's so much easier to track student progress and offer help where it's actually needed."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                <div>
                  <p className="font-bold">Dr. James Carter</p>
                  <p className="text-sm opacity-80">Professor, MIT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Simply Connect</span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
              The smart way to build teams, find collaborators, and launch projects on campus.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-emerald-500">Features</a></li>
              <li><a href="#" className="hover:text-emerald-500">Team Builder</a></li>
              <li><a href="#" className="hover:text-emerald-500">Insights</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="hover:text-emerald-500">About</a></li>
              <li><a href="#" className="hover:text-emerald-500">Privacy</a></li>
              <li><a href="#" className="hover:text-emerald-500">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            2026 Simply Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
