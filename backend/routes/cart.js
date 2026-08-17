const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Book = require('../models/book');
const { authenticateToken } = require('../middleware/auth');

// Resolve book ID from URL param, header, or body
const getBookId = (req) =>
  req.params.bookid || req.headers['bookid'] || req.body.bookId;

// ─────────────────────────────────────────────
// Shared add-to-cart logic
// ─────────────────────────────────────────────
const addToCartHandler = async (req, res) => {
  try {
    const bookId = getBookId(req);

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ status: 'error', message: 'A valid book ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Book not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const existingItem = user.cart.find((item) => item.book.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ book: bookId, quantity: 1 });
    }

    await user.save();
    return res.status(200).json({ status: 'success', message: 'Book added to cart' });
  } catch (error) {
    console.error('ADD TO CART ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

// ─────────────────────────────────────────────
// PUT /api/v1/add-to-cart
// PUT /api/v1/add-to-cart/:bookid
// ─────────────────────────────────────────────
router.put('/add-to-cart', authenticateToken, addToCartHandler);
router.put('/add-to-cart/:bookid', authenticateToken, addToCartHandler);

// ─────────────────────────────────────────────
// PUT /api/v1/decrease-cart-quantity/:bookid
// ─────────────────────────────────────────────
router.put('/decrease-cart-quantity/:bookid', authenticateToken, async (req, res) => {
  try {
    const bookId = getBookId(req);

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ status: 'error', message: 'A valid book ID is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const cartItem = user.cart.find((item) => item.book.toString() === bookId);
    if (!cartItem) {
      return res.status(404).json({ status: 'error', message: 'Book not found in cart' });
    }

    if (cartItem.quantity <= 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Minimum quantity is 1. Use remove to delete the item.',
      });
    }

    cartItem.quantity -= 1;

    await user.save();
    return res.status(200).json({ status: 'success', message: 'Cart quantity updated' });
  } catch (error) {
    console.error('DECREASE CART QUANTITY ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/v1/delete-from-cart/:bookid
// ─────────────────────────────────────────────
router.put('/delete-from-cart/:bookid', authenticateToken, async (req, res) => {
  try {
    const bookId = getBookId(req);

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ status: 'error', message: 'A valid book ID is required' });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { cart: { book: bookId } },
    });

    return res.status(200).json({ status: 'success', message: 'Book removed from cart' });
  } catch (error) {
    console.error('DELETE FROM CART ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/v1/get-user-cart
// ─────────────────────────────────────────────
router.get('/get-user-cart', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.book');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Filter out any orphaned cart entries where the book was deleted
    const cartItems = user.cart
      .filter((item) => item.book)
      .map((item) => ({
        _id: item.book._id,
        title: item.book.title,
        author: item.book.author,
        desc: item.book.desc,
        language: item.book.language,
        price: item.book.price,
        url: item.book.url,
        quantity: item.quantity,
      }))
      .reverse();

    return res.status(200).json({ status: 'success', data: cartItems });
  } catch (error) {
    console.error('GET CART ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;
