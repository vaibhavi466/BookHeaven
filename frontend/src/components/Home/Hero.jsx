import React from 'react';
import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi2';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { IoLibrary } from 'react-icons/io5';
import { BsStars } from 'react-icons/bs';
import hero from '../../assets/hero.png';
import RecentlyAdded from './RecentlyAdded';

const Hero = () => {
  return (
    <>
      <div className="relative min-h-[82vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 py-14 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 animate-gradient" style={{ backgroundSize: '300% 300%' }} />

        {/* Decorative floating elements */}
        <div className="absolute top-16 left-8 text-4xl opacity-[0.07] animate-float select-none pointer-events-none text-bronze-400" style={{ animationDelay: '0s' }}>
          <FaBookOpen />
        </div>
        <div className="absolute top-32 right-16 text-3xl opacity-[0.07] animate-float select-none pointer-events-none text-blue-400" style={{ animationDelay: '1.5s' }}>
          <IoLibrary />
        </div>
        <div className="absolute bottom-24 left-1/4 text-2xl opacity-[0.07] animate-float select-none pointer-events-none text-bronze-300" style={{ animationDelay: '3s' }}>
          <HiSparkles />
        </div>
        <div className="absolute bottom-16 right-1/3 text-3xl opacity-[0.05] animate-float select-none pointer-events-none text-blue-300" style={{ animationDelay: '2s' }}>
          <BsStars />
        </div>

        {/* Gradient orbs for depth */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-bronze-600/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />

        {/* Left: Copy */}
        <div className="relative z-10 w-full lg:w-1/2 text-center lg:text-left">
          {/* Accent badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bronze-600/10 border border-bronze-600/20 text-bronze-200 text-sm font-medium mb-6">
            <HiSparkles className="text-bronze-400" />
            India's Favourite Bookstore
          </div>

          <h1 className="animate-fade-in-up font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ animationDelay: '0.1s' }}>
            Discover Your Next
            <br />
            <span className="gradient-text">Great Read</span>
          </h1>

          <p className="animate-fade-in-up mt-5 text-base md:text-lg lg:text-xl text-zinc-400 leading-relaxed max-w-lg" style={{ animationDelay: '0.2s' }}>
            Uncover captivating stories, enriching knowledge, and endless inspiration
            in our curated collection of books.
          </p>

          <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/all-books"
              className="inline-flex items-center justify-center gap-2 text-white text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-600/25 hover:scale-105 transition-all duration-300"
            >
              Browse All Books
              <FaArrowRight className="text-sm" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 text-zinc-300 text-base font-medium border border-zinc-600 px-8 py-3.5 rounded-xl hover:border-bronze-500 hover:text-bronze-200 transition-all duration-300"
            >
              Create Free Account
            </Link>
          </div>

          {/* Social proof */}
          <div className="animate-fade-in-up mt-10 flex items-center gap-4 justify-center lg:justify-start" style={{ animationDelay: '0.5s' }}>
            <div className="flex -space-x-2">
              {['bg-blue-500', 'bg-bronze-500', 'bg-blue-400', 'bg-bronze-400'].map((bg, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-zinc-800`} />
              ))}
            </div>
            <p className="text-sm text-zinc-400">
              <span className="text-white font-semibold">50,000+</span> happy readers
            </p>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="relative z-10 w-full lg:w-1/2 flex justify-center items-center mt-10 lg:mt-0">
          <div className="relative">
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-bronze-500/20 rounded-3xl blur-3xl scale-75 animate-pulse-glow" />
            <img
              src={hero}
              alt="Books illustration"
              className="relative w-[80%] md:w-[75%] lg:w-[90%] max-w-[480px] object-contain drop-shadow-2xl animate-float mx-auto"
            />
          </div>
        </div>
      </div>

      <RecentlyAdded />
    </>
  );
};

export default Hero;
