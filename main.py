import math
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import re
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
import os
from datetime import datetime
from typing import Optional
import pandas as pd

app = FastAPI(
    title="Indonesian News Search API",
    description="Search Indonesian news articles using TF-IDF and BM25",
    version="1.0.0"
)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
print("Loading models...")
MODEL_DIR = "model"
df = pickle.load(open(f"{MODEL_DIR}/news_data.pkl", "rb"))
tfidf_vectorizer = pickle.load(open(f"{MODEL_DIR}/tfidf_vectorizer.pkl", "rb"))
tfidf_matrix = pickle.load(open(f"{MODEL_DIR}/tfidf_matrix.pkl", "rb"))
bm25 = pickle.load(open(f"{MODEL_DIR}/bm25.pkl", "rb"))

# Parse tanggal untuk filtering
def parse_tanggal(tanggal_str):
    """Parse berbagai format tanggal Indonesia"""
    if pd.isna(tanggal_str) or not tanggal_str:
        return None
    
    try:
        # Format: "22 Januari 2025" atau "07 November 2025 - 18:01 WIB"
        # Ambil bagian tanggal saja
        date_part = tanggal_str.split(' - ')[0] if ' - ' in tanggal_str else tanggal_str
        
        # Mapping bulan Indonesia ke angka
        bulan_map = {
            'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4,
            'Mei': 5, 'Juni': 6, 'Juli': 7, 'Agustus': 8,
            'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12
        }
        
        parts = date_part.strip().split()
        if len(parts) >= 3:
            day = int(parts[0])
            month = bulan_map.get(parts[1], 1)
            year = int(parts[2])
            return datetime(year, month, day)
    except:
        pass
    
    return None

# Convert tanggal di dataframe saat startup
print("Parsing dates...")
df['parsed_date'] = df['tanggal'].apply(parse_tanggal)
print(f"✅ Loaded {len(df)} documents with {df['parsed_date'].notna().sum()} valid dates")

# Setup stopword remover
stopword_remover = StopWordRemoverFactory().create_stop_word_remover()

