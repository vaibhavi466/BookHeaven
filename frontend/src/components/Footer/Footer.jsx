import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-800/50 text-zinc-400 border-t border-zinc-700/50">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bronze-600/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              Book<span className="gradient-text">Heaven</span>
            </h3>
            <p className="text-sm leading-6 text-zinc-500 max-w-xs">
              Your one-stop destination for discovering, saving, and purchasing books you'll love.
              Made with care in India.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: FaGithub, href: '#', label: 'GitHub' },
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-bronze-400 hover:bg-zinc-600 transition-all duration-300"
                >
                  <social.icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/all-books', label: 'All Books' },
                { to: '/about-us', label: 'About Us' },
                { to: '/signup', label: 'Create Account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-zinc-500 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li className="flex items-center gap-2.5">
                <FaEnvelope className="text-bronze-600 text-xs flex-shrink-0" />
                support@bookheaven.com
              </li>
              <li className="flex items-center gap-2.5">
                <FaMapMarkerAlt className="text-bronze-600 text-xs flex-shrink-0" />
                New Delhi, India
              </li>
              <li className="flex items-center gap-2.5">
                <FaClock className="text-bronze-600 text-xs flex-shrink-0" />
                Mon – Sat, 9AM – 6PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-zinc-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            &copy; {year} BookHeaven. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-zinc-600">
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
