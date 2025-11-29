import math
from fastapi import FastAPI, Query
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import re
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

app = FastAPI()

df = pickle.load(open("model/news_data.pkl", "rb"))
tfidf_vectorizer = pickle.load(open("model/tfidf_vectorizer.pkl", "rb"))
tfidf_matrix = pickle.load(open("model/tfidf_matrix.pkl", "rb"))
bm25 = pickle.load(open("model/bm25.pkl", "rb"))

# Setup stopword remover untuk BM25
stopword_remover = StopWordRemoverFactory().create_stop_word_remover()

def preprocess_query_bm25(text):
    """Preprocessing untuk BM25 - return list of tokens"""
    text = text.lower()
    text = stopword_remover.remove(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text.split()  # Return list!

def preprocess_query_tfidf(text):
    """Preprocessing untuk TF-IDF - return string"""
    text = text.lower()
    text = stopword_remover.remove(text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text  # Return string!

def safe(value):
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    return value

@app.get("/search")
def search(q: str = Query(...), model: str = "tfidf"):
    
    if model == "bm25":
        # BM25: butuh list of tokens
        query_tokens = preprocess_query_bm25(q)
        scores = bm25.get_scores(query_tokens)
        top_idx = scores.argsort()[::-1][:20]
    
    elif model in ["tfidf", "vsm"]:
        # TF-IDF: butuh string (vectorizer handle tokenization)
        query_str = preprocess_query_tfidf(q)
        query_vec = tfidf_vectorizer.transform([query_str])
        scores = cosine_similarity(query_vec, tfidf_matrix)[0]
        top_idx = scores.argsort()[::-1][:20]
    
    else:
        return {"error": "Model tidak dikenal. Gunakan 'tfidf', 'vsm', atau 'bm25'"}

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

    return results