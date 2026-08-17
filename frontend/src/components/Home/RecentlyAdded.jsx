import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';
import ScrollReveal from '../ScrollReveal/ScrollReveal';

const RecentlyAdded = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchBooks = async () => {
      try {
        const response = await api.get('/get-recent-books');
        if (mounted) setBooks(response.data?.data || []);
      } catch (err) {
        console.error('Error fetching recent books:', err);
        if (mounted) setBooks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBooks();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="px-4 md:px-16 py-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-bronze-400 to-bronze-700 rounded-full" />
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">
            Recently Added
          </h2>
        </div>
        <button
          onClick={() => navigate('/all-books')}
          className="text-sm font-medium text-zinc-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 group"
        >
          View All
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
      </div>

      {loading && <Loader />}

      {!loading && books.length === 0 && (
        <p className="text-zinc-500 text-center text-lg py-10">No books available yet.</p>
      )}

      {!loading && books.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <ScrollReveal
              key={book._id}
              delay={index * 100}
            >
              <BookCard
                data={book}
                onClick={() => navigate(`/view-book-details/${book._id}`)}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentlyAdded;
