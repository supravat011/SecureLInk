import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-950 border-t border-slate-800">
            <div className="w-full px-6 lg:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <ShieldCheck className="h-8 w-8 text-cyan-400" />
                            <span className="text-xl font-bold text-white tracking-tight">
                                SecureLink
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm">
                            Next-generation secure data transmission framework featuring real-time E2EE and verifiable cryptographic integrity.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                    Architecture
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                    Live Demo
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                    Contact Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                    API Reference
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                    Security Whitepaper
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                    GitHub Repository
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="mailto:contact@securelink.dev" className="text-slate-400 hover:text-white transition-colors">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} SecureLink Framework. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
