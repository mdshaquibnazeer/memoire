'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success('If an account exists, a reset link was sent.');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir-midnight flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Floating Orbs */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-deep/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c4a882]/10 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/"><span className="font-serif text-5xl text-gradient tracking-tight">Mémoire</span></Link>
          <p className="font-script text-rose-deep mt-3 text-xl">reclaim your memories</p>
        </div>

        <div className="glass-card p-10 relative shadow-2xl shadow-rose-deep/5 border border-rose-cream/10">
          {isSubmitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <div className="w-16 h-16 bg-rose-cream/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h1 className="font-serif text-2xl text-rose-cream mb-4">Check your email</h1>
              <p className="text-rose-cream/70 mb-8 leading-relaxed font-sans font-light">
                We've sent a delicate thread to your inbox. Follow it to restore your access.
              </p>
              <Link href="/login" className="btn-romantic block w-full py-4 text-center">
                <span>Return to Sign in</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-serif text-2xl text-rose-cream mb-2">Forgot Password</h1>
              <p className="text-rose-cream/60 text-sm mb-8 font-sans font-light">Enter the email associated with your account, and we'll send you a secure link to reset your password.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-rose-cream/70 text-sm font-sans mb-2 tracking-wide uppercase text-xs">Email Address</label>
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    placeholder="your@email.com"
                    className="input-romantic bg-noir-midnight/50"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-romantic w-full py-4 disabled:opacity-50 mt-4 group relative overflow-hidden"
                >
                  <span className="relative z-10">{loading ? 'Sending...' : 'Send Recovery Link'}</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </button>
              </form>

              <p className="text-center text-rose-cream/40 text-sm font-sans mt-8">
                Remembered your password?{' '}
                <Link href="/login" className="text-rose-blush hover:text-rose-cream transition-colors border-b border-rose-blush/30 hover:border-rose-cream pb-0.5">Sign in</Link>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
