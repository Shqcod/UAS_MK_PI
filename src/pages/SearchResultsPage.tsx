import React, { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Newspaper, Calendar, User, ExternalLink, TrendingUp, ArrowLeft, AlertCircle } from 'lucide-react';
import { type Article, type SearchResponse, API_URL } from '../types';
import ThemeToggle from '../components/ThemeToggle';

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [bm25Results, setBm25Results] = useState<Article[]>([]);
  const [tfidfResults, setTfidfResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const [bm25Response, tfidfResponse] = await Promise.all([
        axios.get<SearchResponse>(`${API_URL}/search`, {
          params: { q: query, model: 'bm25', limit: 10 }
        }),
        axios.get<SearchResponse>(`${API_URL}/search`, {
          params: { q: query, model: 'tfidf', limit: 10 }
        })
      ]);

      setBm25Results(bm25Response.data.results);
      setTfidfResults(tfidfResponse.data.results);
    } catch (err) {
      setError('Terjadi kesalahan saat mencari berita');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const ArticleCard = ({ article, showScore = true }: { article: Article; showScore?: boolean }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="md:flex">
        {article.image_url && (
          <div className="md:w-64 h-48 md:h-auto overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img 
              src={article.image_url} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.parentElement) target.parentElement.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex-1 p-5">
          {showScore && (
            <div className="mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                <TrendingUp className="w-3 h-3 mr-1" />
                Score: {article.score.toFixed(4)}
              </span>
            </div>
          )}

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
            {article.title}
          </h3>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
            {article.author && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{article.author}</span>
              </div>
            )}
            {article.tanggal && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{article.tanggal}</span>
              </div>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
            {article.body}
          </p>

          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 transition-colors text-sm group/link"
          >
            <span>Baca Selengkapnya</span>
            <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header with Search */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Hasil pencarian: "{query}"
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Membandingkan 2 model IR: BM25 vs TF-IDF
              </p>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus-within:border-green-500 dark:focus-within:border-green-400 transition-colors">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berita lainnya..."
                className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-green-500 dark:bg-green-600 text-white font-semibold rounded-r-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
              >
                Cari
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-green-500 dark:border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Mencari berita...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-300">Error</p>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* BM25 Results */}
            <div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  BM25 ({bm25Results.length} hasil)
                </h2>
                <p className="text-sm text-green-100 dark:text-green-200 mt-1">
                  Best Matching algorithm
                </p>
              </div>
              <div className="space-y-4 mt-4">
                {bm25Results.length > 0 ? (
                  bm25Results.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))
                ) : (
                  <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl">
                    <Newspaper className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada hasil</p>
                  </div>
                )}
              </div>
            </div>

            {/* TF-IDF Results */}
            <div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Search className="w-6 h-6" />
                  TF-IDF ({tfidfResults.length} hasil)
                </h2>
                <p className="text-sm text-blue-100 dark:text-blue-200 mt-1">
                  Term Frequency-Inverse Document Frequency
                </p>
              </div>
              <div className="space-y-4 mt-4">
                {tfidfResults.length > 0 ? (
                  tfidfResults.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))
                ) : (
                  <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl">
                    <Newspaper className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada hasil</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;