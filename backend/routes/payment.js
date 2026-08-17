const router = require('express').Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { authenticateToken } = require('../middleware/auth');

// ─────────────────────────────────────────────
// Credential validation helpers
// ─────────────────────────────────────────────

/**
 * Returns true when the key looks like a real Razorpay credential.
 * Razorpay live keys start with "rzp_live_" and test keys start with "rzp_test_"
 * followed by 14+ alphanumeric chars (no 'x' runs from placeholders).
 */
const isRealRazorpayKey = (key = '') =>
  /^rzp_(live|test)_[A-Za-z0-9]{14,}$/.test(key) && !key.includes('xxxx');

/**
 * Returns a descriptive error if Razorpay credentials are missing or
 * look like placeholder values.  Returns null when credentials look valid.
 */
const getRazorpayConfigError = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  if (!keyId || !keySecret) {
    return 'Razorpay credentials are not set. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.';
  }
  if (!isRealRazorpayKey(keyId) || keySecret.includes('xxxx')) {
    return 'Razorpay credentials are still placeholder values. Replace them with real keys from your Razorpay dashboard (https://dashboard.razorpay.com/app/keys).';
  }
  return null;
};

// Lazily instantiate Razorpay — throws at call-time when credentials are invalid
const getRazorpayInstance = () => {
  const configError = getRazorpayConfigError();
  if (configError) throw new Error(configError);
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// ─────────────────────────────────────────────
// GET /api/v1/razorpay-status  (Public)
// Always returns 200 — availability is in the body, not the status code.
// This prevents browser console errors when Razorpay is simply not configured.
// ─────────────────────────────────────────────
router.get('/razorpay-status', (_req, res) => {
  const configError = getRazorpayConfigError();
  return res.status(200).json({
    available: !configError,
    message: configError || 'Razorpay is configured and ready',
  });
});

// ─────────────────────────────────────────────
// POST /api/v1/create-razorpay-order
// ─────────────────────────────────────────────
router.post('/create-razorpay-order', authenticateToken, async (req, res) => {
  try {
    // Fast-fail if credentials aren't configured — return 503, not 500
    const configError = getRazorpayConfigError();
    if (configError) {
      return res.status(503).json({ status: 'error', message: configError });
    }

    const { amount } = req.body;
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'A valid positive amount is required',
      });
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100), // Convert ₹ to paise
      currency: 'INR',
      receipt: `bookheaven_${Date.now()}`,
    });

    return res.status(201).json({ status: 'success', data: order });
  } catch (error) {
    console.error('CREATE RAZORPAY ORDER ERROR:', error);

    // Razorpay API authentication failure (bad credentials)
    const isAuthError =
      error?.statusCode === 401 ||
      error?.error?.code === 'BAD_REQUEST_ERROR' ||
      (error?.message || '').toLowerCase().includes('authentication');

    return res.status(isAuthError ? 503 : 500).json({
      status: 'error',
      message: isAuthError
        ? 'Razorpay authentication failed. Verify your API keys in the .env file.'
        : error?.error?.description || error?.message || 'Failed to create payment order',
    });
  }
});

// ─────────────────────────────────────────────
// POST /api/v1/verify-razorpay-payment
// ─────────────────────────────────────────────
router.post('/verify-razorpay-payment', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        status: 'error',
        message: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required',
      });
    }

    const configError = getRazorpayConfigError();
    if (configError) {
      return res.status(503).json({ status: 'error', message: configError });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment signature verification failed',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully',
      data: { razorpay_order_id, razorpay_payment_id },
    });
  } catch (error) {
    console.error('VERIFY PAYMENT ERROR:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Payment verification failed',
    });
  }
});

module.exports = router;
