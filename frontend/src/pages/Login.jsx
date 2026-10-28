import React, { useState } from 'react';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../student-app/config';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username: email,
        password: password,
        requiredRole: 'EMPLOYEE'
      });
      
      if (response.data.role === 'ADMIN' || response.data.role !== 'EMPLOYEE') {
        setIsLoading(false);
        setError('Access denied. Admin credentials cannot be used for Employee Login. Please use the Admin Login portal.');
        return;
      }

      // Save exclusively in sessionStorage so tab closure requires login again
      sessionStorage.setItem('employeeToken', response.data.token);
      if (response.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
      }
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again or contact IT support.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative overflow-hidden p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/25 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>

      <div className="w-full max-w-[420px] bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12),0_10px_25px_-5px_rgba(249,115,22,0.08)] relative z-10">
        
        {/* Logo Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <img src="/logo.png" alt="PaulTech Logo" className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Employee Portal</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Sign in to access internal tools and resources</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-100 flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5 group">
            <label className="block text-sm font-semibold text-slate-700">Corporate Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                <FiMail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-1.5 group">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">Forgot Password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-600 transition-colors">
                <FiLock size={18} />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all duration-300"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold text-base sm:text-lg py-3 sm:py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2 sm:mt-4"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
            {!isLoading && <FiArrowRight size={18} />}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            This portal is strictly for authorized PaulTech employees only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
