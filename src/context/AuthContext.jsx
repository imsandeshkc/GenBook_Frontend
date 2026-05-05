import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Whenever the token changes, update localStorage and Axios headers
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // Automatically attach the token to future backend requests!
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // The Login Function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        { email, password },
      );
      setToken(response.data.token);

      // FIX: Just save response.data directly!
      setUser(response.data);

      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  // The Logout Function
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);