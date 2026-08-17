import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaBars, FaTimes } from 'react-icons/fa';
import { authActions } from '../../store/auth';
import logo from '../../assets/book.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn ?? false);
  const role = useSelector((state) => state.auth?.role ?? 'user');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const userLinks = [
    { title: 'Home', link: '/' },
    { title: 'All Books', link: '/all-books' },
    { title: 'Cart', link: '/cart' },
    { title: 'Profile', link: '/profile' },
    { title: 'About Us', link: '/about-us' },
  ];

  const adminLinks = [
    { title: 'Home', link: '/' },
    { title: 'All Books', link: '/all-books' },
    { title: 'Add Book', link: '/profile/add-book' },
    { title: 'Admin Panel', link: '/profile' },
  ];

  const guestLinks = [
    { title: 'Home', link: '/' },
    { title: 'All Books', link: '/all-books' },
    { title: 'About Us', link: '/about-us' },
  ];

  const links = isLoggedIn ? (role === 'admin' ? adminLinks : userLinks) : guestLinks;

  const handleLogout = () => {
    dispatch(authActions.logout());
    closeMenu();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-1 text-sm font-medium transition-all duration-300 hover:text-blue-400 ${
      isActive ? 'text-blue-400' : 'text-zinc-300'
    } group`;

  return (
    <nav className="glass-strong sticky top-0 z-50 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
          <img
            className="h-10 sm:h-11 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]"
            src={logo}
            alt="BookHeaven logo"
          />
          <span className="text-xl sm:text-2xl font-bold tracking-tight">
            Book<span className="gradient-text">Heaven</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-7">
          {links.map((item) => (
            <NavLink key={item.link} to={item.link} end={item.link === '/'} className={navLinkClass}>
              {item.title}
              {/* Active indicator dot */}
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400 opacity-0 group-[.text-blue-400]:opacity-100 transition-opacity duration-300" />
              {/* Hover underline */}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-violet-400 transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}

          {!isLoggedIn ? (
            <div className="flex gap-3 ml-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-medium border border-zinc-600 text-zinc-300 rounded-lg hover:border-blue-400 hover:text-blue-400 transition-all duration-300"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="ml-3 px-5 py-2 text-sm font-medium bg-zinc-700/80 hover:bg-red-600 text-zinc-200 hover:text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-zinc-300 hover:text-white text-xl focus:outline-none transition-colors p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden animate-slide-down border-t border-zinc-700/50 px-6 pb-5 pt-4 flex flex-col gap-3">
          {links.map((item) => (
            <NavLink
              key={item.link}
              to={item.link}
              end={item.link === '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-400 bg-blue-400/10'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}

          {!isLoggedIn ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-700/50">
              <Link
                to="/login"
                onClick={closeMenu}
                className="px-4 py-2.5 text-sm font-medium border border-zinc-600 text-zinc-300 rounded-lg hover:border-blue-400 hover:text-blue-400 transition-all text-center"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all text-center"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-1 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
