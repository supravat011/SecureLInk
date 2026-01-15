import React from 'react';
import { Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">About SecureLink</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Project Objective</h2>
          <p className="text-slate-400 leading-relaxed text-lg">
            SecureLink is designed to bridge the gap between theoretical cryptography concepts and practical implementation. 
            In the modern digital age, data privacy is paramount. This project demonstrates how sensitive information can be 
            protected during transmission across insecure networks (like the internet) using industry-standard encryption algorithms.
            The primary goal is to provide a visual and interactive platform for engineering students to understand End-to-End Encryption (E2EE).
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">Core Concepts</h2>
            <ul className="space-y-3">
              {[
                'Symmetric Encryption (AES-GCM)',
                'Key Generation & Management',
                'Cipher Block Chaining',
                'Data Integrity Verification',
                'Man-in-the-Middle Defense'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-400">
                  <div className="bg-green-500/20 p-1 rounded-full">
                    <Check className="h-3 w-3 text-green-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4">Tech Stack</h2>
            <ul className="space-y-3">
              {[
                'React 18 & TypeScript',
                'Web Crypto API (Native)',
                'Tailwind CSS',
                'Google Gemini AI (Analysis)',
                'Framer Motion'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-400">
                  <div className="bg-cyan-500/20 p-1 rounded-full">
                    <Check className="h-3 w-3 text-cyan-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Real-World Application</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            The concepts demonstrated in SecureLink are the foundation of modern secure communications, including:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="font-bold text-white">Banking</h3>
                <p className="text-sm text-slate-500 mt-2">Securing transactions and personal financial data.</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="font-bold text-white">Healthcare</h3>
                <p className="text-sm text-slate-500 mt-2">Protecting patient records (HIPAA compliance).</p>
             </div>
             <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="font-bold text-white">Military</h3>
                <p className="text-sm text-slate-500 mt-2">Classified communication channels.</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};