import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { authService } from '../service/authService';
import { LockClosedIcon, KeyIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/outline';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset token');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.resetPasswordWithToken(token, newPassword);
      toast.success('✨ Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-moonlight-50 to-starlight-50 bg-mystical-pattern">
      {/* Floating stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`absolute h-4 w-4 text-starlight-400 animate-twinkle`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 p-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto flex flex-col items-center"
          >
            <motion.div 
              className="relative flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <KeyIcon className="h-16 w-16 text-moonlight-500" />
              <SparklesIcon className="h-8 w-8 text-stardust-400 absolute -top-2 -right-2 animate-twinkle" />
              <SparklesIcon className="h-6 w-6 text-stardust-400 absolute bottom-0 -left-2 animate-twinkle" style={{ animationDelay: '1s' }} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-3xl font-bold"
            >
              <span className="bg-gradient-to-r from-moonlight-500 to-starlight-500 bg-clip-text text-transparent">Reset Password</span>
            </motion.h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm text-moonlight-600"
          >
            Create your new magical key ✨
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-starlight-100"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="relative group">
              <LockClosedIcon className="h-5 w-5 text-moonlight-400 absolute top-3 left-3 transition-colors group-hover:text-moonlight-500" />
              <input
                type="password"
                required
                className="pl-10 w-full px-3 py-2 border border-starlight-200 rounded-xl placeholder-moonlight-400 text-moonlight-900 focus:outline-none focus:ring-2 focus:ring-starlight-500 focus:border-transparent transition-all"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="relative group">
              <LockClosedIcon className="h-5 w-5 text-moonlight-400 absolute top-3 left-3 transition-colors group-hover:text-moonlight-500" />
              <input
                type="password"
                required
                className="pl-10 w-full px-3 py-2 border border-starlight-200 rounded-xl placeholder-moonlight-400 text-moonlight-900 focus:outline-none focus:ring-2 focus:ring-starlight-500 focus:border-transparent transition-all"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-moonlight-500 to-starlight-500 hover:from-moonlight-600 hover:to-starlight-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-starlight-500 transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              'Reset Password ✨'
            )}
          </motion.button>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="button"
              className="text-moonlight-600 hover:text-moonlight-700 transition-colors"
              onClick={() => navigate('/login')}
            >
              Back to sign in
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;