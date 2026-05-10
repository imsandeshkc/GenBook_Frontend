import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (token && user) {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/cart`,
            config,
          );

          const formattedItems = data.items.map((item) => ({
            _id: item.bookId,
            title: item.title,
            price: item.price,
            qty: item.quantity,
          }));
          setCart(formattedItems);
        } catch (error) {
          console.error("Cart fetch failed", error);
        }
      }
    };
    fetchCart();
  }, [token, user]);

  const addToCart = async (book, newQty = 1) => {
    setCart((prev) => {
      const exist = prev.find((x) => x._id === book._id);
      if (exist) {
        return prev.map((x) =>
          x._id === book._id ? { ...exist, qty: exist.qty + newQty } : x,
        );
      }
      return [...prev, { ...book, qty: 1 }];
    });

    if (token) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post(
          `${import.meta.env.VITE_API_URL}/cart`,
          {
            bookId: book._id,
            title: book.title,
            price: book.price,
            quantity: newQty,
          },
          config,
        );
      } catch (error) {
        console.error("Sync failed", error);
      }
    }
  };

  const removeFromCart = async (bookId) => {
    setCart((prev) => prev.filter((x) => x._id !== bookId));

    if (token) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const itemToRemove = cart.find((x) => x._id === bookId);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/cart`,
          {
            bookId: bookId,
            quantity: -itemToRemove.qty,
          },
          config,
        );
      } catch (error) {
        console.error("Remove failed", error);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (token) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/cart`, config);
      } catch (error) {
        console.error("Clear failed", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
