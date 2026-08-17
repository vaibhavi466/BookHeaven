const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./conn/conn');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1000;

// ─── Database ─────────────────────────────────
connectDB();

// ─── Core Middleware ──────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'success', message: 'BookHeaven API is running' });
});

// ─── API Routes ───────────────────────────────
app.use('/api/v1', require('./routes/user'));
app.use('/api/v1', require('./routes/book'));
app.use('/api/v1', require('./routes/favourite'));
app.use('/api/v1', require('./routes/cart'));
app.use('/api/v1', require('./routes/order'));
app.use('/api/v1', require('./routes/payment'));

// ─── 404 Handler ──────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────
app.listen(PORT, () => {
  console.log(`BookHeaven API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
