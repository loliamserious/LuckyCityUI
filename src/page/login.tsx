import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { authService } from '../service/authService';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  GlobeAltIcon,
  SparklesIcon,
  StarIcon 
} from '@heroicons/react/24/outline';

type Mode = 'login' | 'register' | 'forgotPassword';

const Login: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      switch (mode) {
        case 'register':
          if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
          }
          await authService.register({
            email,
            password,
            username
          });
          toast.success('Registration successful! Please log in.');
          setMode('login');
          resetForm();
          break;

        case 'login':
          const response = await authService.login({
            email,
            password
          });
          toast.success('Welcome back! 🎉');
          onLogin(response.access_token);
          navigate('/lucky-map');
          break;

        case 'forgotPassword':
          await authService.forgotPassword(email);
          toast.success('Check your email for reset instructions!');
          break;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mystic-50 to-celestial-50 bg-mystical-pattern px-4 sm:px-6 lg:px-8">
      {/* Floating stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`absolute h-3 w-3 sm:h-4 sm:w-4 text-mystic-400 animate-twinkle`}
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
        className="max-w-md w-full space-y-6 sm:space-y-8 p-4 sm:p-8"
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
              <GlobeAltIcon className="h-12 w-12 sm:h-16 sm:w-16 text-mystic-600" />
              <SparklesIcon className="h-6 w-6 sm:h-8 sm:w-8 text-celestial-400 absolute -top-2 -right-2 animate-twinkle" />
              <SparklesIcon className="h-4 w-4 sm:h-6 sm:w-6 text-celestial-400 absolute bottom-0 -left-2 animate-twinkle" style={{ animationDelay: '1s' }} />
              <StarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-mystic-400 absolute top-1/2 -right-4 animate-twinkle" style={{ animationDelay: '1.5s' }} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold"
            >
              <span className="bg-gradient-to-r from-mystic-600 to-celestial-600 bg-clip-text text-transparent">Lucky City</span>
            </motion.h1>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-mystic-900"
          >
            {mode === 'login' ? '✨ Welcome Back ✨' :
             mode === 'register' ? '🌟 Join the Adventure 🌟' :
             '⭐ Reset Password ⭐'}
          </motion.h2>
          <p className="mt-2 text-sm sm:text-base text-mystic-600">
            {mode === 'login' ? 'Your magical journey awaits' :
             mode === 'register' ? 'Begin your enchanted exploration' :
             'Restore your mystical connection'}
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 bg-white/80 backdrop-blur-sm p-4 sm:p-8 rounded-2xl shadow-lg border border-mystic-100"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {mode === 'register' && (
              <div className="relative group">
                <UserIcon className="h-5 w-5 text-mystic-400 absolute top-3 left-3 transition-colors group-hover:text-mystic-500" />
                <input
                  type="text"
                  required
                  className="pl-10 w-full px-3 py-2.5 sm:py-2 border border-mystic-200 rounded-xl placeholder-mystic-400 text-mystic-900 focus:outline-none focus:ring-2 focus:ring-mystic-500 focus:border-transparent transition-all text-base sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div className="relative group">
              <EnvelopeIcon className="h-5 w-5 text-mystic-400 absolute top-3 left-3 transition-colors group-hover:text-mystic-500" />
              <input
                type="email"
                required
                className="pl-10 w-full px-3 py-2.5 sm:py-2 border border-mystic-200 rounded-xl placeholder-mystic-400 text-mystic-900 focus:outline-none focus:ring-2 focus:ring-mystic-500 focus:border-transparent transition-all text-base sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {mode !== 'forgotPassword' && (
              <div className="relative group">
                <LockClosedIcon className="h-5 w-5 text-mystic-400 absolute top-3 left-3 transition-colors group-hover:text-mystic-500" />
                <input
                  type="password"
                  required
                  className="pl-10 w-full px-3 py-2.5 sm:py-2 border border-mystic-200 rounded-xl placeholder-mystic-400 text-mystic-900 focus:outline-none focus:ring-2 focus:ring-mystic-500 focus:border-transparent transition-all text-base sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            {mode === 'register' && (
              <div className="relative group">
                <LockClosedIcon className="h-5 w-5 text-mystic-400 absolute top-3 left-3 transition-colors group-hover:text-mystic-500" />
                <input
                  type="password"
                  required
                  className="pl-10 w-full px-3 py-2.5 sm:py-2 border border-mystic-200 rounded-xl placeholder-mystic-400 text-mystic-900 focus:outline-none focus:ring-2 focus:ring-mystic-500 focus:border-transparent transition-all text-base sm:text-sm"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-mystic-600 to-celestial-600 hover:from-mystic-700 hover:to-celestial-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mystic-500 transition-all ${
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
              <>
                {mode === 'login' ? 'Begin Your Journey ✨' :
                 mode === 'register' ? 'Create Your Account 🌟' :
                 'Send Reset Link ⭐'}
              </>
            )}
          </motion.button>

          <div className="flex items-center justify-between text-sm">
            {mode === 'login' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  className="text-mystic-600 hover:text-mystic-700 transition-colors"
                  onClick={() => {
                    setMode('register');
                    resetForm();
                  }}
                >
                  Create account
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  className="text-mystic-600 hover:text-mystic-700 transition-colors"
                  onClick={() => {
                    setMode('forgotPassword');
                    resetForm();
                  }}
                >
                  Forgot password?
                </motion.button>
              </>
            )}
            {mode !== 'login' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                className="text-mystic-600 hover:text-mystic-700 transition-colors"
                onClick={() => {
                  setMode('login');
                  resetForm();
                }}
              >
                Back to sign in
              </motion.button>
            )}
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;