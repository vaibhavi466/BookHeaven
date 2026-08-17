import React from 'react';

const BookCard = ({ data, onClick }) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label={`View details for ${data.title}`}
      className="group relative bg-zinc-800/80 border border-zinc-700/60 rounded-xl p-4 flex flex-col items-center shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-zinc-600 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative bg-zinc-900/80 rounded-lg flex items-center justify-center h-[26vh] w-full overflow-hidden">
        <img
          src={data.url}
          alt={`Cover of ${data.title}`}
          className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/160x220?text=No+Cover';
          }}
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <span className="text-sm font-medium text-white bg-blue-600/90 backdrop-blur-sm px-4 py-1.5 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View Details →
          </span>
        </div>
      </div>

      {/* Title */}
      <h2 className="mt-4 text-base text-white font-semibold text-center line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors duration-300">
        {data.title}
      </h2>

      {/* Author */}
      <p className="text-zinc-500 text-sm mt-1 text-center">
        by {data.author || 'Unknown Author'}
      </p>

      {/* Price */}
      <p className="mt-2.5 text-lg font-bold">
        <span className="gradient-text">₹ {data.price ?? 'N/A'}</span>
      </p>
    </div>
  );
};

export default BookCard;
