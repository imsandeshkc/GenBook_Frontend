import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/books`);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("stock", formData.stock);

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/books/${editId}`,
          data,
          config,
        );
        setMessage("✅ Book updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/books`,
          data,
          config,
        );
        setMessage("✅ Book added successfully!");
      }
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Action failed. Check console for details.");
    }
  };

  const handleEdit = (book) => {
    setIsEditing(true);
    setEditId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
      description: book.description,
      category: book.category,
      stock: book.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this book permanently?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/books/${id}`,
          config,
        );
        setMessage("✅ Book removed");
        fetchBooks();
      } catch (error) {
        setMessage("❌ Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      price: "",
      description: "",
      category: "",
      stock: "",
    });
    setImageFile(null);
    setIsEditing(false);
    setEditId(null);
    const fileInput = document.getElementById("bookImage");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">
            Admin Panel
          </h1>
          {message && (
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-sm w-full md:w-auto text-center">
              {message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-blue-600 w-2 h-6 rounded-full"></span>
                {isEditing ? "Edit Book Details" : "Add New Inventory"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                      Price (NPR)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="2"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Cover Image
                  </label>
                  <input
                    id="bookImage"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {isEditing && (
                    <p className="text-[10px] text-gray-400 mt-1 italic">
                      Leave empty to keep existing image
                    </p>
                  )}
                </div>

                <button className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-blue-100">
                  {isEditing ? "Update Book" : "Add to Library"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full text-gray-500 font-bold py-2 hover:text-red-500 transition"
                  >
                    Cancel Editing
                  </button>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 text-xl font-bold text-gray-800">
                Manage Books
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <th className="p-6">Book Info</th>
                      <th className="p-6 text-center">Stock</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {books.map((book) => (
                      <tr
                        key={book._id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="p-6 flex items-center gap-4">
                          <img
                            src={
                              book.image ||
                              "https://via.placeholder.com/40x60?text=No+Img"
                            }
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded shadow-sm bg-gray-100"
                          />
                          <div>
                            <div className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                              {book.title}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                              {book.author}
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${book.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {book.stock}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleEdit(book)}
                              className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(book._id)}
                              className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;