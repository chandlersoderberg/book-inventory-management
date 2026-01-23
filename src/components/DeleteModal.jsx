import { AlertTriangle, X } from 'lucide-react';

export default function DeleteModal({ book, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-3xl relative">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <AlertTriangle size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Confirm Delete</h2>
          </div>
          <button 
            onClick={onCancel}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-3 text-lg">
            Are you sure you want to delete
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <p className="text-gray-900 font-bold text-xl">"{book.title}"</p>
            <p className="text-gray-600 text-sm mt-1">by {book.author}</p>
          </div>
          <p className="text-red-600 text-sm flex items-center gap-2 font-medium">
            <AlertTriangle size={16} />
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Yes, Delete Forever
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all border border-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}