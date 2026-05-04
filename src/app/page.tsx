'use client';

import { motion } from 'framer-motion';
import { Brain, Shield, Zap, ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';
import LoginButton from '@/components/LoginButton';

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] -z-10" />

      <div className="max-w-5xl w-full">
        {/* Header / Nav */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Brain className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tighter">SOLET</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-white-60">
            <a href="#" className="hover:text-white transition-colors">Methodology</a>
            <a href="#" className="hover:text-white transition-colors">Ethics</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>
          <div className="flex items-center gap-4">
            <LoginButton />
            <Link href="/lab">
              <button className="btn-primary text-sm hidden md:block">Launch Engine</button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              Reason Beyond <br />
              <span className="primary-gradient-text">Intuition.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white-60 max-w-2xl mx-auto mb-10 leading-relaxed">
              SOLET is an advanced logical engine designed to navigate the complexity of ethical dilemmas and strategic decision-making through structured AI reasoning.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/lab">
                <button className="btn-primary text-lg px-8 py-4 flex items-center gap-2 justify-center w-full md:w-auto">
                  Get Started <ArrowRight size={20} />
                </button>
              </Link>
              <button className="glass-card px-8 py-4 text-lg font-semibold flex items-center gap-2 justify-center">
                View Logical Frameworks
              </button>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Compass className="text-purple-400" />,
              title: "Ethical Alignment",
              desc: "Analyzes dilemmas through Kantian, Utilitarian, and Virtue Ethics frameworks."
            },
            {
              icon: <Zap className="text-cyan-400" />,
              title: "Instant Processing",
              desc: "Simultaneous multi-perspective analysis in milliseconds."
            },
            {
              icon: <Shield className="text-emerald-400" />,
              title: "Objective Logic",
              desc: "Strips emotional bias to provide purely rational recommendation matrices."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
            >
              <div className="w-12 h-12 rounded-lg bg-white-5 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white-50 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </section>
      </div>

      {/* Footer Decoration */}
      <div className="mt-32 text-white-20 text-xs tracking-[0.4em] uppercase">
        Powered by Advanced Agentic Logic
      </div>
      
      <style jsx>{`
        main {
          background: radial-gradient(circle at 50% -20%, #111 0%, #050505 100%);
        }
        
        /* Utility styles that aren't in globals.css yet */
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .text-center { text-align: center; }
        .max-w-5xl { max-width: 64rem; }
        .w-full { width: 100%; }
        .min-h-screen { min-height: 100vh; }
        .mb-16 { margin-bottom: 4rem; }
        .mb-24 { margin-bottom: 6rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-10 { margin-bottom: 2.5rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .p-8 { padding: 2rem; }
        .md\\:p-24 { padding: 6rem; }
        .hidden { display: none; }
        @media (min-width: 768px) {
          .md\\:flex { display: flex; }
          .md\\:flex-row { flex-direction: row; }
          .md\\:text-8xl { font-size: 6rem; }
          .md\\:text-2xl { font-size: 1.5rem; }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        .text-6xl { font-size: 3.75rem; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-sm { font-size: 0.875rem; }
        .font-black { font-weight: 900; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .leading-tight { line-height: 1.25; }
        .leading-relaxed { line-height: 1.625; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .text-white\\/60 { color: rgba(255, 255, 255, 0.6); }
        .text-white\\/50 { color: rgba(255, 255, 255, 0.5); }
        .text-white\\/20 { color: rgba(255, 255, 255, 0.2); }
        .grid { display: grid; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .top-0 { top: 0; }
        .bottom-0 { bottom: 0; }
        .left-1\\/4 { left: 25%; }
        .right-1\\/4 { right: 25%; }
        .w-96 { width: 24rem; }
        .h-96 { height: 24rem; }
        .rounded-full { border-radius: 9999px; }
        .blur-\\[128px\\] { filter: blur(128px); }
        .-z-10 { z-index: -10; }
        .bg-purple-600\\/20 { background-color: rgba(147, 51, 234, 0.2); }
        .bg-cyan-600\\/20 { background-color: rgba(8, 145, 178, 0.2); }
        .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05); }
        .text-purple-400 { color: #c084fc; }
        .text-cyan-400 { color: #22d3ee; }
        .text-emerald-400 { color: #34d399; }
      `}</style>
    </main>
  );
}
