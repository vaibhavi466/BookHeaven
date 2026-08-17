import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import AllBooks from './pages/AllBooks';
import Cart from './pages/Cart';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import ViewBookDetails from './pages/ViewBookDetails';
import Profile from './pages/Profile';
import Favourites from './components/Profile/Favourites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Settings from './components/Profile/Settings';
import AllOrders from './pages/AllOrders';
import AddBook from './pages/AddBook';
import UpdateBook from './pages/UpdateBook';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';

// ── Route Guards ──────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return !isLoggedIn ? children : <Navigate to="/profile" replace />;
};

// Guard for admin-only routes: must be logged in AND have admin role
const AdminRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  const role = useSelector((state) => state.auth.role);

  return (
    <div className="bg-zinc-900 min-h-screen text-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/all-books" element={<AllBooks />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/view-book-details/:id" element={<ViewBookDetails />} />

          {/* Guest-only routes */}
          <Route path="/login" element={<GuestRoute><LogIn /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />

          {/* Auth-protected routes */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          {/* Admin-only: only admins may access the book update page */}
          <Route path="/updateBook/:id" element={<AdminRoute><UpdateBook /></AdminRoute>} />

          {/* Profile with nested role-based routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}>
            <Route index element={role === 'admin' ? <AllOrders /> : <Favourites />} />
            {role === 'admin' ? (
              <Route path="add-book" element={<AddBook />} />
            ) : (
              <Route path="orderHistory" element={<UserOrderHistory />} />
            )}
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={2500} theme="dark" pauseOnHover />
    </div>
  );
}

export default App;
