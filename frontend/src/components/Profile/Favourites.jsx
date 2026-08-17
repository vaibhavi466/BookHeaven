import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillDelete } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import api from '../../api/axios';
import Loader from '../Loader/Loader';
import BookCard from '../BookCard/BookCard';

const Favourites = () => {
  const [books, setBooks] = useState(null);
  const navigate = useNavigate();

  const fetchFavourites = async () => {
    try {
      const response = await api.get('/get-favourite-books');
      setBooks(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch favourites:', error);
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const removeFromFavourites = async (bookId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/remove-book-from-favourite/${bookId}`);
      toast.success('Removed from favourites');
      fetchFavourites();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove from favourites');
    }
  };

  if (!books) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-zinc-500">
        <FaHeart className="text-6xl text-zinc-700 animate-pulse" />
        <p className="text-2xl font-semibold">No Favourite Books Yet</p>
        <button
          onClick={() => navigate('/all-books')}
          className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all text-sm shadow-md shadow-blue-900/30"
        >
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold text-zinc-200 mb-6">
        Favourite Books
        <span className="ml-3 text-lg text-zinc-400 font-normal">({books.length})</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book._id} className="relative group">
            <BookCard
              data={book}
              onClick={() => navigate(`/view-book-details/${book._id}`)}
            />
            <button
              onClick={(e) => removeFromFavourites(book._id, e)}
              className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
              title="Remove from favourites"
            >
              <AiFillDelete className="text-sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
