import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-4 py-12" role="status" aria-label="Loading">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-0 rounded-full blur-sm opacity-30 bg-blue-500" />
      </div>
      <p className="text-blue-400 text-sm animate-pulse">Loading, please wait…</p>
    </div>
  );
};

export default Loader;
