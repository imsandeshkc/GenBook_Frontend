import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-black tracking-widest hover:text-blue-200 transition"
        >
          GENBOOK.
        </Link>

        {/* MOBILE MENU BUTTON (Hamburger) */}
        <button
          className="md:hidden block text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>

        {/* DESKTOP MENU (Hidden on Mobile) */}
        <div className="hidden md:flex gap-6 items-center">
          {user && user.isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-bold text-blue-200 hover:text-white transition uppercase tracking-widest"
            >
              Admin
            </Link>
          )}
          <Link
            to="/cart"
            className="bg-blue-600 px-5 py-2 rounded-lg font-bold hover:bg-blue-500 transition flex items-center"
          >
            Cart{" "}
            <span className="bg-white text-blue-900 px-2 py-0.5 rounded-full ml-3 text-sm font-black">
              {totalItems}
            </span>
          </Link>
          <Link
            to="/myorders"
            className="hover:text-blue-300 font-bold transition"
          >
            My Orders
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l border-blue-700 pl-6 ml-2">
              <span className="font-semibold text-gray-200">
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-300 hover:text-red-100 font-bold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-blue-700 pl-6 ml-2">
              <Link
                to="/login"
                className="text-sm font-bold hover:text-blue-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold bg-white text-blue-900 px-4 py-1.5 rounded hover:bg-gray-100 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-blue-800 p-4 rounded-lg animate-fade-in-down">
          {user && user.isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="text-blue-200 font-bold border-b border-blue-700 pb-2"
            >
              Admin Panel
            </Link>
          )}
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex justify-between font-bold"
          >
            Cart <span>({totalItems})</span>
          </Link>
          <Link
            to="/myorders"
            onClick={() => setIsOpen(false)}
            className="font-bold"
          >
            My Orders
          </Link>

          {user ? (
            <div className="flex flex-col gap-3 pt-2 border-t border-blue-700">
              <span className="text-gray-300 italic">User: {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-left text-red-300 font-bold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2 border-t border-blue-700">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="font-bold"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="font-bold bg-white text-blue-900 p-2 rounded text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;