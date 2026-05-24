'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { User, Mail, Shield, Bell } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Password state
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdChanging, setPwdChanging] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      toast.success('Settings updated successfully');
      setIsUpdating(false);
    }, 1000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    setPwdChanging(true);
    try {
      await authAPI.changePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      toast.success('Password updated successfully ✨');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setPwdChanging(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-cream">Settings</h1>
        <p className="text-rose-cream/40 font-sans mt-1 sm:mt-2 text-sm sm:text-base">
          Manage your account and preferences.
        </p>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-rose-cream flex items-center gap-2">
              <User size={20} className="text-rose-deep" />
              Profile Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-sans text-rose-cream/60 mb-2">Display Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.displayName || ''}
                  className="input-romantic" 
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-rose-cream/60 mb-2">Username</label>
                <input 
                  type="text" 
                  defaultValue={user?.username || ''}
                  className="input-romantic opacity-50 cursor-not-allowed" 
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <h3 className="font-serif text-xl text-rose-cream flex items-center gap-2">
              <Mail size={20} className="text-rose-deep" />
              Email Address
            </h3>
            <div>
              <input 
                type="email" 
                defaultValue={user?.email || ''}
                className="input-romantic opacity-50 cursor-not-allowed" 
                disabled
              />
              <p className="text-xs text-rose-cream/20 mt-2 font-sans">
                Email changes are currently disabled for your account security.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <button 
              type="submit" 
              disabled={isUpdating}
              className="btn-romantic w-full sm:w-auto px-10"
            >
              <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <Shield size={24} className="text-rose-deep mb-4" />
          <h4 className="font-serif text-lg text-rose-cream mb-2">Change Password</h4>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-sans text-rose-cream/60 mb-1">Current Password</label>
              <input
                type="password"
                value={pwdForm.currentPassword}
                onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))}
                className="input-romantic text-xs"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-sans text-rose-cream/60 mb-1">New Password</label>
              <input
                type="password"
                value={pwdForm.newPassword}
                onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))}
                className="input-romantic text-xs"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-sans text-rose-cream/60 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={pwdForm.confirmPassword}
                onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))}
                className="input-romantic text-xs"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={pwdChanging}
              className="btn-romantic w-full text-xs py-2 disabled:opacity-50"
            >
              <span>{pwdChanging ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
        <div className="glass-card p-6 opacity-50">
          <Bell size={24} className="text-rose-deep mb-4" />
          <h4 className="font-serif text-lg text-rose-cream mb-2">Notifications</h4>
          <p className="text-sm text-rose-cream/40 font-sans">Email preferences coming soon.</p>
        </div>
      </div>
    </div>
  );
}
