import { Eye, Edit, Trash2, BookOpen } from 'lucide-react';

// Action button component
const ActionButton = ({ onClick, icon: Icon, color, label }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
    green: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200',
    red: 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200'
  };

  return (
    <button
      onClick={onClick}
      className={`group/btn relative p-2.5 rounded-xl border transition-all hover:scale-110 hover:shadow-md ${colorClasses[color]}`}
      title={label}
    >
      <Icon size={18} />
      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
        {label}
      </span>
    </button>
  );
};

// Empty state
const EmptyState = () => (
  <tr>
    <td colSpan="5" className="py-16">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-full">
          <BookOpen className="text-purple-600" size={64} />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">No books in your library</p>
          <p className="text-gray-600">Click "Add New Book" to get started!</p>
        </div>
      </div>
    </td>
  </tr>
);

export default function BookTable({ books, onEdit, onDelete, onView }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          
          {/* Header */}
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
              <th className="py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  <span>Book Title</span>
                </div>
              </th>
              <th className="py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-bold uppercase tracking-wider text-white hidden sm:table-cell">Author</th>
              <th className="py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-bold uppercase tracking-wider text-white hidden md:table-cell">Publisher</th>
              <th className="py-4 px-4 sm:px-6 text-left text-xs sm:text-sm font-bold uppercase tracking-wider text-white hidden lg:table-cell">Published Date</th>
              <th className="py-4 px-4 sm:px-6 text-center text-xs sm:text-sm font-bold uppercase tracking-wider text-white">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {books.length === 0 ? (
              <EmptyState />
            ) : (
              books.map((book, index) => (
                <tr 
                  key={book.id} 
                  className="group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Title */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-4">
                      {book.image && (
                        <img 
                          src={book.image} 
                          alt={book.title} 
                          className="w-12 h-16 object-cover rounded-lg shadow-md border-2 border-gray-200 hidden sm:block"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-purple-700 transition-colors">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 sm:hidden">
                          by {book.author}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-4 px-4 sm:px-6 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {book.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{book.author}</span>
                    </div>
                  </td>

                  {/* Publisher */}
                  <td className="py-4 px-4 sm:px-6 hidden md:table-cell">
                    <span className="text-sm text-gray-700 font-medium">{book.publisher}</span>
                  </td>

                  {/* Published Date */}
                  <td className="py-4 px-4 sm:px-6 hidden lg:table-cell">
                    <span className="text-sm text-gray-700 font-semibold">{book.publishedDate}</span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex gap-2 justify-center">
                      <ActionButton onClick={() => onView(book)} icon={Eye} color="blue" label="View Details" />
                      <ActionButton onClick={() => onEdit(book)} icon={Edit} color="green" label="Edit Book" />
                      <ActionButton onClick={() => onDelete(book)} icon={Trash2} color="red" label="Delete Book" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}