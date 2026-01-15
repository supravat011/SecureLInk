import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Globe, Server, ArrowRight, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full px-6 lg:px-12 pt-20 pb-16 text-center lg:text-left lg:flex lg:items-center lg:justify-between">
        <div className="lg:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium border border-cyan-500/20 mb-6">
              <Wifi className="h-3 w-3" />
              Secure Communication Protocol
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
              Secure Data <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Transmission Framework
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0">
              An advanced educational platform demonstrating End-to-End Encryption (E2EE) mechanics. Visualize how data travels securely across hostile networks using AES-256 standards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25"
            >
              Start Secure Session
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all border border-slate-700"
            >
              Learn Architecture
            </Link>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="lg:w-1/2 mt-16 lg:mt-0 relative"
        >
          <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
            <div className="absolute -top-4 -right-4 bg-cyan-500 text-slate-950 p-3 rounded-lg font-bold shadow-lg">
              AES-256
            </div>
            <div className="space-y-4 font-mono text-sm text-slate-400">
              <div className="flex gap-2 items-center text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Initializing Handshake...
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-blue-400">&gt;&gt;</span> Generating Session Keys...
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-blue-400">&gt;&gt;</span> Encrypting Payload [2048 bit]
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-cyan-600 truncate">
                0x4F 0xA3 0x11 0x9B 0xCC 0x2A ...
              </div>
              <div className="flex gap-2 items-center text-cyan-400">
                <ShieldCheck className="h-4 w-4" />
                Channel Secured. Ready to transmit.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="w-full px-6 lg:px-12 py-20 bg-slate-900/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Fortified Security Core</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Built on military-grade encryption standards to ensure your data remains strictly confidential and tamper-proof during transit.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Delay delay={0.1}>
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Lock className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">End-to-End Encryption</h3>
              <p className="text-slate-400 leading-relaxed">
                Data is encrypted locally using AES-256-GCM before it ever leaves your device. Only the intended recipient holds the keys to decrypt.
              </p>
            </div>
          </Delay>
          <Delay delay={0.2}>
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                <Server className="h-7 w-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Handshake</h3>
              <p className="text-slate-400 leading-relaxed">
                Establishes authenticity through a robust RSA-2048 handshake protocol, exchanging session keys securely without exposure.
              </p>
            </div>
          </Delay>
          <Delay delay={0.3}>
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Globe className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero-Trust Architecture</h3>
              <p className="text-slate-400 leading-relaxed">
                We assume the network is hostile. All payloads are verified for integrity and authenticity upon arrival, preventing tampering.
              </p>
            </div>
          </Delay>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-30" />

        <div className="w-full px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">How SecureLink Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A transparency-first approach to secure communication. Understand the lifecycle of a message from sender to receiver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 -z-10" />

            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="w-24 h-24 mx-auto bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:border-blue-500 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] transition-all duration-300 z-10">
                <span className="text-3xl font-bold text-slate-500 group-hover:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Key Generation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Client generates RSA-2048 keypair. Public key is published to the server, Private key stays in your browser.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="w-24 h-24 mx-auto bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:border-cyan-500 group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] transition-all duration-300 z-10">
                <span className="text-3xl font-bold text-slate-500 group-hover:text-cyan-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Session Handshake</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sender fetches Receiver's public key. Generates a unique AES session key, encrypts it with RSA, and sends it.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="w-24 h-24 mx-auto bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center mb-6 group-hover:border-purple-500 group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] transition-all duration-300 z-10">
                <span className="text-3xl font-bold text-slate-500 group-hover:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Encrypted Tunnel</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Messages are encrypted with AES-256-GCM. Only encrypted blobs travel over the network. Integrity is verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-slate-950">
        <div className="w-full px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for Critical Sectors</h2>
              <p className="text-slate-400 mb-8 text-lg">
                When data leaks are not an option. SecureLink provides the architectural blueprint for industries demanding absolute confidentiality.
              </p>

              <div className="space-y-6">
                <UseCaseItem
                  title="Healthcare Data (HIPAA)"
                  desc="Transmit patient records and diagnostic data without exposing PII to intermediaries."
                  color="bg-red-500"
                />
                <UseCaseItem
                  title="Financial Transactions"
                  desc="Secure exchange of banking credentials and authorization tokens preventing replay attacks."
                  color="bg-green-500"
                />
                <UseCaseItem
                  title="Legal Correspondence"
                  desc="Client-Attorney privilege maintained digitally through verifiable E2EE."
                  color="bg-yellow-500"
                />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur-2xl opacity-20" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 overflow-hidden">
                <div className="font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 mb-4 border-b border-slate-800 pb-2">
                    <Lock className="w-4 h-4" /> Secure Terminal
                  </div>
                  <div className="text-green-400">$ init_secure_channel --target=dr_smith</div>
                  <div className="text-slate-300">[+] Fetching public key... OK</div>
                  <div className="text-slate-300">[+] Verifying identity signature... VALID</div>
                  <div className="text-slate-300">[+] Establishing AES-256-GCM context...</div>
                  <div className="text-cyan-400">[!] CHANNEL SECURE. TRAFFIC ENCRYPTED.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-blue-600/5" />
        <div className="w-full px-6 lg:px-12 relative z-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience True Privacy?</h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join the platform, generate your keys, and start sending secure messages instantly.
            Visualize the encryption process in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 text-base font-bold text-slate-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-all shadow-[0_0_20px_-5px_rgba(34,211,238,0.5)]"
            >
              Create Secure Account
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 text-base font-bold text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-all border border-slate-700"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Helper Components
const Delay = ({ children, delay }: { children: React.ReactNode, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const UseCaseItem = ({ title, desc, color }: { title: string, desc: string, color: string }) => (
  <div className="flex gap-4">
    <div className={`w-1.5 h-full min-h-[3.5rem] ${color} rounded-full`} />
    <div>
      <h4 className="text-white font-bold text-lg">{title}</h4>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  </div>
);
