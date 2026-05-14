'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

interface RegisterForm {
  displayName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await authAPI.register({
        email: data.email,
        username: data.username,
        password: data.password,
        displayName: data.displayName,
      });
      toast.success('Account created! Please check your email to verify.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noir-midnight flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212, 175, 122, 0.06) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/"><span className="font-serif text-4xl text-gradient">Mémoire</span></Link>
          <p className="font-script text-rose-deep mt-2">begin your story</p>
        </div>

        <div className="glass-card p-8">
          <h1 className="font-serif text-2xl text-rose-cream mb-8">Create your account</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-rose-cream/60 text-sm font-sans mb-2">Your Name</label>
              <input
                {...register('displayName', { required: 'Name required' })}
                placeholder="Your beautiful name"
                className="input-romantic"
              />
              {errors.displayName && <p className="text-red-400 text-xs mt-1">{errors.displayName.message}</p>}
            </div>

            <div>
              <label className="block text-rose-cream/60 text-sm font-sans mb-2">Email</label>
              <input
                {...register('email', { required: 'Email required' })}
                type="email"
                placeholder="your@email.com"
                className="input-romantic"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-rose-cream/60 text-sm font-sans mb-2">Username</label>
              <input
                {...register('username', {
                  required: 'Username required',
                  minLength: { value: 3, message: 'At least 3 characters' },
                  pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, underscore' },
                })}
                placeholder="your_username"
                className="input-romantic"
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-rose-cream/60 text-sm font-sans mb-2">Password</label>
              <input
                {...register('password', { required: 'Password required', minLength: { value: 8, message: 'At least 8 characters' } })}
                type="password"
                placeholder="••••••••"
                className="input-romantic"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-rose-cream/60 text-sm font-sans mb-2">Confirm Password</label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm',
                  validate: v => v === password || 'Passwords do not match',
                })}
                type="password"
                placeholder="••••••••"
                className="input-romantic"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-romantic w-full py-4 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          <p className="text-center text-rose-cream/40 text-sm font-sans mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-rose-blush hover:text-rose-cream transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
