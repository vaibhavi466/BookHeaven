import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillDelete } from 'react-icons/ai';
import { FaShoppingCart, FaLock, FaTruck, FaCreditCard } from 'react-icons/fa';
import api from '../api/axios';
import Loader from '../components/Loader/Loader';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [paymentMode, setPaymentMode] = useState('COD');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get('/get-user-cart');
      setCart(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalItems = cart?.reduce((sum, item) => sum + Number(item.quantity || 1), 0) ?? 0;
  const totalPrice = cart?.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0) ?? 0;

  const increaseQuantity = async (bookId) => {
    try {
      await api.put(`/add-to-cart/${bookId}`);
      await fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to increase quantity');
    }
  };

  const decreaseQuantity = async (bookId) => {
    try {
      await api.put(`/decrease-cart-quantity/${bookId}`);
      await fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to decrease quantity');
    }
  };

  const deleteItem = async (bookId) => {
    try {
      await api.put(`/delete-from-cart/${bookId}`);
      await fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove book');
    }
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const placeCodOrder = async () => {
    const res = await api.post('/place-order', { order: cart, paymentMode: 'COD' });
    toast.success(res.data?.message || 'Order placed successfully');
    navigate('/profile/orderHistory');
  };

  const placeOnlineOrder = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Razorpay failed to load. Check your internet connection.');
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      toast.error('Razorpay key is not configured.');
      return;
    }

    const orderRes = await api.post('/create-razorpay-order', { amount: totalPrice });
    const razorpayOrder = orderRes.data?.data;

    const options = {
      key,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'BookHeaven',
      description: 'Book purchase',
      order_id: razorpayOrder.id,
      handler: async (response) => {
        try {
          const verifyRes = await api.post('/verify-razorpay-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data?.status === 'success') {
            const placeRes = await api.post('/place-order', {
              order: cart,
              paymentMode: 'ONLINE',
              paymentStatus: 'Paid',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            toast.success(placeRes.data?.message || 'Payment successful! Order placed.');
            navigate('/profile/orderHistory');
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Payment verification failed');
        }
      },
      theme: { color: '#2563eb' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) {
      toast.warn('Your cart is empty.');
      return;
    }
    try {
      setIsPlacingOrder(true);
      if (paymentMode === 'COD') {
        await placeCodOrder();
      } else {
        await placeOnlineOrder();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Loading state
  if (cart === null) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
        <div className="text-center bg-zinc-800 border border-zinc-700 rounded-2xl p-10 shadow-xl max-w-md w-full">
          <FaShoppingCart className="text-6xl text-zinc-600 mx-auto" />
          <h1 className="text-4xl font-bold text-zinc-300 mt-6 mb-3">Your Cart is Empty</h1>
          <p className="text-zinc-400 mb-8">Browse our collection and add some books!</p>
          <button
            onClick={() => navigate('/all-books')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 px-4 sm:px-8 lg:px-16 py-12">
      <h1 className="text-4xl font-bold text-zinc-100 mb-8">
        Your Cart{' '}
        <span className="text-2xl text-zinc-400 font-normal">
          ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_0.8fr] gap-8 items-start">
        {/* Cart Items */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-zinc-700 bg-zinc-750">
            <h2 className="text-xl font-semibold">Cart Items</h2>
          </div>

          {cart.map((item, index) => {
            const qty = Number(item.quantity || 1);
            const itemTotal = Number(item.price || 0) * qty;

            return (
              <div
                key={item._id || index}
                className="flex flex-col lg:flex-row border-b border-zinc-700 last:border-b-0 p-5 gap-5"
              >
                {/* Image + Info */}
                <div className="flex gap-4 flex-grow">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-24 h-36 object-cover rounded-lg bg-zinc-700 flex-shrink-0 shadow"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/96x144?text=Cover'; }}
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-zinc-100">{item.title}</h3>
                    <p className="text-zinc-400 text-sm">by {item.author}</p>
                    <p className="text-zinc-300 text-sm mt-2 line-clamp-2">{item.desc}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedBook(item)}
                      className="text-left text-blue-400 hover:text-blue-300 mt-1 text-xs"
                    >
                      Show details
                    </button>
                  </div>
                </div>

                {/* Price + Qty + Remove */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-zinc-400">Price</p>
                    <p className="text-lg font-semibold text-bronze-300">₹{item.price}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-zinc-400 mb-1">Qty</p>
                    <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item._id)}
                        disabled={qty === 1}
                        className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition text-lg"
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 bg-zinc-800 min-w-[40px] text-center">{qty}</span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item._id)}
                        className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 transition text-lg"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-bronze-400/70 mt-1">₹{itemTotal} total</p>
                  </div>

                  <button
                    onClick={() => deleteItem(item._id)}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Remove from cart"
                  >
                    <AiFillDelete className="text-xl" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="xl:sticky xl:top-24">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

            <div className="space-y-3 border-t border-zinc-700 pt-4">
              <div className="flex justify-between text-zinc-300">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
            </div>

            <div className="border-t border-zinc-600 mt-4 pt-4 flex justify-between items-center">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-bold text-bronze-300">₹{totalPrice}</span>
            </div>

            {/* Payment Mode */}
            <div className="mt-6">
              <h3 className="text-base font-semibold mb-3">Payment Method</h3>
              <div className="space-y-2">
                {[
                  { value: 'COD', label: 'Cash on Delivery', icon: <FaTruck /> },
                  { value: 'ONLINE', label: 'Online Payment (Razorpay)', icon: <FaCreditCard /> },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 cursor-pointer text-sm p-3 rounded-lg border transition-all
                      ${
                        paymentMode === opt.value
                          ? 'border-blue-500 bg-blue-500/10 text-zinc-100'
                          : 'border-zinc-600 text-zinc-200 hover:border-blue-500'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      value={opt.value}
                      checked={paymentMode === opt.value}
                      onChange={() => setPaymentMode(opt.value)}
                      className="accent-blue-500"
                    />
                    {opt.icon} {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isPlacingOrder}
              className="mt-6 w-full py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPlacingOrder && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isPlacingOrder ? 'Processing…' : paymentMode === 'COD' ? 'Place Order' : 'Pay Online'}
            </button>

            <p className="mt-4 text-center text-zinc-500 text-xs flex items-center justify-center gap-1.5">
              <FaLock className="text-[10px]" /> Secure Checkout
            </p>
          </div>
        </div>
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="bg-zinc-800 border border-zinc-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-5 text-zinc-400 hover:text-white text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={selectedBook.url}
                alt={selectedBook.title}
                className="w-36 h-52 object-cover rounded-lg bg-zinc-700 flex-shrink-0"
              />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedBook.title}</h2>
                <p className="text-zinc-400 text-sm mb-1">Author: <span className="text-zinc-200">{selectedBook.author}</span></p>
                <p className="text-zinc-400 text-sm mb-1">Language: <span className="text-zinc-200">{selectedBook.language}</span></p>
                <p className="text-zinc-400 text-sm mb-3">Price: <span className="text-bronze-300 font-semibold">₹{selectedBook.price}</span></p>
                <p className="text-zinc-300 text-sm leading-6">{selectedBook.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
