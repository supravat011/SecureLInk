import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Lock, ArrowRight, Server, Shield, Key } from 'lucide-react';
import { explainConcept } from '../services/geminiService';

const StepCard = ({ 
  icon: Icon, 
  title, 
  desc, 
  delay,
  onExplain 
}: { 
  icon: any, 
  title: string, 
  desc: string, 
  delay: number,
  onExplain: (term: string) => void
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col items-center text-center relative z-10 hover:border-cyan-500/50 transition-colors group"
  >
    <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center mb-4 border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
      <Icon className="h-8 w-8 text-cyan-500" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 mb-4">{desc}</p>
    <button 
      onClick={() => onExplain(title)}
      className="text-xs text-cyan-500 hover:text-cyan-400 underline decoration-cyan-500/30"
    >
      What is this?
    </button>
  </motion.div>
);

export const VisualizationPage: React.FC = () => {
  const [explanation, setExplanation] = React.useState<{term: string, text: string} | null>(null);

  const handleExplain = async (term: string) => {
    setExplanation({ term, text: "Loading AI explanation..." });
    const text = await explainConcept(term);
    setExplanation({ term, text });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white">Encryption Workflow Visualization</h2>
        <p className="text-slate-400 mt-2">Step-by-step breakdown of the SecureLink protocol</p>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0">
           <motion.div 
             className="h-full bg-cyan-500"
             initial={{ width: "0%" }}
             animate={{ width: "100%" }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StepCard 
            icon={FileText}
            title="Plain Text"
            desc="The original readable message input by the user."
            delay={0.1}
            onExplain={handleExplain}
          />
          <StepCard 
            icon={Key}
            title="Encryption (AES)"
            desc="Message is converted to cipher text using a symmetric key."
            delay={0.3}
            onExplain={handleExplain}
          />
          <StepCard 
            icon={Shield}
            title="Secure Tunnel"
            desc="Encrypted packets travel over the internet via TLS/SSL simulation."
            delay={0.5}
            onExplain={handleExplain}
          />
          <StepCard 
            icon={Server}
            title="Decryption"
            desc="Receiver uses the shared key to revert cipher text to plain text."
            delay={0.7}
            onExplain={handleExplain}
          />
        </div>
      </div>

      {/* Interactive Explanation Area */}
      {explanation && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-16 max-w-2xl mx-auto bg-slate-900 border border-cyan-500/30 p-6 rounded-xl relative"
        >
          <button 
            onClick={() => setExplanation(null)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white"
          >
            ✕
          </button>
          <h4 className="text-cyan-400 font-bold mb-2">AI Concept: {explanation.term}</h4>
          <p className="text-slate-300 leading-relaxed">
            {explanation.text}
          </p>
        </motion.div>
      )}
    </div>
  );
};