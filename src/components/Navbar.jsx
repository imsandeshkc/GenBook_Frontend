import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-black tracking-widest hover:text-blue-200 transition"
        >
          GENBOOK.
        </Link>

        <div className="flex gap-6 items-center">
          {user && user.isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-bold text-blue-200 hover:text-white transition-colors uppercase tracking-widest"
            >
              Admin Panel
            </Link>
          )}

          <Link
            to="/cart"
            className="bg-blue-600 px-5 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-500 transition-colors flex items-center"
          >
            Cart
            <span className="bg-white text-blue-900 px-2 py-0.5 rounded-full ml-3 text-sm font-black">
              {totalItems}
            </span>
          </Link>

          <Link
            to="/myorders"
            className="hover:text-blue-300 font-bold transition-colors"
          >
            My Orders
          </Link>

          {user ? (
            // IF LOGGED IN: Show their name and a Logout button
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
            // IF LOGGED OUT: Show Login and Register links
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
    </nav>
  );
}

export default Navbar;
