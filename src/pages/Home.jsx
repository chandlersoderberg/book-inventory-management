import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, BookOpen } from "lucide-react";
import BookTable from "../components/BookTable";
import BookForm from "../components/BookForm";
import DeleteModal from "../components/DeleteModal";
import Navbar from "../components/Navbar";
import {
  addLocalBook,
  updateLocalBook,
  deleteLocalBook,
  getAllBooks,
} from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalBook, setDeleteModalBook] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const allBooks = await getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSave = (bookData) => {
    if (editingBook) {
      updateLocalBook(editingBook.id, bookData);
    } else {
      addLocalBook(bookData);
    }
    loadBooks();
    setShowForm(false);
    setEditingBook(null);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = (book) => {
    setDeleteModalBook(book);
  };

  const confirmDelete = () => {
    if (deleteModalBook) {
      deleteLocalBook(deleteModalBook.id);
      loadBooks();
      setDeleteModalBook(null);
    }
  };

  const handleView = (book) => {
    navigate(`/book/${book.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
                    <BookOpen className="text-white" size={32} />
                  </div>
                  My Book Collection
                </h1>
                <p className="text-gray-600 text-sm sm:text-base ml-14">
                  {books.length} {books.length === 1 ? "book" : "books"} in your
                  library
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingBook(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Plus size={20} />
                Add New Book
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-3xl shadow-xl">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-700 font-semibold mt-6 text-lg">
              Loading your library...
            </p>
          </div>
        ) : filteredBooks.length === 0 && searchQuery ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-purple-600" size={48} />
            </div>
            <p className="text-gray-900 text-xl font-bold mb-2">
              No books found
            </p>
            <p className="text-gray-600">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <BookTable
            books={filteredBooks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}

        {/* Modals */}
        {showForm && (
          <BookForm
            book={editingBook}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditingBook(null);
            }}
          />
        )}

        {deleteModalBook && (
          <DeleteModal
            book={deleteModalBook}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteModalBook(null)}
          />
        )}
      </div>
    </div>
  );
}
