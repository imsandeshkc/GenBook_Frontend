import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
              Shopping Bag
            </h1>
            <div className="h-1.5 w-20 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
            {cart.length} Items in your bag
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-20 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
              Your bag is empty
            </p>
            <p className="text-gray-400 mb-8 font-medium">
              Looks like you haven't added any books to your collection yet.
            </p>
            <Link
              to="/"
              className="bg-blue-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-100 inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* List of Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-xl hover:border-blue-100"
                >
                  {/* Book Image from Cloudinary */}
                  <div className="w-24 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/100x150?text=Cover"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <h2 className="text-xl font-black text-gray-900 mt-2 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-gray-400 text-sm font-medium italic mb-2">
                      by {item.author}
                    </p>
                    <p className="text-blue-600 font-black text-lg">
                      {item.price} NPR
                    </p>
                  </div>

                  <div className="flex items-center gap-6 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          item.qty > 1
                            ? addToCart(item, -1)
                            : removeFromCart(item._id)
                        }
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 font-black hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
                      >
                        -
                      </button>

                      <span className="w-10 text-center font-black text-gray-900 text-lg">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => addToCart(item, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 font-black hover:bg-green-50 hover:text-green-600 transition-all active:scale-90"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Item Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove from bag"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  onClick={clearCart}
                  className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-[0.2em] transition-colors py-4 px-8 border border-dashed border-gray-200 rounded-2xl hover:border-red-200"
                >
                  Empty Shopping Bag
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 sticky top-8">
              <div className="bg-blue-900 p-8 rounded-[2rem] shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20"></div>

                <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter border-b border-blue-800 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-blue-300 font-bold uppercase text-[10px] tracking-widest">
                    <span>Subtotal</span>
                    <span>{cartTotal.toFixed(2)} NPR</span>
                  </div>
                  <div className="flex justify-between text-blue-300 font-bold uppercase text-[10px] tracking-widest">
                    <span>Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-blue-800">
                    <span className="text-xs font-black uppercase tracking-widest">
                      Total Amount
                    </span>
                    <span className="text-3xl font-black text-white">
                      {cartTotal.toFixed(2)}{" "}
                      <span className="text-sm">NPR</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-white text-blue-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black hover:text-white transition-all active:scale-95"
                >
                  Secure Checkout
                </button>

                <div className="mt-8 flex items-center justify-center gap-2 text-blue-400 opacity-60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Encrypted Payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;