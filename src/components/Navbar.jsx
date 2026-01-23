import { useState } from 'react';
import { BookOpen, Menu, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-all group-hover:scale-110">
              <BookOpen size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">BookShelf</span>
              <p className="text-xs sm:text-sm text-white/80 hidden sm:block">Smart Inventory Management</p>
            </div>
          </Link>
          
          {/* Desktop Info */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <Book size={18} />
            <span className="text-sm font-medium">Manage Your Collection</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-lg transition">
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-700 px-4 py-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <Book size={16} />
            <span>Manage Your Collection</span>
          </div>
        </div>
      )}
    </nav>
  );
}