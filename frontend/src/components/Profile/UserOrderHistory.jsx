import React, { useEffect, useState } from 'react';
import { FaBoxOpen } from 'react-icons/fa';
import api from '../../api/axios';
import Loader from '../Loader/Loader';
import { STATUS_COLORS } from '../../constants/orderStatus';

const UserOrderHistory = () => {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/get-order-history');
        setOrders(response.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch order history:', error);
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  if (!orders) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-zinc-500">
        <FaBoxOpen className="text-6xl text-bronze-500/60" />
        <p className="text-2xl font-semibold">No Orders Yet</p>
        <p className="text-sm text-zinc-500">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold text-zinc-200 mb-6">
        Order History
        <span className="ml-3 text-lg text-zinc-400 font-normal">({orders.length})</span>
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-md"
          >
            {/* Book info */}
            <div className="flex gap-4 items-start">
              {order.book?.url && (
                <img
                  src={order.book.url}
                  alt={order.book.title}
                  className="h-24 w-16 object-cover rounded-lg bg-zinc-700 flex-shrink-0"
                />
              )}
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {order.book?.title || 'Book unavailable'}
                </h2>
                {order.book?.author && (
                  <p className="text-zinc-400 text-sm">by {order.book.author}</p>
                )}
                <p className="text-bronze-300 font-semibold mt-1">
                  ₹ {order.book?.price ?? '—'}
                  {order.quantity > 1 && (
                    <span className="text-zinc-400 text-sm font-normal ml-1">
                      × {order.quantity}
                    </span>
                  )}
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  Payment:{' '}
                  <span className="text-zinc-200">
                    {order.paymentMode === 'ONLINE' ? 'Online' : 'Cash on Delivery'}
                  </span>{' '}
                  —{' '}
                  <span
                    className={
                      order.paymentStatus === 'Paid' ? 'text-green-400' : 'text-bronze-400'
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </p>
                <p className="text-zinc-500 text-xs mt-1">
                  Ordered: {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <span
              className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold whitespace-nowrap ${STATUS_COLORS[order.status] || 'bg-zinc-600'}`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrderHistory;
