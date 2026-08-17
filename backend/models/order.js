const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'User is required'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'book',
      required: [true, 'Book is required'],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
    },
    status: {
      type: String,
      default: 'Order Placed',
      enum: ['Order Placed', 'Out for delivery', 'Delivered', 'Cancelled'],
    },
    paymentMode: {
      type: String,
      enum: ['COD', 'ONLINE'],
      required: [true, 'Payment mode is required'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('order', orderSchema);
