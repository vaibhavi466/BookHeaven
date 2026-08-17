const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Book = require('../models/book');
const { authenticateToken } = require('../middleware/auth');

// Resolve book ID from params, headers, or body — params take priority for RESTful routes
const getBookId = (req) =>
  req.params.bookid || req.headers['bookid'] || req.body.bookId;

// ─────────────────────────────────────────────
// PUT /api/v1/add-book-to-favourite
// ─────────────────────────────────────────────
router.put('/add-book-to-favourite', authenticateToken, async (req, res) => {
  try {
    const bookId = getBookId(req);

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ status: 'error', message: 'A valid book ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Book not found' });
    }

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { favourites: bookId } });
    return res.status(200).json({ status: 'success', message: 'Book added to favourites' });
  } catch (error) {
    console.error('ADD TO FAVOURITE ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/v1/remove-book-from-favourite/:bookid
// ─────────────────────────────────────────────
router.delete('/remove-book-from-favourite/:bookid', authenticateToken, async (req, res) => {
  try {
    const bookId = getBookId(req);

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ status: 'error', message: 'A valid book ID is required' });
    }

    await User.findByIdAndUpdate(req.user.id, { $pull: { favourites: bookId } });
    return res.status(200).json({ status: 'success', message: 'Book removed from favourites' });
  } catch (error) {
    console.error('REMOVE FROM FAVOURITE ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/v1/get-favourite-books
// ─────────────────────────────────────────────
router.get('/get-favourite-books', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favourites');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    return res.status(200).json({ status: 'success', data: user.favourites });
  } catch (error) {
    console.error('GET FAVOURITES ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;
