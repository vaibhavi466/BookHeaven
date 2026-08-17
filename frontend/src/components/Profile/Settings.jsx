import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';

const Settings = () => {
  const { profile } = useOutletContext();
  const [address, setAddress] = useState(profile?.address || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim() || address.trim().length < 3) {
      toast.error('Address must be at least 3 characters long.');
      return;
    }
    try {
      setIsUpdating(true);
      const response = await api.put('/update-address', { address: address.trim() });
      toast.success(response.data?.message || 'Address updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update address');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 text-zinc-100 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-zinc-300 mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-lg space-y-6">
        {/* Username */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Username</label>
          <p className="p-3 rounded-lg bg-zinc-900 text-zinc-200 font-medium">
            {profile?.username}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Email</label>
          <p className="p-3 rounded-lg bg-zinc-900 text-zinc-200 font-medium">
            {profile?.email}
          </p>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm text-zinc-400 mb-1">
            Delivery Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            className="w-full p-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            {isUpdating ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
