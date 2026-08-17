import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { authActions } from '../store/auth';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { username, email, password, address } = formData;

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
      await api.post('/sign-up', { username: username.trim(), email: email.trim(), password, address: address.trim() });

      // Auto login after registration
      const loginResponse = await api.post('/login', { username: username.trim(), password });
      const { id, role, token } = loginResponse.data;

      dispatch(authActions.login({ id, role, token }));
      toast.success('Account created! Welcome to BookHeaven.');

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
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-zinc-100 mb-2">Create Account</h2>
          <p className="text-zinc-400 text-center text-sm mb-8">Join BookHeaven today</p>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm text-zinc-400 mb-1">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username (min 4 chars)"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-zinc-400 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={formData.email}
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
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm text-zinc-400 mb-1">Delivery Address</label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                placeholder="Your delivery address"
                value={formData.address}
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
              {isLoading ? 'Creating Account…' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
