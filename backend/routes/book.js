const router = require('express').Router();
const Book = require('../models/book');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// ─────────────────────────────────────────────
// Shared validation middleware
// ─────────────────────────────────────────────
const validateBookPayload = (req, res, next) => {
  const { url, title, author, price, desc, language } = req.body;

  if (!url || !title || !author || price === undefined || !desc || !language) {
    return res.status(400).json({
      status: 'error',
      message: 'All book fields are required: url, title, author, price, desc, language',
    });
  }

  const trimmedTitle = String(title).trim();
  const trimmedDesc = String(desc).trim();
  const numericPrice = Number(price);

  if (trimmedTitle.length < 2) {
    return res.status(400).json({
      status: 'error',
      message: 'Book title must be at least 2 characters long',
    });
  }
  if (trimmedDesc.length < 10) {
    return res.status(400).json({
      status: 'error',
      message: 'Book description must be at least 10 characters long',
    });
  }
  if (!Number.isFinite(numericPrice)) {
    return res.status(400).json({ status: 'error', message: 'Price must be a valid number' });
  }
  if (numericPrice < 0) {
    return res.status(400).json({ status: 'error', message: 'Price cannot be negative' });
  }

  // Sanitize body
  req.body = {
    url: String(url).trim(),
    title: trimmedTitle,
    author: String(author).trim(),
    price: numericPrice,
    desc: trimmedDesc,
    language: String(language).trim(),
  };

  return next();
};

// ─────────────────────────────────────────────
// POST /api/v1/add-book  (Admin only)
// ─────────────────────────────────────────────
router.post('/add-book', authenticateToken, requireAdmin, validateBookPayload, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Book added successfully',
      data: book,
    });
  } catch (error) {
    console.error('ADD BOOK ERROR:', error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ status: 'error', message });
    }
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/v1/update-book/:id  (Admin only)
// ─────────────────────────────────────────────
router.put('/update-book/:id', authenticateToken, requireAdmin, validateBookPayload, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Book not found' });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    console.error('UPDATE BOOK ERROR:', error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ status: 'error', message });
    }
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/v1/delete-book/:id  (Admin only)
// ─────────────────────────────────────────────
router.delete('/delete-book/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Book not found' });
    }
    return res.status(200).json({ status: 'success', message: 'Book deleted successfully' });
  } catch (error) {
    console.error('DELETE BOOK ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/v1/get-all-books  (Public)
// ─────────────────────────────────────────────
router.get('/get-all-books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: 'success', data: books });
  } catch (error) {
    console.error('GET ALL BOOKS ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/v1/get-recent-books  (Public)
// ─────────────────────────────────────────────
router.get('/get-recent-books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json({ status: 'success', data: books });
  } catch (error) {
    console.error('GET RECENT BOOKS ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/v1/get-book-by-id/:id  (Public)
// ─────────────────────────────────────────────
router.get('/get-book-by-id/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Book not found' });
    }
    return res.status(200).json({ status: 'success', data: book });
  } catch (error) {
    console.error('GET BOOK BY ID ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;
