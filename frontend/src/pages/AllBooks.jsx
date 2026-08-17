import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import api from '../api/axios';
import Loader from '../components/Loader/Loader';
import BookCard from '../components/BookCard/BookCard';

const AllBooks = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchBooks = async () => {
      try {
        const response = await api.get('/get-all-books');
        const books = response.data?.data || [];
        if (mounted) {
          setAllBooks(books);
          setFiltered(books);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        if (mounted) { setAllBooks([]); setFiltered([]); }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBooks();
    return () => { mounted = false; };
  }, []);

  // Live search filter
  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(allBooks);
    } else {
      setFiltered(
        allBooks.filter(
          (b) =>
            b.title?.toLowerCase().includes(q) ||
            b.author?.toLowerCase().includes(q) ||
            b.language?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, allBooks]);

  return (
    <div className="min-h-screen bg-zinc-900 px-4 sm:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">
          All Books
          {!loading && (
            <span className="ml-3 text-lg text-zinc-400 font-normal">
              ({filtered.length})
            </span>
          )}
        </h1>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, author or language…"
          className="w-full sm:w-72 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-100 placeholder-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {loading && <Loader />}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-500">
          <FaBookOpen className="text-5xl text-bronze-500/60" />
          <p className="text-xl font-semibold">
            {search ? 'No books match your search.' : 'No books available yet.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-sm text-blue-400 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((book) => (
            <BookCard
              key={book._id}
              data={book}
              onClick={() => navigate(`/view-book-details/${book._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
