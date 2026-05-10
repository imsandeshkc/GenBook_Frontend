import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Checkout() {
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );
  const formattedAmount = totalPrice.toString();

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrderAndPay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const orderData = {
        orderItems: cart.map((item) => ({
          title: item.title,
          qty: item.qty,
          price: item.price,
          book: item._id,
        })),
        shippingAddress: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
        },
        totalPrice: totalPrice,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        orderData,
        config,
      );

      const transaction_uuid = `GenBook-${Date.now()}`;
      const product_code = "EPAYTEST";

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/initiate-esewa`,
        {
          amount: formattedAmount,
          transaction_uuid,
          product_code,
        },
        config,
      );

      const form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute(
        "action",
        "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      );

      const fields = {
        amount: formattedAmount,
        tax_amount: "0",
        total_amount: formattedAmount,
        transaction_uuid: transaction_uuid,
        product_code: product_code,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${window.location.origin}/order-success`,
        failure_url: `${window.location.origin}/order-failed`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: data.signature,
      };

      for (const key in fields) {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", fields[key]);
        form.appendChild(input);
      }

      document.body.appendChild(form);

      clearCart();

      form.submit();
    } catch (error) {
      console.error("Checkout Error:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-32 text-2xl font-black text-gray-400 uppercase tracking-widest">
        Your bag is empty
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2rem] shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tighter text-center">
          Shipping & Payment
        </h1>

        <div className="mb-10 bg-blue-900 p-8 rounded-2xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
          <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-2">
            Grand Total
          </p>
          <p className="text-4xl font-black">
            {totalPrice.toFixed(2)} <span className="text-sm">NPR</span>
          </p>
        </div>

        <form onSubmit={handlePlaceOrderAndPay} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleInputChange}
              required
              className="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                City
              </label>
              <input
                type="text"
                name="city"
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                placeholder="Kathmandu"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                onChange={handleInputChange}
                required
                className="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                placeholder="44600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Street Address
            </label>
            <textarea
              name="address"
              onChange={handleInputChange}
              required
              rows="3"
              className="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              placeholder="Detailed location..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#60bb46] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-green-100 hover:bg-black transition-all active:scale-95 disabled:bg-gray-200"
          >
            {loading ? "Processing Order..." : "Confirm & Pay with eSewa"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.3em]">
            Powered by GenBook Secure Gateway
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;