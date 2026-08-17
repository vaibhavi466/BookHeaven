import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-zinc-900 text-white px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-9xl font-bold gradient-text-blue animate-float select-none">404</h1>
        <h2 className="text-3xl font-semibold text-zinc-200 mt-2 mb-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Page Not Found
        </h2>
        <p className="text-zinc-400 text-lg mb-8 text-center max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="animate-fade-in-up inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25"
          style={{ animationDelay: '0.3s' }}
        >
          ← Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
