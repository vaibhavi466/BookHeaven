const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Book cover image URL is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    desc: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('book', bookSchema);
