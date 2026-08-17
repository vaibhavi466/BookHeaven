import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GrLanguage } from 'react-icons/gr';
import { FaHeart, FaRegHeart, FaShoppingCart, FaEdit, FaCheck } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import api from '../api/axios';
import Loader from '../components/Loader/Loader';
import AuthModal from '../components/AuthModal/AuthModal';

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // Cart/Favourite states
  const [isFavourite, setIsFavourite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'cart' or 'fav'

  useEffect(() => {
    let mounted = true;
    const fetchBook = async () => {
      try {
        const response = await api.get(`/get-book-by-id/${id}`);
        if (mounted) setBook(response.data?.data);
      } catch (error) {
        console.error('Failed to fetch book:', error);
        toast.error('Could not load book details.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBook();
    return () => { mounted = false; };
  }, [id]);

  // Sync Cart/Favourite active states
  useEffect(() => {
    let mounted = true;
    if (isLoggedIn && role === 'user' && id) {
      const checkStatus = async () => {
        try {
          const favRes = await api.get('/get-favourite-books');
          if (mounted) {
            const favs = favRes.data?.data || [];
            setIsFavourite(favs.some((b) => b._id === id));
          }

          const cartRes = await api.get('/get-user-cart');
          if (mounted) {
            const cartItems = cartRes.data?.data || [];
            setIsInCart(cartItems.some((item) => item._id === id));
          }
        } catch (err) {
          console.error('Failed to check status:', err);
        }
      };
      checkStatus();
    } else {
      setIsFavourite(false);
      setIsInCart(false);
    }
    return () => { mounted = false; };
  }, [id, isLoggedIn, role]);

  const handleFavourite = async () => {
    if (!isLoggedIn) {
      localStorage.setItem('pendingAction', JSON.stringify({ type: 'fav', bookId: id }));
      setPendingAction('fav');
      setShowAuthModal(true);
      return;
    }

    setActionLoading('fav');
    try {
      if (isFavourite) {
        // Toggle Off
        const response = await api.delete(`/remove-book-from-favourite/${id}`);
        setIsFavourite(false);
        toast.success(response.data?.message || 'Removed from favourites');
      } else {
        // Toggle On
        const response = await api.put('/add-book-to-favourite', {}, {
          headers: { bookid: id },
        });
        setIsFavourite(true);
        toast.success(response.data?.message || 'Added to favourites');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favourites');
    } finally {
      setActionLoading('');
    }
  };

  const handleCart = async () => {
    if (!isLoggedIn) {
      localStorage.setItem('pendingAction', JSON.stringify({ type: 'cart', bookId: id }));
      setPendingAction('cart');
      setShowAuthModal(true);
      return;
    }

    setActionLoading('cart');
    try {
      const response = await api.put(`/add-to-cart/${id}`);
      setIsInCart(true);
      toast.success(response.data?.message || 'Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setActionLoading('');
    }
  };

  const handleAuthSuccess = async () => {
    setShowAuthModal(false);
    localStorage.removeItem('pendingAction');

    if (pendingAction === 'fav') {
      setActionLoading('fav');
      try {
        const response = await api.put('/add-book-to-favourite', {}, {
          headers: { bookid: id },
        });
        setIsFavourite(true);
        toast.success(response.data?.message || 'Added to favourites');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to add to favourites');
      } finally {
        setActionLoading('');
        setPendingAction(null);
      }
    } else if (pendingAction === 'cart') {
      setActionLoading('cart');
      try {
        const response = await api.put(`/add-to-cart/${id}`);
        setIsInCart(true);
        toast.success(response.data?.message || 'Added to cart');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      } finally {
        setActionLoading('');
        setPendingAction(null);
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${book?.title}"? This cannot be undone.`)) return;
    setActionLoading('delete');
    try {
      const response = await api.delete(`/delete-book/${id}`);
      toast.success(response.data?.message || 'Book deleted');
      navigate('/all-books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center gap-4 text-zinc-400 animate-fade-in">
        <FaBookOpen className="text-5xl text-bronze-500 animate-pulse" />
        <p className="text-xl">Book not found.</p>
        <button
          onClick={() => navigate('/all-books')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to All Books
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-4 md:px-12 py-10 animate-fade-in">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        {/* Cover + Actions */}
        <div className="w-full md:w-2/5 flex flex-col items-center gap-6">
          <div className="bg-zinc-800 rounded-xl p-8 flex items-center justify-center w-full shadow-2xl transition-all duration-500 hover:shadow-blue-500/5 hover:-translate-y-1">
            <img
              src={book.url}
              alt={`Cover of ${book.title}`}
              className="h-[55vh] max-w-full object-contain rounded-lg shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x420?text=No+Cover';
              }}
            />
          </div>

          {/* User / Guest Actions */}
          {role !== 'admin' && (
            <div className="flex gap-4 w-full">
              <button
                onClick={handleFavourite}
                disabled={!!actionLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-500 active:scale-95 disabled:opacity-60 ${
                  isFavourite
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-900/30 hover:shadow-lg hover:shadow-red-500/25'
                    : 'bg-gradient-to-r from-bronze-600 to-bronze-700 hover:from-bronze-500 hover:to-bronze-600 text-white shadow-md shadow-bronze-900/30 hover:shadow-lg hover:shadow-bronze-500/25'
                }`}
              >
                {isFavourite ? <FaHeart className="animate-pulse" /> : <FaRegHeart />}
                {actionLoading === 'fav' ? 'Processing…' : isFavourite ? 'Favourited' : 'Favourite'}
              </button>
              <button
                onClick={handleCart}
                disabled={!!actionLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-500 active:scale-95 disabled:opacity-60 ${
                  isInCart
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 border border-blue-500'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                {isInCart ? <FaCheck /> : <FaShoppingCart />}
                {actionLoading === 'cart' ? 'Processing…' : isInCart ? 'In Cart' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Admin Actions */}
          {isLoggedIn && role === 'admin' && (
            <div className="flex gap-4 w-full">
              <button
                onClick={() => navigate(`/updateBook/${id}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-bronze-600 to-bronze-700 hover:from-bronze-500 hover:to-bronze-600 text-white rounded-xl font-semibold transition-all shadow-md shadow-bronze-900/20"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading === 'delete'}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-60"
              >
                <MdOutlineDelete className="text-xl" />
                {actionLoading === 'delete' ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="w-full md:w-3/5 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-zinc-100 leading-tight">{book.title}</h1>
          <p className="text-zinc-400 text-lg">by {book.author}</p>

          <div className="h-px bg-zinc-700 my-2" />

          <p className="text-zinc-300 text-base leading-7">{book.desc}</p>

          <div className="flex items-center gap-2 text-zinc-400 mt-2">
            <GrLanguage />
            <span>{book.language}</span>
          </div>

          <p className="text-3xl font-bold text-bronze-400 mt-4">
            ₹ {book.price}
          </p>

          {!isLoggedIn && (
            <p className="text-sm text-zinc-500 mt-2">
              <span
                className="text-blue-400 cursor-pointer hover:underline"
                onClick={() => {
                  localStorage.setItem('pendingAction', JSON.stringify({ type: 'cart', bookId: id }));
                  setPendingAction('cart');
                  setShowAuthModal(true);
                }}
              >
                Log in
              </span>{' '}
              to save this book to your cart or favourites.
            </p>
          )}
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setPendingAction(null);
            localStorage.removeItem('pendingAction');
          }}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default ViewBookDetails;
