import React, { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Newspaper, Calendar, User, ExternalLink, TrendingUp, ArrowLeft, AlertCircle } from 'lucide-react';
import { type Article, type SearchResponse, API_URL } from '../types';

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
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white/5 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-[#3FB9CC]/20 transition-all duration-500 overflow-hidden group cursor-pointer border border-white/10 hover:border-[#3FB9CC]/30 hover:scale-[1.02]"
    >
      <div className="md:flex">
        {article.image_url && (
          <div className="md:w-48 lg:w-56 h-40 md:h-auto overflow-hidden bg-gray-900">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.parentElement) target.parentElement.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex-1 p-5">
          {showScore && (
            <div className="mb-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-[#3FB9CC]/20 text-[#3FB9CC] border border-[#3FB9CC]/30">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                Score: {article.score.toFixed(4)}
              </span>
            </div>
          )}

          <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-[#3FB9CC] transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {article.author && (
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg text-xs border border-white/10">
                <User className="w-3.5 h-3.5 text-[#3FB9CC]" />
                <span className="text-gray-300">{article.author}</span>
              </div>
            )}

            {article.tanggal && (
              <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg text-xs border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-[#3FB9CC]" />
                <span className="text-gray-300">{article.tanggal}</span>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
            {article.body}
          </p>

          <div className="flex items-center gap-2 text-[#3FB9CC] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
            <span>Baca Artikel</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </a>
  );

  return (
    <div 
      className="min-h-screen bg-black transition-colors duration-300"
      style={{ fontFamily: 'testSohneBreit-Buch, sans-serif' }}
    >
      {/* Header with Search */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-[#248898]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 group border border-white/10 hover:border-[#3FB9CC]/50"
            >
              <ArrowLeft className="w-6 h-6 text-white group-hover:text-[#3FB9CC] transition-colors" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Hasil pencarian: <span className="text-[#3FB9CC]">"{query}"</span>
              </h1>
              <p className="text-sm md:text-base text-gray-400 mt-1">
                Membandingkan 2 model IR: <span className="text-[#3FB9CC] font-semibold">BM25</span> vs <span className="text-[#248898] font-semibold">TF-IDF</span>
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center gap-2 bg-white/10 rounded-2xl border-2 border-white/20 focus-within:border-[#3FB9CC] transition-all duration-300 backdrop-blur-lg">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berita lainnya..."
                className="flex-1 px-4 py-3 md:py-4 bg-transparent outline-none text-white placeholder-gray-400 text-base md:text-lg"
              />
              <button
                type="submit"
                className="px-6 md:px-8 py-3 md:py-4 bg-[#248898] text-white font-semibold rounded-r-2xl hover:bg-[#3FB9CC] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Cari
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#3FB9CC] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Mencari berita...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-2xl flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-red-400 text-lg">Error</p>
              <p className="text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* BM25 Results */}
            <div>
              <div className="bg-linear-to-r from-[#3FB9CC] to-[#248898] text-white px-6 py-5 rounded-2xl shadow-2xl mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span>BM25</span>
                  <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                    {bm25Results.length} hasil
                  </span>
                </h2>
                <p className="text-sm text-white/90 mt-2 ml-14">
                  Best Matching 25 Algorithm
                </p>
              </div>
              <div className="space-y-4">
                {bm25Results.length > 0 ? (
                  bm25Results.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))
                ) : (
                  <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                    <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg font-medium">Tidak ada hasil ditemukan</p>
                    <p className="text-gray-500 text-sm mt-2">Coba kata kunci lain</p>
                  </div>
                )}
              </div>
            </div>

            {/* TF-IDF Results */}
            <div>
              <div className="bg-linear-to-r from-[#248898] to-[#1a6a77] text-white px-6 py-5 rounded-2xl shadow-2xl mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Search className="w-6 h-6" />
                  </div>
                  <span>TF-IDF</span>
                  <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                    {tfidfResults.length} hasil
                  </span>
                </h2>
                <p className="text-sm text-white/90 mt-2 ml-14">
                  Term Frequency-Inverse Document Frequency
                </p>
              </div>
              <div className="space-y-4">
                {tfidfResults.length > 0 ? (
                  tfidfResults.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))
                ) : (
                  <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                    <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg font-medium">Tidak ada hasil ditemukan</p>
                    <p className="text-gray-500 text-sm mt-2">Coba kata kunci lain</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Info */}
        {!loading && !error && (bm25Results.length > 0 || tfidfResults.length > 0) && (
          <div className="mt-12 p-6 md:p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-[#3FB9CC]">ℹ️</span> Tentang Algoritma Pencarian
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-bold text-[#3FB9CC] mb-2 text-lg">BM25 (Best Matching 25)</h4>
                <p className="text-sm leading-relaxed">
                  Algoritma ranking probabilistik yang mempertimbangkan frekuensi term dan panjang dokumen. 
                  Lebih baik untuk query panjang dan dokumen dengan variasi panjang.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-[#248898] mb-2 text-lg">TF-IDF</h4>
                <p className="text-sm leading-relaxed">
                  Mengukur kepentingan term berdasarkan frekuensi di dokumen (TF) dan keunikan di seluruh korpus (IDF). 
                  Efektif untuk menemukan dokumen dengan term yang unik.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-12 mt-16 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-300 text-lg tracking-wide font-semibold mb-2">
            Gaza News Portal
          </p>
          <p className="text-[#3FB9CC] text-xl font-bold tracking-wider">
            🇵🇸 Stand with Palestine - Free Palestine 🇵🇸
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;