import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { addToCart } = useCart();
  const { token, user } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  const fetchBook = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/books/${id}`,
      );
      setBook(response.data);
    } catch (error) {
      console.error("Error fetching book details", error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setLoadingReview(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/books/${id}/reviews`,
        { rating, comment },
        config,
      );
      alert("Review submitted successfully!");
      setRating(0);
      setComment("");
      fetchBook();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoadingReview(false);
    }
  };

  if (!book)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        <p className="text-xl font-black text-blue-900 uppercase tracking-widest">
          Loading Details...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <nav className="flex items-center gap-2 mb-8 text-xs font-black uppercase tracking-widest">
          <Link
            to="/"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            Store
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400">{book.category}</span>
          <span className="text-gray-300">/</span>
          <span className="text-blue-900">{book.title}</span>
        </nav>

        {/* MAIN PRODUCT SECTION */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-gray-100 mb-12">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-2/5 bg-gray-100 relative group">
              <img
                src={
                  book.image ||
                  "https://via.placeholder.com/600x800?text=GenBook+Cover"
                }
                alt={book.title}
                className="w-full h-full object-cover min-h-[500px]"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-blue-900 text-white px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg">
                  {book.category}
                </span>
              </div>
            </div>

            {/* Right: Book Details */}
            <div className="lg:w-3/5 p-8 md:p-12 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-2">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-500 font-medium italic">
                    by {book.author}
                  </p>
                </div>
                <div className="bg-yellow-50 px-5 py-3 rounded-2xl border border-yellow-100 text-center shadow-sm">
                  <p className="text-2xl font-black text-yellow-600">
                    ⭐ {book.rating?.toFixed(1) || "0.0"}
                  </p>
                  <p className="text-[10px] font-black text-yellow-700 uppercase tracking-tighter">
                    {book.numReviews || 0} Ratings
                  </p>
                </div>
              </div>

              <div className="h-1.5 w-20 bg-blue-600 mb-8 rounded-full"></div>

              <div className="prose prose-blue mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  About this book
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {book.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Price
                  </p>
                  <p className="text-3xl font-black text-green-600">
                    {book.price} NPR
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Availability
                  </p>
                  <p
                    className={`text-xl font-black ${book.stock > 0 ? "text-blue-900" : "text-red-500"}`}
                  >
                    {book.stock > 0 ? `${book.stock} in Stock` : "Sold Out"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => addToCart(book)}
                disabled={book.stock <= 0}
                className={`mt-auto w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-xl active:scale-95 ${book.stock > 0 ? "bg-blue-900 text-white hover:bg-black shadow-blue-100 hover:shadow-gray-200" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                {book.stock > 0
                  ? "Add to Shopping Bag"
                  : "Currently Unavailable"}
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
              Reader Thoughts
              <span className="h-1 flex-grow bg-gray-100 rounded-full"></span>
            </h2>

            {book.reviews?.length === 0 ? (
              <div className="bg-white p-10 rounded-[2rem] border border-dashed border-gray-200 text-center">
                <p className="text-gray-400 font-bold italic">
                  No reviews yet. Share your experience!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {book.reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-black">
                          {rev.name.charAt(0).toUpperCase()}
                        </div>
                        <strong className="text-gray-900 font-black">
                          {rev.name}
                        </strong>
                      </div>
                      <span className="text-yellow-500 text-xs">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="text-gray-600 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <p className="text-[9px] text-gray-300 mt-4 uppercase font-black tracking-widest">
                      Posted on {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to Post Review */}
          <div className="h-fit sticky top-8">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
                Write a Review
              </h3>
              {user ? (
                <form onSubmit={submitReviewHandler} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Overall Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                      className="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-gray-700"
                    >
                      <option value="">Choose Star Rating...</option>
                      <option value="5">5 - Exceptional</option>
                      <option value="4">4 - Great Read</option>
                      <option value="3">3 - Satisfactory</option>
                      <option value="2">2 - Needs Improvement</option>
                      <option value="1">1 - Not Recommended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Your Perspective
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      rows="4"
                      className="w-full bg-gray-50 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-300 font-medium"
                      placeholder="What did you think of the author's style or the story?"
                    ></textarea>
                  </div>
                  <button
                    disabled={loadingReview}
                    className="w-full bg-blue-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-lg shadow-blue-100 disabled:bg-gray-100 disabled:text-gray-400 uppercase text-xs tracking-[0.2em]"
                  >
                    {loadingReview ? "Publishing..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="bg-blue-50 p-8 rounded-2xl text-center border border-blue-100">
                  <p className="text-blue-900 font-black mb-6 uppercase text-sm tracking-tight">
                    Login to share your review
                  </p>
                  <Link
                    to="/login"
                    className="inline-block bg-blue-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors"
                  >
                    Go to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;