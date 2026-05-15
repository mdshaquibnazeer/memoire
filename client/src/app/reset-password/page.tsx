'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<any>();
  const password = watch('password');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      router.push('/login');
    }
  }, [token, router]);

  const onSubmit = async (data: any) => {
    if (!token) return;
    
    setLoading(true);
    try {
      await authAPI.resetPassword(token, data.password);
      toast.success('Password reset successfully! You can now sign in.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-noir-midnight flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated Floating Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/3 w-80 h-80 bg-rose-cream/5 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/"><span className="font-serif text-5xl text-gradient tracking-tight">Mémoire</span></Link>
          <p className="font-script text-[#c4a882] mt-3 text-xl">a fresh start</p>
        </div>

        <div className="glass-card p-10 relative shadow-2xl shadow-[#c4a882]/5 border border-rose-cream/10">
          <h1 className="font-serif text-2xl text-rose-cream mb-8">Set New Password</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-rose-cream/70 text-sm font-sans mb-2 tracking-wide uppercase text-xs">New Password</label>
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Must be at least 8 characters' }
                })}
                type="password"
                placeholder="••••••••"
                className="input-romantic bg-noir-midnight/50 focus:border-[#c4a882]/50 focus:ring-[#c4a882]/20"
              />
              {errors.password && <p className="text-red-400 text-xs mt-2">{errors.password.message as string}</p>}
            </div>

            <div>
              <label className="block text-rose-cream/70 text-sm font-sans mb-2 tracking-wide uppercase text-xs">Confirm Password</label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (val: string) => val === password || 'Passwords do not match'
                })}
                type="password"
                placeholder="••••••••"
                className="input-romantic bg-noir-midnight/50 focus:border-[#c4a882]/50 focus:ring-[#c4a882]/20"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-2">{errors.confirmPassword.message as string}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-romantic w-full py-4 disabled:opacity-50 mt-6 group relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #c4a882 0%, #e8c4b8 100%)', color: '#1a0a2e' }}
            >
              <span className="relative z-10 font-bold">{loading ? 'Resetting...' : 'Update Password'}</span>
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-noir-midnight flex items-center justify-center text-rose-cream">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