def preprocess_query_bm25(text):
    """Preprocessing untuk BM25 - return list of tokens"""
    text = text.lower()
    text = stopword_remover.remove(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text.split()

def preprocess_query_tfidf(text):
    """Preprocessing untuk TF-IDF - return string"""
    text = text.lower()
    text = stopword_remover.remove(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def safe(value):
    """Handle None and NaN values"""
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    return value

def format_article(row):
    """Format article untuk response"""
    return {
        "title": safe(row["title"]),
        "body": safe(row["body"]),
        "author": safe(row["author"]),
        "image_url": safe(row["image_url"]),
        "url": safe(row["url"]),
        "tanggal": safe(row["tanggal"]),
        "score": float(row.get("score", 0))
    }

@app.get("/")
def read_root():
    return {
        "message": "Indonesian News Search API",
        "total_documents": len(df),
        "models": ["tfidf", "vsm", "bm25"],
        "endpoints": {
            "GET /": "API information",
            "GET /search": "Search news articles",
            "GET /articles": "Get all articles with filters",
            "GET /docs": "Interactive API documentation",
            "GET /health": "Health check"
        },
        "example_search": "/search?q=donald%20trump%20gaza&model=bm25&limit=10",
        "example_articles": "/articles?start_date=2025-01-01&end_date=2025-11-30&limit=50"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": True,
        "total_documents": len(df),
        "documents_with_dates": int(df['parsed_date'].notna().sum())
    }

@app.get("/search")
def search(
    q: str = Query(..., description="Search query", min_length=1),
    model: str = Query("tfidf", description="Model: tfidf, vsm, or bm25"),
    limit: int = Query(20, ge=1, le=100, description="Number of results to return"),
    start_date: Optional[str] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date filter (YYYY-MM-DD)")
):
    """
    Search Indonesian news articles
    
    - **q**: Search query (required)
    - **model**: Search model - tfidf, vsm, or bm25 (default: tfidf)
    - **limit**: Number of results (default: 20, max: 100)
    - **start_date**: Filter articles from this date (optional, format: YYYY-MM-DD)
    - **end_date**: Filter articles until this date (optional, format: YYYY-MM-DD)
    """
    
    # Parse date filters
    start_dt = None
    end_dt = None
    
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        except:
            pass
    
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
        except:
            pass
    
    # Get scores
    if model == "bm25":
        query_tokens = preprocess_query_bm25(q)
        scores = bm25.get_scores(query_tokens)
    elif model in ["tfidf", "vsm"]:
        query_str = preprocess_query_tfidf(q)
        query_vec = tfidf_vectorizer.transform([query_str])
        scores = cosine_similarity(query_vec, tfidf_matrix)[0]
    else:
        return {
            "error": "Invalid model",
            "message": "Model harus 'tfidf', 'vsm', atau 'bm25'",
            "available_models": ["tfidf", "vsm", "bm25"]
        }
    
    # Create results dataframe
    results_df = df.copy()
    results_df['score'] = scores
    
    # Apply date filters
    if start_dt:
        results_df = results_df[
            (results_df['parsed_date'].notna()) & 
            (results_df['parsed_date'] >= start_dt)
        ]
    
    if end_dt:
        results_df = results_df[
            (results_df['parsed_date'].notna()) & 
            (results_df['parsed_date'] <= end_dt)
        ]
    
    # Sort by score and get top results
    results_df = results_df.sort_values('score', ascending=False).head(limit)
    
    # Format results
    results = [format_article(row) for _, row in results_df.iterrows()]

    return {
        "query": q,
        "model": model,
        "limit": limit,
        "filters": {
            "start_date": start_date,
            "end_date": end_date
        },
        "total_results": len(results),
        "results": results
    }

@app.get("/articles")
def get_articles(
    limit: int = Query(50, ge=1, le=500, description="Number of articles to return"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    start_date: Optional[str] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date filter (YYYY-MM-DD)"),
    sort_by: str = Query("date", description="Sort by: date or title"),
    order: str = Query("desc", description="Order: asc or desc")
):
    """
    Get all articles with optional date filtering and pagination
    
    - **limit**: Number of articles (default: 50, max: 500)
    - **offset**: Starting position for pagination (default: 0)
    - **start_date**: Filter from this date (optional, format: YYYY-MM-DD)
    - **end_date**: Filter until this date (optional, format: YYYY-MM-DD)
    - **sort_by**: Sort by 'date' or 'title' (default: date)
    - **order**: 'asc' or 'desc' (default: desc)
    """
    
    # Parse date filters
    start_dt = None
    end_dt = None
    
    if start_date:
        try:
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        except ValueError:
            return {"error": "Invalid start_date format. Use YYYY-MM-DD"}
    
    if end_date:
        try:
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
        except ValueError:
            return {"error": "Invalid end_date format. Use YYYY-MM-DD"}
    
    # Filter dataframe
    filtered_df = df.copy()
    
    if start_dt:
        filtered_df = filtered_df[
            (filtered_df['parsed_date'].notna()) & 
            (filtered_df['parsed_date'] >= start_dt)
        ]
    
    if end_dt:
        filtered_df = filtered_df[
            (filtered_df['parsed_date'].notna()) & 
            (filtered_df['parsed_date'] <= end_dt)
        ]
    
    # Sort
    if sort_by == "date":
        filtered_df = filtered_df.sort_values('parsed_date', ascending=(order == "asc"))
    elif sort_by == "title":
        filtered_df = filtered_df.sort_values('title', ascending=(order == "asc"))
    
    # Pagination
    total = len(filtered_df)
    filtered_df = filtered_df.iloc[offset:offset+limit]
    
    # Add dummy score
    filtered_df['score'] = 0.0
    
    # Format results
    results = [format_article(row) for _, row in filtered_df.iterrows()]
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "filters": {
            "start_date": start_date,
            "end_date": end_date
        },
        "sort": {
            "by": sort_by,
            "order": order
        },
        "returned": len(results),
        "results": results
    }

# For local development
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
