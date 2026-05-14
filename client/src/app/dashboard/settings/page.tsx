'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { User, Mail, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      toast.success('Settings updated successfully');
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold text-rose-cream">Settings</h1>
        <p className="text-rose-cream/40 font-sans mt-2">
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
        <div className="glass-card p-6 opacity-50">
          <Shield size={24} className="text-rose-deep mb-4" />
          <h4 className="font-serif text-lg text-rose-cream mb-2">Security</h4>
          <p className="text-sm text-rose-cream/40 font-sans">Password and 2FA settings coming soon.</p>
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
