import requests
from bs4 import BeautifulSoup
import re
import pandas as pd

def get_valid_article_links(url):
    r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(r.text, "html.parser")

    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]

        # FILTER: hanya link artikel Sindonews
        if re.match(r"^https:\/\/[a-z]+\.sindonews\.com\/read\/\d+\/\d+\/", href):
            links.append(href)

    return list(set(links))

all_links = []

# --- Jalankan ---
for page in range(0, 40, 10):
    url = f"https://www.sindonews.com/search/gokanal/{page}?type=artikel&q=gaza&pid=9"
    print(f"\nScraping: {url}")
    
    hasil = get_valid_article_links(url)
    print(f" -> Link artikel valid: {len(hasil)}")

    all_links.extend(hasil)

# Buat DataFrame
df = pd.DataFrame({"link": all_links})

# Simpan ke CSV
df.to_csv("sindonews_gaza_links.csv", index=False)

print("\nSelesai! File sindonews_gaza_links.csv berhasil dibuat.")
