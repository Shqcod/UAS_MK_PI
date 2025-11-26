import requests
from bs4 import BeautifulSoup
import pandas as pd

# ====== LIST LINK ARTIKEL ======
links = [
    "https://international.sindonews.com/read/1648451/43/3-alasan-negara-arab-ini-bangun-jalur-kereta-api-ke-israel-salah-satunya-perang-gaza-bukan-penghalang-1764141070",
    "https://international.sindonews.com/read/1648157/43/proyek-kereta-israel-uea-berlanjut-seiring-perang-di-gaza-1764069113",
    "https://international.sindonews.com/read/1648177/43/90-warga-gaza-bertahan-hidup-hanya-dengan-1-kali-makan-sehari-1764072692",
    "https://international.sindonews.com/read/1648171/42/rusia-ungkap-israel-bangun-benteng-di-gaza-bukti-rencana-pendudukan-jangka-panjang-1764069090",
    "https://international.sindonews.com/read/1648315/41/pusat-riset-jerman-ungkap-korban-tewas-di-gaza-kemungkinan-melebihi-100000-jiwa-1764119470",
    "https://international.sindonews.com/read/1648349/43/hamas-dan-mesir-capai-kemajuan-dalam-masalah-senjata-dan-komite-gaza-1764126698",
    "https://international.sindonews.com/read/1648127/43/ghf-yang-didukung-as-akhiri-misi-berdarah-di-gaza-setelah-9-bulan-1764065498",
    "https://international.sindonews.com/read/1648079/43/2-juta-warga-israel-hadapi-krisis-kesehatan-mental-setelah-2-tahun-perang-di-gaza-1764058282",
    "https://international.sindonews.com/read/1648293/43/mobil-paus-fransiskus-disulap-jadi-klinik-keliling-segera-dikirim-ke-gaza-1764112275",
    "https://international.sindonews.com/read/1647205/43/israel-hadapi-tsunami-kesehatan-mental-setelah-2-tahun-perang-gaza-1763867514",
    "https://international.sindonews.com/read/1645651/40/indonesia-sambut-baik-resolusi-dewan-keamanan-pbb-untuk-gaza-1763467870",
    "https://international.sindonews.com/read/1646425/43/pesawat-ke-1000-pembawa-pasokan-militer-barat-mendarat-di-israel-sejak-genosida-gaza-1763644315",
    "https://international.sindonews.com/read/1645659/42/rusia-sebut-pasukan-stabilisasi-gaza-ingatkan-praktik-kolonial-abaikan-partisipasi-rakyat-palestina-1763467898",
    "https://international.sindonews.com/read/1646359/43/israel-bunuh-280-warga-palestina-di-gaza-sejak-gencatan-senjata-1763633503",
    "https://international.sindonews.com/read/1645569/43/hamas-resolusi-dewan-keamanan-pbb-tentang-gaza-tak-penuhi-tuntutan-rakyat-palestina-1763453516",
    "https://international.sindonews.com/read/1645613/43/pbb-ungkap-9-upaya-pengiriman-tenda-ke-gaza-ditolak-israel-1763460703",
    "https://international.sindonews.com/read/1645769/43/pastor-manuel-musallam-rencana-as-untuk-gaza-akan-gagal-perlawanan-palestina-tak-akan-dilucuti-1763511111",
    "https://international.sindonews.com/read/1646111/43/langgar-gencatan-senjata-israel-mengebom-gaza-tewaskan-28-orang-1763597508",
    "https://international.sindonews.com/read/1646877/43/mesir-menentang-segala-upaya-memecah-jalur-gaza-1763781064",
    "https://international.sindonews.com/read/1645635/43/menlu-palestina-dan-netanyahu-respons-baik-resolusi-dewan-keamanan-pbb-untuk-gaza-1763464278",
    "https://international.sindonews.com/read/1644419/43/warga-palestina-menderita-akibat-hujan-deras-banjiri-kamp-kamp-tenda-di-gaza-1763169113",
    "https://international.sindonews.com/read/1644241/42/as-desak-dewan-keamanan-pbb-dukung-rencana-perdamaian-gaza-rusia-tawarkan-teks-tandingan-1763115088",
    "https://international.sindonews.com/read/1643437/43/4-motif-as-bangun-pangkalan-militer-di-dekat-gaza-salah-satunya-persiapan-untuk-pasukan-stabilisasi-1762942289",
    "https://international.sindonews.com/read/1645373/42/dk-pbb-adopsi-resolusi-pengerahan-pasukan-internasional-ke-gaza-1763424695",
    "https://international.sindonews.com/read/1643833/43/turki-desak-jaminan-gencatan-senjata-berkelanjutan-dari-pasukan-stabilisasi-internasional-di-gaza-1763032286",
    "https://international.sindonews.com/read/1643271/43/as-akan-bangun-pangkalan-militer-senilai-rp84-triliun-di-dekat-perbatasan-gaza-1762920706",
    "https://international.sindonews.com/read/1644253/43/25-negara-pasok-minyak-ke-israel-selama-perang-gaza-siapa-saja-1763115110",
    "https://international.sindonews.com/read/1645121/43/pejuang-palestina-tolak-kehadiran-pasukan-internasional-di-gaza-1763363497",
    "https://international.sindonews.com/read/1645127/43/5-alasan-israel-gunakan-organisasi-bayangan-untuk-memaksa-warga-palestina-keluar-dari-gaza-1763367068",
    "https://international.sindonews.com/read/1644555/43/4-tantangan-masa-depan-kota-gaza-pascaperang-dari-700000-ton-sampah-hingga-kelaparan-1763201492",
    "https://international.sindonews.com/read/1641189/43/pejabat-mesir-rencana-trump-pisahkan-pemerintahan-gaza-dari-pasukan-stabilitas-internasional-1762431082",
    "https://international.sindonews.com/read/1641627/43/who-ungkap-lebih-dari-16500-orang-di-gaza-butuh-perawatan-medis-mendesak-1762521077",
    "https://international.sindonews.com/read/1642997/43/berapa-kali-israel-melanggar-gencatan-senjata-gaza-1762855896",
    "https://international.sindonews.com/read/1642179/41/tanya-tanggung-jawab-israel-dalam-rekonstruksi-gaza-jurnalis-kantor-berita-italia-dipecat-1762675888",
    "https://international.sindonews.com/read/1641787/43/israel-masih-batasi-masuknya-bantuan-ke-gaza-tutup-akses-langsung-ke-utara-atau-selatan-1762575112",
    "https://international.sindonews.com/read/1642561/41/profil-gabriele-nunziati-jurnalis-italia-yang-dipecat-karena-tanya-tanggung-jawab-israel-di-gaza-1762758674",
    "https://international.sindonews.com/read/1642653/43/turki-bantu-bebaskan-200-warga-sipil-yang-terjebak-di-terowongan-gaza-1762773080",
    "https://international.sindonews.com/read/1641613/43/perundingan-berlangsung-untuk-keluarkan-150-pejuang-hamas-dari-terowongan-di-gaza-selatan-1762517485",
    "https://international.sindonews.com/read/1642041/43/hamas-senang-turki-akan-tangkap-pm-israel-benjamin-netanyahu-atas-genosida-gaza-1762643496",
    "https://international.sindonews.com/read/1641559/42/trump-berharap-pasukan-stabilisasi-internasional-segera-tiba-di-gaza-1762510311"
]

