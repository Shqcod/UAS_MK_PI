import math
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import re
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
import os

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
print(f"✅ Loaded {len(df)} documents")

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

@app.get("/")
def read_root():
    return {
        "message": "Indonesian News Search API",
        "total_documents": len(df),
        "models": ["tfidf", "vsm", "bm25"],
        "endpoints": {
            "GET /": "API information",
            "GET /search": "Search news articles",
            "GET /docs": "Interactive API documentation",
            "GET /health": "Health check"
        },
        "example": "/search?q=donald%20trump%20gaza&model=bm25&limit=10"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": True,
        "total_documents": len(df)
    }

@app.get("/search")
def search(
    q: str = Query(..., description="Search query", min_length=1),
    model: str = Query("tfidf", description="Model: tfidf, vsm, or bm25"),
    limit: int = Query(20, ge=1, le=100, description="Number of results to return")
):
    """
    Search Indonesian news articles
    
    - **q**: Search query (required)
    - **model**: Search model - tfidf, vsm, or bm25 (default: tfidf)
    - **limit**: Number of results (default: 20, max: 100)
    """
    
    if model == "bm25":
        query_tokens = preprocess_query_bm25(q)
        scores = bm25.get_scores(query_tokens)
        top_idx = scores.argsort()[::-1][:limit]
    
    elif model in ["tfidf", "vsm"]:
        query_str = preprocess_query_tfidf(q)
        query_vec = tfidf_vectorizer.transform([query_str])
        scores = cosine_similarity(query_vec, tfidf_matrix)[0]
        top_idx = scores.argsort()[::-1][:limit]
    
    else:
        return {
            "error": "Invalid model",
            "message": "Model harus 'tfidf', 'vsm', atau 'bm25'",
            "available_models": ["tfidf", "vsm", "bm25"]
        }

    results = []
    for i in top_idx:
        score = scores[i]
        if math.isnan(score):
            score = 0.0

        results.append({
            "title": safe(df.loc[i, "title"]),
            "body": safe(df.loc[i, "body"]),
            "author": safe(df.loc[i, "author"]),
            "image_url": safe(df.loc[i, "image_url"]),
            "url": safe(df.loc[i, "url"]),
            "tanggal": safe(df.loc[i, "tanggal"]),
            "score": float(score)
        })

    return {
        "query": q,
        "model": model,
        "limit": limit,
        "total_results": len(results),
        "results": results
    }

# For local development
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)