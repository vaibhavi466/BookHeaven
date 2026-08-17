import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaExclamationTriangle } from 'react-icons/fa';
import api from '../api/axios';
import Loader from '../components/Loader/Loader';
import Sidebar from '../components/Profile/Sidebar';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get('/get-user-information');
        // Backend returns { status, data: user }
        setProfile(response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(true);
      }
    };

    fetchProfile();
  }, [isLoggedIn, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center gap-4 text-zinc-400">
        <FaExclamationTriangle className="text-5xl text-bronze-500 animate-pulse" />
        <p className="text-xl">Failed to load your profile.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 px-2 md:px-6 py-6 flex flex-col md:flex-row gap-4 min-h-[calc(100vh-64px)]">
      <div className="w-full md:w-64 flex-shrink-0">
        <Sidebar data={profile} />
      </div>
      <div className="flex-grow min-w-0">
        <Outlet context={{ profile }} />
      </div>
    </div>
  );
};

export default Profile;
