const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [4, 'Username must be at least 4 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png',
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
      },
    ],
    cart: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'book',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);
