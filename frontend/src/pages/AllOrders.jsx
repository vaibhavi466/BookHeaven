import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaClipboardList } from 'react-icons/fa';
import api from '../api/axios';
import Loader from '../components/Loader/Loader';
import { ORDER_STATUSES, STATUS_COLORS } from '../constants/orderStatus';


const AllOrders = () => {
  const [orders, setOrders] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/get-all-orders');
        setOrders(response.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error(error.response?.data?.message || 'Failed to load orders');
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await api.put(`/update-status/${orderId}`, { status: newStatus });
      toast.success(response.data?.message || 'Status updated');
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!orders) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <Loader />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-zinc-500">
        <FaClipboardList className="text-6xl text-bronze-500/60" />
        <p className="text-2xl font-semibold">No Orders Yet</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold text-zinc-200 mb-6">
        All Orders
        <span className="ml-3 text-lg text-zinc-400 font-normal">({orders.length})</span>
      </h1>

      <div className="overflow-x-auto rounded-xl border border-zinc-700 shadow-xl">
        <table className="w-full text-sm text-zinc-200">
          <thead className="bg-zinc-700 text-zinc-300 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Book</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className="border-b border-zinc-700 hover:bg-zinc-800/60 transition-colors"
              >
                <td className="px-4 py-3 text-zinc-400">{index + 1}</td>

                {/* Book */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-[160px]">
                    {order.book?.url && (
                      <img
                        src={order.book.url}
                        alt={order.book.title}
                        className="h-12 w-9 object-cover rounded bg-zinc-700 flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="font-medium text-zinc-100 line-clamp-1">
                        {order.book?.title || 'N/A'}
                      </p>
                      <p className="text-xs text-zinc-400">{order.book?.author}</p>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-100">{order.user?.username || 'N/A'}</p>
                  <p className="text-xs text-zinc-400">{order.user?.email}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{order.user?.address}</p>
                </td>

                {/* Price */}
                <td className="px-4 py-3 font-semibold text-bronze-300 whitespace-nowrap">
                  ₹{order.book?.price ?? '—'}
                  {order.quantity > 1 && (
                    <span className="text-zinc-400 text-xs ml-1">×{order.quantity}</span>
                  )}
                </td>

                {/* Payment */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="text-zinc-200">{order.paymentMode === 'ONLINE' ? 'Online' : 'COD'}</p>
                  <p className={`text-xs mt-0.5 ${order.paymentStatus === 'Paid' ? 'text-green-400' : 'text-bronze-400'}`}>
                    {order.paymentStatus}
                  </p>
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-zinc-400 whitespace-nowrap text-xs">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </td>

                {/* Status Dropdown */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${STATUS_COLORS[order.status] || 'bg-zinc-500'}`}
                    />
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="bg-zinc-700 border border-zinc-600 text-zinc-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 cursor-pointer"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {updatingId === order._id && (
                      <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
