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
  total_results: number;
  results: Article[];
}

export interface SearchInfo {
  query: string;
  model: string;
  total: number;
}

export type ModelType = 'bm25' | 'tfidf';