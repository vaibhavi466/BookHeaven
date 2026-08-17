import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowRightFromBracket, FaBars } from 'react-icons/fa6';
import { FaHeart, FaCog, FaClipboardList, FaPlusCircle } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { authActions } from '../../store/auth';

const Sidebar = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userLinks = [
    { to: '/profile', label: 'Favourites', icon: <FaHeart className="text-rose-400" /> },
    { to: '/profile/orderHistory', label: 'Order History', icon: <FiPackage className="text-blue-400" /> },
    { to: '/profile/settings', label: 'Settings', icon: <FaCog className="text-zinc-400" /> },
  ];

  const adminLinks = [
    { to: '/profile', label: 'All Orders', icon: <FaClipboardList className="text-blue-400" /> },
    { to: '/profile/add-book', label: 'Add Book', icon: <FaPlusCircle className="text-bronze-400" /> },
    { to: '/profile/settings', label: 'Settings', icon: <FaCog className="text-zinc-400" /> },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/');
  };

  return (
    <div
      className={`bg-zinc-800 text-white flex flex-col justify-between shadow-lg transition-all duration-300 rounded-xl
        ${isCollapsed ? 'w-[68px]' : 'w-full'} min-h-[88vh] overflow-hidden`}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-400 hover:text-white transition p-1 rounded"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      </div>

      {/* Avatar + Info */}
      {!isCollapsed && (
        <div className="flex flex-col items-center px-4 pb-6 mt-[-12px]">
          <img
            src={data?.avatar}
            alt="User avatar"
            className="h-16 w-16 rounded-full object-cover border-4 border-zinc-600"
          />
          <p className="mt-3 text-lg font-semibold text-center truncate max-w-[180px]">
            {data?.username}
          </p>
          <p className="text-xs text-zinc-400 text-center truncate max-w-[180px] mt-1">
            {data?.email}
          </p>
          <span className="mt-2 px-3 py-0.5 text-xs bg-blue-700 rounded-full capitalize">
            {role}
          </span>
          <div className="w-full mt-4 h-px bg-zinc-700" />
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-grow px-3 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 w-full py-2.5 px-3 rounded-lg font-medium transition-all text-sm
              ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {!isCollapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-5">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-2.5 px-3 flex items-center justify-center gap-2 bg-zinc-700 text-zinc-100 hover:bg-red-600 rounded-lg font-medium transition-all text-sm"
        >
          <FaArrowRightFromBracket />
          {!isCollapsed && 'Logout'}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-2xl w-full max-w-sm border border-zinc-700">
            <h2 className="text-lg font-bold mb-2">Confirm Logout</h2>
            <p className="mb-6 text-sm text-zinc-400">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <FaArrowRightFromBracket /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
