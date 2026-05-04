'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Shield, Scale, Activity, CheckCircle2, ChevronRight, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import LoginButton from '@/components/LoginButton';
import { getSupabaseClient } from '@/lib/supabase';

export default function ReasoningLab() {
  const [dilemma, setDilemma] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<null | any>(null);

  const steps = [
    "Deconstructing semantic intent...",
    "Querying Logical Engine...",
    "Synthesizing weighted matrix...",
    "Finalizing recommendation..."
  ];

  const handleReason = async () => {
    if (!dilemma) return;
    setIsProcessing(true);
    setStep(0);
    setResult(null);

    const supabase = getSupabaseClient();

    // Animation progress
    const stepInterval = setInterval(() => {
      setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1000);

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dilemma, user_id: session?.user?.id }),
      });

      const data = await response.json();
      
      if (data.error || !data.recommendation) {
        throw new Error(data.error || "Invalid response");
      }

      // Ensure the animation has at least shown a few steps
      setTimeout(() => {
        clearInterval(stepInterval);
        setStep(steps.length - 1);
        setResult(data);
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      {/* Header */}
      <nav className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain size={18} />
          </div>
          <span className="font-bold tracking-tight">SOLET <span className="text-white-40">LAB</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-xs font-mono text-white-40 hidden md:flex">
            <span className="flex items-center gap-1"><Shield size={12} className="text-emerald-500" /> ENCRYPTED</span>
            <span className="flex items-center gap-1"><Activity size={12} className="text-cyan-500" /> SYSTEM ONLINE</span>
          </div>
          <LoginButton />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Scale className="text-primary" /> Input Dilemma
            </h2>
            <textarea
              className="w-full h-64 bg-white-5 border border-white-10 rounded-xl p-4 text-white focus:border-primary transition-all resize-none mb-4"
              placeholder="Example: 'Should I do my homework or go play football today?'"
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleReason();
                }
              }}
            />
            <button 
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isProcessing ? 'bg-white-10 text-white-40 cursor-not-allowed' : 'btn-primary'
              }`}
              onClick={handleReason}
              disabled={isProcessing || !dilemma}
            >
              {isProcessing ? <RefreshCcw className="animate-spin" /> : <Send size={18} />}
              {isProcessing ? 'SYNCHRONIZING BRAIN...' : 'START REAL-TIME REASONING'}
            </button>
          </div>
        </div>

        {/* Right: Output Area */}
        <div className="lg:col-span-7">
          <div className="glass-card min-h-[500px] p-8 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-cyan-400" /> Analysis Matrix
            </h2>

            {!isProcessing && !result && (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-white-20">
                <Brain size={64} className="mb-4 opacity-10" />
                <p>Awaiting input parameters to begin logical deduction.</p>
              </div>
            )}

            {isProcessing && (
              <div className="flex-1 space-y-8 py-12">
                {steps.map((text, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: step >= i ? 1 : 0.2, 
                      x: step >= i ? 0 : -10,
                      color: step === i ? '#7000FF' : '#fff'
                    }}
                    className="flex items-center gap-4 font-mono text-sm"
                  >
                    {step > i ? <CheckCircle2 size={16} className="text-emerald-500" /> : <ChevronRight size={16} />}
                    {text}
                  </motion.div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {result && !isProcessing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl">
                    <h3 className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-2">SOLET Recommendation</h3>
                    <p className="text-xl font-medium leading-relaxed">{result.recommendation}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.perspectives.map((p: any, i: number) => (
                      <div key={i} className="p-4 bg-white-5 border border-white-10 rounded-xl text-center">
                        <div className="text-[10px] uppercase tracking-widest text-white-40 mb-2">{p.name}</div>
                        <div className="text-2xl font-black text-cyan-400">{p.value}%</div>
                        <div className="text-[10px] text-emerald-500 font-bold mt-1">{p.impact} Impact</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white-10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-mono text-white-40">Confidence Score Index</span>
                      <span className="text-sm font-mono text-emerald-500">{result.confidence}%</span>
                    </div>
                    <div className="w-full h-2 bg-white-5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-cyan-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-primary { background: #7000FF; box-shadow: 0 4px 14px rgba(112, 0, 255, 0.4); }
        .btn-primary:hover { background: #8214FF; transform: translateY(-2px); }
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        @media (min-width: 768px) { .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } .md\\:p-12 { padding: 3rem; } }
        @media (min-width: 1024px) { .lg\\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); } .lg\\:col-span-5 { grid-column: span 5 / span 5; } .lg\\:col-span-7 { grid-column: span 7 / span 7; } }
        .gap-4 { gap: 1rem; } .gap-8 { gap: 2rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; } .space-y-8 > * + * { margin-top: 2rem; }
        .flex { display: flex; } .flex-col { flex-direction: column; } .items-center { align-items: center; } .justify-center { justify-content: center; } .justify-between { justify-content: space-between; }
        .gap-2 { gap: 0.5rem; } .p-4 { padding: 1rem; } .p-6 { padding: 1.5rem; } .p-8 { padding: 2rem; }
        .mb-2 { margin-bottom: 0.5rem; } .mb-4 { margin-bottom: 1rem; } .mb-6 { margin-bottom: 1.5rem; } .mb-12 { margin-bottom: 3rem; }
        .max-w-6xl { max-width: 72rem; } .mx-auto { margin-left: auto; margin-right: auto; }
        .w-full { width: 100%; } .h-64 { height: 16rem; } .h-2 { height: 0.5rem; }
        .rounded-xl { border-radius: 0.75rem; } .rounded-2xl { border-radius: 1.5rem; } .rounded-full { border-radius: 9999px; }
        .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .text-xs { font-size: 0.75rem; } .text-sm { font-size: 0.875rem; } .text-xl { font-size: 1.25rem; } .text-2xl { font-size: 1.5rem; }
        .font-black { font-weight: 900; } .font-bold { font-weight: 700; } .font-medium { font-weight: 500; }
        .tracking-tight { letter-spacing: -0.025em; } .tracking-widest { letter-spacing: 0.1em; }
        .uppercase { text-transform: uppercase; } .leading-relaxed { line-height: 1.625; }
        .text-white\\/40 { color: rgba(255, 255, 255, 0.4); } .text-emerald-500 { color: #10b981; } .text-cyan-400 { color: #22d3ee; } .text-primary { color: #7000FF; }
        .border { border-width: 1px; } .border-t { border-top-width: 1px; } .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1); } .border-primary\\/20 { border-color: rgba(112, 0, 255, 0.2); }
        .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05); } .bg-primary\\/10 { background-color: rgba(112, 0, 255, 0.1); }
        .overflow-hidden { overflow: hidden; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
