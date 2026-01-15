import React, { useState, useEffect } from 'react';
import { History, Search, Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import messageService, { Message } from '../services/messageService';
import authService from '../services/authService';
import { motion } from 'framer-motion';

export const HistoryPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const data = await messageService.getHistory();
            setMessages(data.messages);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            await messageService.deleteMessage(id);
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            console.error('Failed to delete message:', error);
            alert('Failed to delete message');
        }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch =
            msg.sender_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.receiver_username.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filter === 'all' ||
            (filter === 'sent' && msg.sender_id === currentUser?.id) ||
            (filter === 'received' && msg.receiver_id === currentUser?.id);

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading message history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <History className="h-8 w-8 text-cyan-500" />
                    <h1 className="text-3xl font-bold text-white">Communication History</h1>
                </div>
                <p className="text-slate-400">View all encrypted message transmissions</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('sent')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'sent'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            Sent
                        </button>
                        <button
                            onClick={() => setFilter('received')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'received'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            Received
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
                    <History className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No messages found</p>
                    <p className="text-slate-500 text-sm mt-2">
                        {searchTerm ? 'Try a different search term' : 'Start sending encrypted messages'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredMessages.map((message) => {
                        const isSent = message.sender_id === currentUser?.id;
                        return (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {isSent ? (
                                            <Lock className="h-5 w-5 text-blue-500" />
                                        ) : (
                                            <Unlock className="h-5 w-5 text-green-500" />
                                        )}
                                        <div>
                                            <p className="text-white font-medium">
                                                {isSent ? (
                                                    <>To: <span className="text-cyan-400">{message.receiver_username}</span></>
                                                ) : (
                                                    <>From: <span className="text-green-400">{message.sender_username}</span></>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(message.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">
                                            {message.algorithm}
                                        </span>
                                        <button
                                            onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                            title="View details"
                                        >
                                            {selectedMessage?.id === message.id ? (
                                                <EyeOff className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-slate-400" />
                                            )}
                                        </button>
                                        {isSent && (
                                            <button
                                                onClick={() => handleDelete(message.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete message"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {selectedMessage?.id === message.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mt-4 space-y-3"
                                    >
                                        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Encrypted Content</p>
                                            <p className="font-mono text-xs text-green-500 break-all">
                                                {message.encrypted_content.substring(0, 200)}...
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">IV</p>
                                                <p className="font-mono text-xs text-cyan-500 break-all">
                                                    {message.iv.substring(0, 32)}...
                                                </p>
                                            </div>
                                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Encrypted AES Key</p>
                                                <p className="font-mono text-xs text-purple-500 break-all">
                                                    {message.encrypted_aes_key.substring(0, 32)}...
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-center">
                    <p className="text-2xl font-bold text-white">{messages.length}</p>
                    <p className="text-sm text-slate-400">Total Messages</p>
                </div>
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-500">
                        {messages.filter(m => m.sender_id === currentUser?.id).length}
                    </p>
                    <p className="text-sm text-slate-400">Sent</p>
                </div>
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-center">
                    <p className="text-2xl font-bold text-green-500">
                        {messages.filter(m => m.receiver_id === currentUser?.id).length}
                    </p>
                    <p className="text-sm text-slate-400">Received</p>
                </div>
            </div>
        </div>
    );
};
