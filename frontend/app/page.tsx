'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            Bug<span className="text-blue-300">baar</span>
          </span>
        </div>
        <nav className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-white border border-white/40 rounded-lg hover:bg-white/10 transition font-medium text-sm"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-white text-blue-800 rounded-lg hover:bg-blue-50 transition font-medium text-sm shadow"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <span className="inline-block mb-4 px-3 py-1 bg-blue-500/30 text-blue-200 text-xs font-semibold rounded-full uppercase tracking-widest border border-blue-400/30">
          Bug Tracking Made Simple
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 max-w-3xl">
          Track, Manage & Resolve Bugs{' '}
          <span className="text-blue-300">Faster</span>
        </h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Bugbaar helps your team capture, prioritize, and squash every bug before it reaches production.
          Collaborate with your team and get AI-powered support in real time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-800 rounded-xl font-bold text-base hover:bg-blue-50 shadow-lg transition"
          >
            Start for Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-white/50 text-white rounded-xl font-bold text-base hover:bg-white/10 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: '🐛',
              title: 'Bug Reporting',
              desc: 'Quickly report bugs with severity levels, descriptions, and automatic tracking.',
            },
            {
              icon: '📊',
              title: 'Dashboard Analytics',
              desc: 'Get a bird\'s-eye view of all open, in-progress, and resolved issues at a glance.',
            },
            {
              icon: '🤖',
              title: 'AI Support Chat',
              desc: 'Ask questions and get instant AI-powered answers to help resolve issues faster.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-white"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-blue-300/60 text-sm">
        © {new Date().getFullYear()} Bugbaar. All rights reserved.
      </footer>
    </main>
  );
}
