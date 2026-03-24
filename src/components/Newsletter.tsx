'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { subscribeToNewsletter } from '@/app/newsletter/actions';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'already' | 'reactivated' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');

    const result = await subscribeToNewsletter(email, 'website');

    if (result.alreadySubscribed) {
      setState('already');
    } else if (result.reactivated) {
      setState('reactivated');
      setEmail('');
    } else if (result.success) {
      setState('success');
      setEmail('');
    } else {
      setState('error');
      setErrorMsg(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-20 bg-dark text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Stay Updated</h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest news, success stories, and grant opportunities directly in your inbox.
          </p>

          {state === 'idle' || state === 'loading' || state === 'error' ? (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="flex-grow px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={state === 'loading'}
                />
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70"
                >
                  {state === 'loading' ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  {state === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {state === 'error' && (
                <p className="mt-4 text-red-400 text-sm flex items-center justify-center gap-2">
                  <AlertCircle size={16} /> {errorMsg}
                </p>
              )}
            </>
          ) : state === 'already' ? (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[2rem] p-8 inline-flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Already subscribed!</h3>
              <p className="text-gray-400">This email is already on our list. You're all set!</p>
              <button
                onClick={() => { setState('idle'); setEmail(''); }}
                className="mt-6 text-primary font-bold hover:underline text-sm"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <div className="bg-primary/10 border border-primary/20 rounded-[2rem] p-8 inline-flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {state === 'reactivated' ? 'Welcome back!' : 'Thank you for subscribing!'}
              </h3>
              <p className="text-gray-400">
                {state === 'reactivated'
                  ? 'Your subscription has been reactivated. You\'ll receive updates again soon.'
                  : 'You\'ll start receiving our updates soon.'}
              </p>
              <button
                onClick={() => setState('idle')}
                className="mt-6 text-primary font-bold hover:underline text-sm"
              >
                Subscribe another email
              </button>
            </div>
          )}

          <p className="mt-8 text-xs text-gray-500">
            By subscribing, you agree to our{' '}
            <a href="/privacy-policy" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
            We never spam.
          </p>
        </div>
      </div>
    </section>
  );
}
