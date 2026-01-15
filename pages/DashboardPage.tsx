import React, { useState, useEffect } from 'react';
import { Send, Lock, Unlock, RefreshCw, CheckCircle, Shield, BrainCircuit, Users } from 'lucide-react';
import { generateKey, encryptMessage, decryptMessage } from '../services/cryptoService';
import { analyzeSecurityContext } from '../services/geminiService';
import messageService from '../services/messageService';
import authService, { User } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export const DashboardPage: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptedData, setDecryptedData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'secure' | 'transmitting'>('secure');

  // Crypto State
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [iv, setIv] = useState<Uint8Array | null>(null);

  // Gemini State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Backend Integration
  const [users, setUsers] = useState<User[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<string>('');
  const [sendToBackend, setSendToBackend] = useState(false);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // Initialize session key on mount
    const initKey = async () => {
      const k = await generateKey();
      setKey(k);
    };
    initKey();

    // Load users for receiver selection
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      // Filter out current user
      const otherUsers = response.data.users.filter((u: User) => u.id !== currentUser?.id);
      setUsers(otherUsers);
      if (otherUsers.length > 0) {
        setSelectedReceiver(otherUsers[0].username);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleTransmit = async () => {
    if (!inputMessage || !key) return;

    setIsProcessing(true);
    setStatus('transmitting');
    setEncryptedData('');
    setDecryptedData('');
    setAiAnalysis(null);

    try {
      // 1. Encrypt
      await new Promise(r => setTimeout(r, 600)); // Simulate delay
      const { cipherText, iv: newIv } = await encryptMessage(inputMessage, key);
      setIv(newIv);
      setEncryptedData(cipherText);

      // 2. Send to backend if enabled and receiver selected
      if (sendToBackend && selectedReceiver) {
        try {
          // Export AES key to send to backend
          const exportedKey = await window.crypto.subtle.exportKey('raw', key);
          const keyArray = new Uint8Array(exportedKey);

          // Convert to base64
          const keyBase64 = btoa(String.fromCharCode(...keyArray));
          const ivBase64 = btoa(String.fromCharCode(...newIv));

          // Get receiver's public key (in production, this would encrypt the AES key with receiver's RSA public key)
          // For now, we'll send the AES key directly (demonstration purposes)

          await messageService.sendMessage({
            receiver_username: selectedReceiver,
            encrypted_content: cipherText,
            iv: ivBase64,
            encrypted_aes_key: keyBase64, // In production: encrypt with receiver's RSA public key
            algorithm: 'AES-256-GCM'
          });

          setStatus('secure');
          alert('Message sent to backend successfully!');
        } catch (error: any) {
          console.error('Failed to send to backend:', error);
          alert('Failed to send to backend: ' + (error.response?.data?.error || error.message));
        }
      } else {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 1000));
      }

      // 3. Decrypt (for demonstration)
      const decrypted = await decryptMessage(cipherText, key, newIv);
      setDecryptedData(decrypted);

      setStatus('secure');
    } catch (e) {
      console.error(e);
      setStatus('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAIAnalysis = async () => {
    if (!encryptedData) return;
    setIsAnalyzing(true);
    const analysis = await analyzeSecurityContext(inputMessage, encryptedData, "AES-256-GCM");
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${status === 'transmitting' ? 'bg-yellow-500 animate-ping' : 'bg-green-500'}`} />
          <span className="font-mono text-sm text-slate-300">
            STATUS: {status === 'transmitting' ? 'TRANSMITTING PACKETS...' : 'SECURE CHANNEL ACTIVE'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Lock className="h-3 w-3" />
          <span>SESSION ID: {key ? 'ESTABLISHED' : 'GENERATING...'}</span>
        </div>
      </div>

      {/* Backend Integration Toggle */}
      {currentUser && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-cyan-500" />
              <div>
                <p className="text-white font-medium">Send to Backend Database</p>
                <p className="text-xs text-slate-400">Store encrypted message in database</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sendToBackend}
                onChange={(e) => setSendToBackend(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {sendToBackend && users.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-400 mb-2">SELECT RECEIVER</label>
              <select
                value={selectedReceiver}
                onChange={(e) => setSelectedReceiver(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.username}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {sendToBackend && users.length === 0 && (
            <p className="mt-4 text-sm text-amber-500">No other users available. Create another account to test messaging.</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* SENDER NODE */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-sm">
            <Send className="h-4 w-4" /> Sender (Client A)
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative group focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all">
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase">Plain Text Input</label>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type confidential message..."
              className="w-full bg-slate-950 text-white rounded-lg p-4 border border-slate-700 focus:border-cyan-500 focus:ring-0 transition-colors h-40 resize-none font-mono text-sm"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleTransmit}
                disabled={!inputMessage || isProcessing}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${!inputMessage || isProcessing
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                  }`}
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {sendToBackend ? 'Encrypt & Send to DB' : 'Encrypt & Send'}
              </button>
            </div>
          </div>
        </div>

        {/* NETWORK / ENCRYPTION LAYER */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <AnimatePresence mode="wait">
            {encryptedData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Cipher Text (In Transit)
                  </span>
                  <span className="text-xs font-mono text-cyan-600">AES-256-GCM</span>
                </div>
                <div className="bg-slate-950 rounded p-3 font-mono text-xs text-green-500 break-all border border-slate-800/50 shadow-inner h-32 overflow-y-auto custom-scrollbar">
                  {encryptedData}
                </div>

                {/* AI Feature */}
                <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
                  <button
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <BrainCircuit className="h-3 w-3" />
                    {isAnalyzing ? "Analyzing..." : "AI Security Audit"}
                  </button>
                </div>
                {aiAnalysis && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mt-2 text-xs text-slate-300 bg-purple-500/10 p-2 rounded border border-purple-500/20"
                  >
                    {aiAnalysis}
                  </motion.div>
                )}

              </motion.div>
            ) : (
              <div className="text-center opacity-30">
                <RefreshCw className="h-12 w-12 text-slate-500 mx-auto mb-2 animate-spin-slow" style={{ animationDuration: '10s' }} />
                <p className="text-xs font-mono">WAITING FOR TRANSMISSION</p>
              </div>
            )}
          </AnimatePresence>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        {/* RECEIVER NODE */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-wider text-sm">
            <CheckCircle className="h-4 w-4" /> Receiver (Server)
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full min-h-[16rem]">
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase">Decrypted Payload</label>
            <div className={`w-full h-40 rounded-lg p-4 border border-slate-700 font-mono text-sm transition-all ${decryptedData ? 'bg-slate-950 text-white' : 'bg-slate-950/50 text-slate-600 italic'
              }`}>
              {decryptedData || "Waiting for secure message..."}
            </div>
            {decryptedData && (
              <div className="mt-4 flex items-center justify-end text-green-500 text-xs font-bold uppercase gap-1">
                <Unlock className="h-3 w-3" /> Integrity Verified
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};