data = []


# ==================================================
#              SCRAPING FUNCTION FIXED
# ==================================================
def scrape_article(url):
    r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(r.text, "html.parser")

    # Judul
    title = soup.find("h1", class_="detail-title")
    title = title.get_text(strip=True) if title else ""

    # Gambar utama (ambil data-src → src → "")
    img = soup.find("div", class_="detail-img")
    if img:
        img_tag = img.find("img")
        if img_tag:
            image_url = img_tag.get("data-src") or img_tag.get("src") or ""
        else:
            image_url = ""
    else:
        image_url = ""

    # Penulis
    author_tag = soup.select_one(".detail-nama-redaksi a[rel='author']")
    author = author_tag.get_text(strip=True) if author_tag else ""

    # Tanggal
    date = soup.find("div", class_="detail-date-artikel")
    date = date.get_text(strip=True) if date else ""

    # Isi berita
    content = soup.find("div", id="detail-desc")
    content = content.get_text(" ", strip=True) if content else ""

    return {
        "judul": title,
        "link": url,
        "gambar": image_url,
        "penulis": author,
        "tanggal": date,
        "isi": content
    }


# ==================================================
#                   RUN SCRAPER
# ==================================================
for link in links:
    print("Scraping:", link)
    try:
        data.append(scrape_article(link))
    except Exception as e:
        print("ERROR:", e)

df = pd.DataFrame(data)
df.to_csv("sindonews_gaza_full.csv", index=False, encoding="utf-8-sig")

print("\nScraping selesai! File saved: sindonews_gaza_full.csv")
