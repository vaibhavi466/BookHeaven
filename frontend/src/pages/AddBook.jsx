import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const INITIAL_FORM = {
  url: '',
  title: '',
  author: '',
  price: '',
  desc: '',
  language: '',
};

const AddBook = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { url, title, author, price, desc, language } = formData;
    if (!url.trim()) { toast.error('Cover image URL is required.'); return false; }
    if (!title.trim() || title.trim().length < 2) { toast.error('Title must be at least 2 characters.'); return false; }
    if (!author.trim()) { toast.error('Author name is required.'); return false; }
    if (!price || isNaN(Number(price)) || Number(price) < 0) { toast.error('A valid positive price is required.'); return false; }
    if (!desc.trim() || desc.trim().length < 10) { toast.error('Description must be at least 10 characters.'); return false; }
    if (!language.trim()) { toast.error('Language is required.'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      const response = await api.post('/add-book', {
        ...formData,
        price: Number(formData.price),
        url: formData.url.trim(),
        title: formData.title.trim(),
        author: formData.author.trim(),
        desc: formData.desc.trim(),
        language: formData.language.trim(),
      });
      toast.success(response.data?.message || 'Book added successfully!');
      setFormData(INITIAL_FORM);
      setPreview(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-bronze-500 transition';

  return (
    <div className="p-4 text-zinc-100 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-200 mb-2">Add New Book</h1>
      <p className="text-zinc-400 text-sm mb-8">Fill in the details below to add a book to the catalogue.</p>

      <form onSubmit={handleSubmit} className="bg-zinc-800 rounded-xl border border-zinc-700 p-6 shadow-lg space-y-5">
        {/* Cover URL + Preview toggle */}
        <div>
          <label htmlFor="url" className="block text-sm text-zinc-400 mb-1">
            Cover Image URL <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            <input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
              className={inputClass}
            />
            {formData.url && (
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="px-3 py-2 text-sm bg-zinc-600 hover:bg-zinc-500 rounded-lg whitespace-nowrap transition"
              >
                {preview ? 'Hide' : 'Preview'}
              </button>
            )}
          </div>
          {preview && formData.url && (
            <img
              src={formData.url}
              alt="Cover preview"
              className="mt-3 h-36 w-auto rounded-lg object-contain border border-zinc-600 bg-zinc-900"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/120x180?text=Invalid+URL'; }}
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm text-zinc-400 mb-1">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Book title"
            className={inputClass}
          />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm text-zinc-400 mb-1">
            Author <span className="text-red-400">*</span>
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name"
            className={inputClass}
          />
        </div>

        {/* Price + Language row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="price" className="block text-sm text-zinc-400 mb-1">
              Price (₹) <span className="text-red-400">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 499"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="language" className="block text-sm text-zinc-400 mb-1">
              Language <span className="text-red-400">*</span>
            </label>
            <input
              id="language"
              name="language"
              type="text"
              value={formData.language}
              onChange={handleChange}
              placeholder="e.g. English, Hindi"
              className={inputClass}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="desc" className="block text-sm text-zinc-400 mb-1">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="desc"
            name="desc"
            rows={5}
            value={formData.desc}
            onChange={handleChange}
            placeholder="Write a brief description of the book (min 10 characters)…"
            className={`${inputClass} resize-y`}
          />
          <p className="text-xs text-zinc-500 mt-1 text-right">{formData.desc.length} characters</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => { setFormData(INITIAL_FORM); setPreview(false); }}
            className="px-5 py-2.5 text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg transition"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-7 py-2.5 text-sm font-semibold bg-gradient-to-r from-bronze-600 to-bronze-700 hover:from-bronze-500 hover:to-bronze-600 text-white rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-bronze-900/20"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? 'Adding…' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
