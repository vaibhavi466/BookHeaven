import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { authActions } from '../store/auth';

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username.trim() || !password) {
      toast.error('Please enter your username and password.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/login', { username: username.trim(), password });
      const { id, role, token } = response.data;

      dispatch(authActions.login({ id, role, token }));
      toast.success('Login successful! Welcome back.');

      // Check for pending action
      const pendingAction = localStorage.getItem('pendingAction');
      if (pendingAction) {
        try {
          const { type, bookId } = JSON.parse(pendingAction);
          if (type === 'cart') {
            await api.put(`/add-to-cart/${bookId}`);
            toast.success('Book added to cart!');
          } else if (type === 'fav') {
            await api.put('/add-book-to-favourite', {}, {
              headers: { bookid: bookId },
            });
            toast.success('Book added to favourites!');
          }
          localStorage.removeItem('pendingAction');
          navigate(`/view-book-details/${bookId}`);
          return;
        } catch (err) {
          console.error('Failed to execute pending action:', err);
          localStorage.removeItem('pendingAction');
        }
      }

      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-zinc-100 mb-2">Welcome Back</h2>
          <p className="text-zinc-400 text-center text-sm mb-8">Log in to your BookHeaven account</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm text-zinc-400 mb-1">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-zinc-400 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
