import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

import { type Article, type ArticlesResponse, API_URL } from '../types';

const AllArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const limit = 20;

  useEffect(() => {
    fetchArticles();
  }, [page, startDate, endDate]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ArticlesResponse>(`${API_URL}/articles`, {
        params: {
          limit,
          offset: (page - 1) * limit,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          sort_by: 'date',
          order: 'desc'
        }
      });

      setArticles(response.data.results);
      setTotal(response.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div 
      className="min-h-screen bg-black p-4 transition-colors duration-300"
      style={{ fontFamily: 'testSohneBreit-Buch, sans-serif' }}
    >
      {/* Header dengan Glass Morphism */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-[#248898]/20 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 group border border-white/10 hover:border-[#3FB9CC]/50"
                >
                  <ArrowLeft className="w-6 h-6 text-white group-hover:text-[#3FB9CC] transition-colors" />
                </button>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Semua Berita <span className="text-[#3FB9CC]">Gaza</span>
                  </h1>
                  <p className="text-gray-400 mt-1 text-sm md:text-base">
                    <span className="text-[#3FB9CC] font-semibold">{total}</span> berita tersedia
                  </p>
                </div>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl transition-all duration-300 border border-white/20 hover:border-[#3FB9CC]/50"
              >
                <Filter className="w-5 h-5 text-[#3FB9CC]" />
                <span className="text-white font-medium hidden md:inline">Filter</span>
              </button>
            </div>

            {/* Filters - Collapsible */}
            {showFilters && (
              <div className="flex flex-wrap gap-4 items-end p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-semibold text-[#3FB9CC] mb-2">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-[#3FB9CC] focus:outline-none text-white transition-all duration-300"
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-semibold text-[#3FB9CC] mb-2">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-[#3FB9CC] focus:outline-none text-white transition-all duration-300"
                  />
                </div>

                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setPage(1);
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-all duration-300 font-semibold text-white border border-white/20 hover:border-[#3FB9CC]/50 hover:scale-105 active:scale-95"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-[#3FB9CC] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Memuat berita...</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Tidak ada berita ditemukan</p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <>
            <div className="grid gap-8">
              {articles.map((article, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-[#3FB9CC]/20 transition-all duration-500 overflow-hidden group border border-white/10 hover:border-[#3FB9CC]/30 hover:scale-[1.02]"
                >
                  <div className="md:flex">
                    {article.image_url && (
                      <div className="md:w-80 lg:w-96 h-64 md:h-auto overflow-hidden bg-gray-900">
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

                    <div className="flex-1 p-6 md:p-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#3FB9CC] transition-colors duration-300 leading-tight">
                        {article.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-400 mb-4">
                        {article.author && (
                          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                            <User className="w-4 h-4 text-[#3FB9CC]" />
                            <span className="text-white">{article.author}</span>
                          </div>
                        )}
                        {article.tanggal && (
                          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                            <Calendar className="w-4 h-4 text-[#3FB9CC]" />
                            <span className="text-white">{article.tanggal}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-300 leading-relaxed mb-6 line-clamp-3 text-base md:text-lg">
                        {article.body}
                      </p>

                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#248898] hover:bg-[#3FB9CC] text-white font-semibold rounded-xl transition-all duration-300 group/link hover:scale-105 active:scale-95 shadow-lg hover:shadow-[#3FB9CC]/50"
                      >
                        <span>Baca Selengkapnya</span>
                        <ExternalLink className="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl bg-white/10 border-2 border-white/20 hover:bg-[#248898] hover:border-[#3FB9CC] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/10 transition-all duration-300 group hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover:text-white transition-colors" />
                </button>

                <div className="flex items-center gap-3">
                  <span className="px-6 py-3 text-white font-bold text-lg bg-white/10 rounded-xl border border-white/20">
                    <span className="text-[#3FB9CC]">{page}</span> / {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 rounded-xl bg-white/10 border-2 border-white/20 hover:bg-[#248898] hover:border-[#3FB9CC] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/10 transition-all duration-300 group hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover:text-white transition-colors" />
                </button>
              </div>
            )}

            {/* Bottom Info */}
            <div className="text-center mt-12 text-gray-400">
              <p className="text-sm">
                Menampilkan <span className="text-[#3FB9CC] font-semibold">{(page - 1) * limit + 1}</span> - <span className="text-[#3FB9CC] font-semibold">{Math.min(page * limit, total)}</span> dari <span className="text-[#3FB9CC] font-semibold">{total}</span> berita
              </p>
            </div>
          </>
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

export default AllArticlesPage;