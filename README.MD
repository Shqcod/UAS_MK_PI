# Indonesian News Search API

API pencarian berita Indonesia menggunakan metode TF-IDF dan BM25.

## Features

- ✅ TF-IDF (Vector Space Model)
- ✅ BM25 (Best Matching 25)
- ✅ Indonesian text preprocessing (stopword removal)
- ✅ 1980+ Indonesian news articles
- ✅ Fast REST API with FastAPI

## API Endpoints

### GET /
Informasi API

### GET /search
Cari berita

**Parameters:**
- `q` (required): Query pencarian
- `model` (optional): Model yang digunakan - `tfidf`, `vsm`, atau `bm25` (default: `tfidf`)
- `limit` (optional): Jumlah hasil (default: 20, max: 100)

**Example:**
```bash
GET /search?q=donald%20trump%20gaza&model=bm25&limit=10
```

**Response:**
```json
{
  "query": "donald trump gaza",
  "model": "bm25",
  "limit": 10,
  "total_results": 10,
  "results": [
    {
      "title": "...",
      "body": "...",
      "author": "...",
      "image_url": "...",
      "url": "...",
      "tanggal": "...",
      "score": 6.4672
    }
  ]
}
```

## Local Development

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Server
```bash
uvicorn main:app --reload
```

Server akan berjalan di `http://localhost:8000`

### Interactive Documentation
Buka `http://localhost:8000/docs` untuk API documentation (Swagger UI)

## Deployment

### Render.com
1. Push repository ke GitHub
2. Create new Web Service di Render.com
3. Connect GitHub repository
4. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Railway.app
1. Push repository ke GitHub
2. Create new project di Railway
3. Connect GitHub repository
4. Railway akan auto-detect dan deploy

## Tech Stack

- **FastAPI** - Modern web framework
- **scikit-learn** - TF-IDF implementation
- **rank-bm25** - BM25 implementation
- **Sastrawi** - Indonesian NLP library
- **Pandas** - Data manipulation

## Models Comparison

| Model | Score Range | Best For |
|-------|-------------|----------|
| TF-IDF | 0.0 - 1.0 | General search, balanced results |
| BM25 | 0.0 - ∞ | Term frequency sensitive, keyword matching |

## License

MIT License
```

### `.gitignore`
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
.venv

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Project specific
*.csv
create_model.py
test_*.py