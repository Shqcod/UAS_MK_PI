import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Newspaper, TrendingUp, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl w-full">
        {/* Logo & Title */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Newspaper className="w-20 h-20 text-green-600 dark:text-green-400" />
              <Sparkles className="w-8 h-8 text-yellow-500 dark:text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Indonesian News Search
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Cari berita Indonesia dengan teknologi IR
          </p>
          
          <div className="flex justify-center gap-3 mt-4">
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
              TF-IDF
            </span>
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
              BM25
            </span>
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
              VSM
            </span>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-gray-400 dark:text-gray-500 ml-4" />
                
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari berita... (contoh: donald trump, ekonomi indonesia)"
                  className="flex-1 px-4 py-4 text-lg outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  autoFocus
                />
                
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/articles')}
            className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left border-2 border-transparent hover:border-green-500 dark:hover:border-green-400"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <Newspaper className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Semua Berita</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Jelajahi semua berita dengan filter tanggal
            </p>
          </button>

          <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pencarian Cerdas</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Hasil akurat dengan algoritma TF-IDF & BM25
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Powered by FastAPI • React • Tailwind CSS
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;