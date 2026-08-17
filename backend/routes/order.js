const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const VALID_STATUSES = ['Order Placed', 'Out for delivery', 'Delivered', 'Cancelled'];

// ─────────────────────────────────────────────
// POST /api/v1/place-order
// ─────────────────────────────────────────────
router.post('/place-order', authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { order, paymentMode = 'COD', paymentStatus, razorpayOrderId, razorpayPaymentId } = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Order must contain at least one item',
      });
    }

    if (!['COD', 'ONLINE'].includes(paymentMode)) {
      return res.status(400).json({ status: 'error', message: 'Invalid payment mode' });
    }

    // Online orders must come with verified Razorpay details
    if (paymentMode === 'ONLINE' && (!razorpayOrderId || !razorpayPaymentId || paymentStatus !== 'Paid')) {
      return res.status(400).json({
        status: 'error',
        message: 'Verified Razorpay payment details are required for online orders',
      });
    }

    const finalPaymentStatus = paymentMode === 'ONLINE' ? 'Paid' : 'Pending';
    const createdOrders = [];

    await session.withTransaction(async () => {
      for (const item of order) {
        const bookId = item._id || item.bookId || item.book || item;
        const quantity = Number(item.quantity || 1);

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
          throw new Error(`Invalid book ID: ${bookId}`);
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error('Order quantity must be a positive integer');
        }

        const newOrder = await Order.create(
          [
            {
              user: req.user.id,
              book: bookId,
              quantity,
              paymentMode,
              paymentStatus: finalPaymentStatus,
              razorpayOrderId: paymentMode === 'ONLINE' ? razorpayOrderId : null,
              razorpayPaymentId: paymentMode === 'ONLINE' ? razorpayPaymentId : null,
            },
          ],
          { session }
        );
        createdOrders.push(newOrder[0]);
      }

      // Push order IDs to user and clear cart atomically
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: { orders: { $each: createdOrders.map((o) => o._id) } },
          $set: { cart: [] },
        },
        { session }
      );
    });

    return res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      data: createdOrders,
    });
  } catch (error) {
    console.error('PLACE ORDER ERROR:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal Server Error',
    });
  } finally {
    session.endSession();
  }
});

// ─────────────────────────────────────────────
// GET /api/v1/get-order-history  (User)
// ─────────────────────────────────────────────
router.get('/get-order-history', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('book')
      .sort({ createdAt: -1 });

    return res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    console.error('GET ORDER HISTORY ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/v1/get-all-orders  (Admin)
// ─────────────────────────────────────────────
router.get('/get-all-orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('book')
      .populate('user', 'username email address')
      .sort({ createdAt: -1 });

    return res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    console.error('GET ALL ORDERS ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/v1/update-status/:id  (Admin)
// ─────────────────────────────────────────────
router.put('/update-status/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('UPDATE ORDER STATUS ERROR:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;
