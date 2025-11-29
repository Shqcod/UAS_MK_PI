export interface Article {
  title: string;
  body: string;
  author: string;
  image_url: string;
  url: string;
  tanggal: string;
  score: number;
}

export interface SearchResponse {
  query: string;
  model: string;
  limit: number;
  filters?: {
    start_date: string | null;
    end_date: string | null;
  };
  total_results: number;
  results: Article[];
}

export interface ArticlesResponse {
  total: number;
  limit: number;
  offset: number;
  filters: {
    start_date: string | null;
    end_date: string | null;
  };
  sort: {
    by: string;
    order: string;
  };
  returned: number;
  results: Article[];
}

export type ModelType = 'bm25' | 'tfidf';

export const API_URL = 'https://gaza-news-uasmkpi.onrender.com';