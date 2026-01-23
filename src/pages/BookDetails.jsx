import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Building, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getAllBooks } from '../services/api';

// Loading component
const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
    <Navbar />
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-700 font-semibold mt-6 text-lg">Loading book details...</p>
    </div>
  </div>
);

// Not found component
const NotFoundState = ({ navigate }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
    <Navbar />
    <div className="flex flex-col justify-center items-center h-screen px-4">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="text-purple-600" size={64} />
        </div>
        <p className="text-gray-900 text-2xl font-bold mb-2">Book Not Found</p>
        <p className="text-gray-600 mb-6">This book doesn't exist in your library</p>
        <button onClick={() => navigate('/')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105">
          ← Return to Library
        </button>
      </div>
    </div>
  </div>
);

// Info card component
const InfoCard = ({ icon: Icon, label, value, gradientFrom, gradientTo }) => (
  <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100`}>
    <Icon className="text-white mb-3" size={28} />
    <p className="text-white/90 text-xs font-semibold mb-1 uppercase tracking-wider">{label}</p>
    <p className="text-white font-bold text-lg">{value}</p>
  </div>
);

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const allBooks = await getAllBooks();
        const foundBook = allBooks.find(b => b.id === id);
        setBook(foundBook);
      } catch (error) {
        console.error('Error loading book:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id]);

  if (loading) return <LoadingState />;
  if (!book) return <NotFoundState navigate={navigate} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-8 font-semibold group transition-all bg-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg border border-gray-200">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Library
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                {book.image ? (
                  <img src={book.image} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-2xl shadow-lg mb-6" />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center mb-6">
                    <BookOpen className="text-white" size={120} />
                  </div>
                )}
                
                {/* Badge */}
                {!book.isLocal ? (
                  <div className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-200">
                    <span className="font-semibold text-sm">📚 From Google Books</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200">
                    <span className="font-semibold text-sm">✓ Your Collection</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2 leading-tight">
                {book.title}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            </div>

            {/* Details Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              <InfoCard icon={User} label="Author" value={book.author} gradientFrom="from-purple-500" gradientTo="to-purple-600" />
              <InfoCard icon={Building} label="Publisher" value={book.publisher} gradientFrom="from-pink-500" gradientTo="to-pink-600" />
              <InfoCard icon={Calendar} label="Published" value={book.publishedDate} gradientFrom="from-blue-500" gradientTo="to-blue-600" />
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-md">
                  <BookOpen className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">About This Book</h2>
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-purple-200 via-pink-200 to-transparent rounded-full mb-6"></div>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {book.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}