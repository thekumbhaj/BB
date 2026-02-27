'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/lib/context/AuthContext';
import axiosInstance from '@/lib/api/axiosInstance';
import { ChatMessage } from '@/lib/types';

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto flex-shrink-0">
          AI
        </div>
      )}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
          }`}
        >
          {msg.message}
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">{time}</span>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold ml-2 mt-auto flex-shrink-0">
          You
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-auto flex-shrink-0">
        AI
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axiosInstance
      .get('/support/history')
      .then((res) => {
        const data = res.data.messages ?? res.data;
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // No history or endpoint not available - start fresh
      })
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError('');

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      _id: `tmp-${Date.now()}`,
      userId: user?.id ?? '',
      message: text,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await axiosInstance.post('/support/chat', { message: text });
      const reply: ChatMessage = res.data.message ?? res.data;
      setMessages((prev) => [...prev, reply]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Support Chat</h1>
          <p className="text-gray-500 text-sm">Get instant AI-powered help with your bugs and questions.</p>
        </div>

        {/* Chat window */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-[500px]">
          {/* Chat header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              AI
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Bugbaar Assistant</p>
              <p className="text-xs text-green-500 font-medium">● Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
            {historyLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-3xl mb-2">👋</p>
                <p className="text-gray-600 font-medium text-sm">Hi {user?.name ?? 'there'}!</p>
                <p className="text-gray-400 text-xs mt-1">Ask me anything about bugs, errors, or the system.</p>
              </div>
            ) : (
              messages.map((msg) => <ChatBubble key={msg._id} msg={msg} />)
            )}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="mx-5 mb-2 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 px-4 py-3">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-sm font-semibold"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
