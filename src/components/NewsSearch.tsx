import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { Search, Newspaper, Calendar, User, ExternalLink, TrendingUp } from 'lucide-react';
import type { Article, SearchResponse, SearchInfo, ModelType } from '../types/index';

const NewsSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [model, setModel] = useState<ModelType>('bm25');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  const API_URL = 'https://gaza-news-uasmkpi.onrender.com';

  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Masukkan kata kunci pencarian');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await axios.get<SearchResponse>(`${API_URL}/search`, {
        params: {
          q: query,
          model: model,
          limit: 20
        }
      });

      setResults(response.data.results);
      setSearchInfo({
        query: response.data.query,
        model: response.data.model,
        total: response.data.total_results
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Terjadi kesalahan saat mencari');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  const handleModelChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setModel(e.target.value as ModelType);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement;
    if (target.parentElement) {
      target.parentElement.style.display = 'none';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Indonesian News Search
              </h1>
              <p className="text-gray-600 mt-1">
                Cari berita Indonesia menggunakan TF-IDF dan BM25
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Cari berita... (contoh: donald trump gaza)"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Model Select */}
              <select 
                value={model} 
                onChange={handleModelChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors bg-white cursor-pointer"
              >
                <option value="bm25">BM25</option>
                <option value="tfidf">TF-IDF</option>
                <option value="vsm">VSM</option>
              </select>

              {/* Search Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 justify-center min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Cari</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-semibold">⚠️ Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Search Info */}
          {searchInfo && (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <p>
                Ditemukan <strong>{searchInfo.total}</strong> hasil untuk "{searchInfo.query}" 
                menggunakan model <strong>{searchInfo.model.toUpperCase()}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Mencari berita...</p>
          </div>
        )}

        {/* Results */}
        <div className="grid gap-6">
          {results.map((article: Article, index: number) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="md:flex">
                {/* Image */}
                {article.image_url && (
                  <div className="md:w-80 h-48 md:h-auto overflow-hidden bg-gray-200">
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6">
                  {/* Score Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Score: {article.score.toFixed(4)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {article.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                    )}
                    {article.tanggal && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{article.tanggal}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Preview */}
                  <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                    {article.body}
                  </p>

                  {/* Read More Link */}
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:text-green-700 transition-colors group/link"
                  >
                    <span>Baca Selengkapnya</span>
                    <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {results.length === 0 && !loading && searchInfo && (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Tidak ada hasil ditemukan</p>
            <p className="text-gray-500 mt-2">Coba kata kunci lain</p>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !loading && !searchInfo && (
          <div className="text-center py-20">
            <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Mulai pencarian Anda</p>
            <p className="text-gray-500">Masukkan kata kunci untuk mencari berita Indonesia</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>
              © 2024 Indonesian News Search. Built with React & Tailwind CSS.
            </p>
            <div className="flex gap-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full">TF-IDF</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">BM25</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">VSM</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewsSearch;