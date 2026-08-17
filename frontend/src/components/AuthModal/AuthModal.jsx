import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaTimes, FaLock, FaUser, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../../api/axios';
import { authActions } from '../../store/auth';

const AuthModal = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = loginData;

    if (!username.trim() || !password) {
      toast.error('Username and password are required.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/login', { username: username.trim(), password });
      const { id, role, token } = response.data;

      dispatch(authActions.login({ id, role, token }));
      toast.success('Successfully logged in!');
      onSuccess(); // Triggers automatic queue completion
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, address } = signUpData;

    if (!username.trim() || !email.trim() || !password || !address.trim()) {
      toast.error('All fields are required.');
      return;
    }
    if (username.trim().length < 4) {
      toast.error('Username must be at least 4 characters.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsLoading(true);

      // Register
      await api.post('/sign-up', {
        username: username.trim(),
        email: email.trim(),
        password,
        address: address.trim(),
      });

      // Login
      const loginResponse = await api.post('/login', {
        username: username.trim(),
        password,
      });
      const { id, role, token } = loginResponse.data;

      dispatch(authActions.login({ id, role, token }));
      toast.success('Account created and logged in!');
      onSuccess(); // Triggers automatic queue completion
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-2xl p-6 sm:p-8 shadow-2xl animate-slide-down max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors duration-200"
          aria-label="Close modal"
        >
          <FaTimes className="text-lg" />
        </button>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Authentication Required
        </h2>
        <p className="text-zinc-400 text-center text-xs sm:text-sm mb-6">
          Log in or create a free account to complete this action.
        </p>

        {/* Tab Selector */}
        <div className="flex border-b border-zinc-750 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 pb-3 text-sm font-semibold transition-all duration-300 border-b-2 ${
              activeTab === 'login'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`flex-1 pb-3 text-sm font-semibold transition-all duration-300 border-b-2 ${
              activeTab === 'signup'
                ? 'border-bronze-500 text-bronze-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="modal-username" className="block text-xs text-zinc-400 mb-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <FaUser className="text-xs" />
                </span>
                <input
                  id="modal-username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-password" className="block text-xs text-zinc-400 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <FaLock className="text-xs" />
                </span>
                <input
                  id="modal-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? 'Logging in…' : 'Log In & Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div>
              <label htmlFor="modal-signup-username" className="block text-xs text-zinc-400 mb-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <FaUser className="text-xs" />
                </span>
                <input
                  id="modal-signup-username"
                  name="username"
                  type="text"
                  placeholder="Minimum 4 characters"
                  value={signUpData.username}
                  onChange={handleSignUpChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-bronze-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-signup-email" className="block text-xs text-zinc-400 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <FaEnvelope className="text-xs" />
                </span>
                <input
                  id="modal-signup-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-bronze-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-signup-password" className="block text-xs text-zinc-400 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <FaLock className="text-xs" />
                </span>
                <input
                  id="modal-signup-password"
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-bronze-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-signup-address" className="block text-xs text-zinc-400 mb-1">
                Delivery Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <FaMapMarkerAlt className="text-xs" />
                </span>
                <input
                  id="modal-signup-address"
                  name="address"
                  type="text"
                  placeholder="Enter your delivery address"
                  value={signUpData.address}
                  onChange={handleSignUpChange}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-bronze-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-gradient-to-r from-bronze-600 to-bronze-700 hover:from-bronze-500 hover:to-bronze-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-bronze-900/30 hover:shadow-lg hover:shadow-bronze-500/25 active:scale-95"
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? 'Creating Account…' : 'Sign Up & Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
