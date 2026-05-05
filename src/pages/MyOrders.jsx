import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/myorders`,
          config,
        );
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        <p className="text-xs font-black text-blue-900 uppercase tracking-[0.2em]">
          Retrieving History
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
              Order History
            </h1>
            <div className="h-1.5 w-20 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            Showing {orders.length} past transactions
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-20 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
              No Orders Found
            </p>
            <p className="text-gray-400 mb-8 font-medium italic">
              Your bookshelf is waiting for its first addition.
            </p>
            <Link
              to="/"
              className="bg-blue-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-100 inline-block"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-500"
              >
                {/* Order Top Bar */}
                <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Order Placed
                      </p>
                      <p className="font-bold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Total Value
                      </p>
                      <p className="font-black text-blue-900">
                        {order.totalPrice.toFixed(2)} NPR
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Reference ID
                    </p>
                    <p className="font-mono text-xs text-gray-500 select-all">
                      #{order._id.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-8">
                  <div className="divide-y divide-gray-50">
                    {order.orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="py-4 first:pt-0 last:pb-0 flex justify-between items-center group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div>
                            <span className="font-black text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </span>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                              Quantity:{" "}
                              <span className="text-gray-900">{item.qty}</span>
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                          {(item.price * item.qty).toFixed(2)}{" "}
                          <span className="text-[10px] text-gray-400">NPR</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Status & Action */}
                  <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full animate-pulse ${order.isPaid ? "bg-green-500" : "bg-yellow-500"}`}
                      ></div>
                      <span
                        className={`text-xs font-black uppercase tracking-[0.2em] ${order.isPaid ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {order.isPaid
                          ? "Payment Verified"
                          : "Awaiting Processing"}
                      </span>
                    </div>

                    <Link
                      to={`/order/${order._id}`}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-black transition-colors"
                    >
                      View Invoice Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;