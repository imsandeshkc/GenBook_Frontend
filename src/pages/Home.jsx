import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Home() {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);

  const { addToCart } = useCart();
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/books${search}`,
        );
        setBooks(response.data);

        if (!search) {
          const uniqueCats = [
            ...new Set(response.data.map((book) => book.category)),
          ];
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Error fetching books", error);
      }
    };
    fetchBooks();
  }, [search]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* HERO SEARCH SECTION */}
      <div className="bg-blue-900 py-20 px-4 text-center text-white shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter drop-shadow-lg relative">
          GenBook Store
        </h1>
        <p className="text-blue-200 mb-10 font-medium tracking-wide">
          Premium Collection for Every Reader
        </p>

        <form
          onSubmit={submitHandler}
          className="max-w-2xl mx-auto relative mb-10 group"
        >
          <input
            type="text"
            placeholder="Search titles, authors, or genres..."
            className="w-full p-6 pl-8 pr-32 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 text-lg outline-none shadow-2xl focus:bg-white focus:text-blue-900 focus:placeholder-gray-400 transition-all duration-300"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-3 top-3 bottom-3 bg-blue-600 text-white px-8 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-black hover:scale-105 transition-all active:scale-95 shadow-lg"
          >
            Find
          </button>
        </form>

        {/* CATEGORY FILTER BAR */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto relative">
          <button
            onClick={() => navigate("/")}
            className={`px-6 py-2 rounded-full border text-xs font-black uppercase tracking-widest transition-all ${!search ? "bg-white text-blue-900 border-white shadow-lg" : "border-blue-400 text-blue-100 hover:bg-blue-800"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/?keyword=${cat}`)}
              className={`px-6 py-2 rounded-full border text-xs font-black uppercase tracking-widest transition-all ${search.includes(cat) ? "bg-white text-blue-900 border-white shadow-lg" : "border-blue-400 text-blue-100 hover:bg-blue-800"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              {search ? `Search Results` : "Fresh Arrivals"}
            </h2>
            <div className="h-1.5 w-20 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          {search && (
            <button
              onClick={() => navigate("/")}
              className="text-red-500 font-black text-xs uppercase tracking-widest hover:text-black transition-colors"
            >
              [ Clear Filter ]
            </button>
          )}
        </div>

        {/* BOOK GRID */}
        {books.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-xl font-bold uppercase tracking-widest">
              No matching titles found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {books.map((book) => (
              <div
                key={book._id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                  <img
                    src={
                      book.image ||
                      "https://via.placeholder.com/300x400?text=GenBook+Cover"
                    }
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-sm">
                    <p className="text-blue-900 font-black text-sm">
                      {book.price} NPR
                    </p>
                  </div>
                  {book.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-black uppercase tracking-widest border-2 border-white px-4 py-2 rotate-12">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                      {book.category}
                    </span>
                    <h2 className="text-xl font-black text-gray-900 mt-2 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium italic">
                      by {book.author}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/book/${book._id}`}
                      className="flex-1 text-center border-2 border-gray-100 text-gray-800 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => addToCart(book)}
                      disabled={book.stock <= 0}
                      className={`flex-[2] py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${book.stock > 0 ? "bg-blue-900 text-white hover:bg-black hover:shadow-blue-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                      {book.stock > 0 ? "Add to Bag" : "Sold Out"}
                    </button>
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

export default Home;