'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back ✨');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir-midnight flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(232, 196, 184, 0.08) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <span className="font-serif text-4xl text-gradient">Mémoire</span>
          </Link>
          <p className="font-script text-rose-deep mt-2">welcome back</p>
        </div>

        <div className="glass-card p-8">
          <h1 className="font-serif text-2xl text-rose-cream mb-8">Sign in to your account</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-rose-cream/60 text-sm font-sans mb-2">Email</label>
              <input
                {...register('email', { required: 'Email required' })}
                type="email"
                placeholder="your@email.com"
                className="input-romantic"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-rose-cream/60 text-sm font-sans">Password</label>
                <Link href="/forgot-password" className="text-xs text-rose-deep hover:text-rose-blush transition-colors font-sans">
                  Forgot password?
                </Link>
              </div>
              <input
                {...register('password', { required: 'Password required' })}
                type="password"
                placeholder="••••••••"
                className="input-romantic"
                autoComplete="current-password"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-romantic w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <p className="text-center text-rose-cream/40 text-sm font-sans mt-6">
            New to Mémoire?{' '}
            <Link href="/register" className="text-rose-blush hover:text-rose-cream transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
