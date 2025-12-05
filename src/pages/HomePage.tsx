import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "1948",
    title: "النكبة - Berakhirnya Kekuasaan Inggris",
    description: "Puluhan ribu warga Palestina mengungsi di Gaza setelah perang. Populasi Gaza meningkat tiga kali lipat menjadi sekitar 200.000 jiwa."
  },
  {
    year: "1950-1960",
    title: "Pemerintahan Militer Mesir",
    description: "Mesir menguasai Jalur Gaza, memungkinkan warga Palestina bekerja dan belajar di Mesir. UNRWA dibentuk untuk pengungsi Palestina."
  },
  {
    year: "1967",
    title: "Perang dan Pendudukan Israel",
    description: "Israel merebut Jalur Gaza dalam perang Timur Tengah. Populasi Gaza berjumlah 394.000, setidaknya 60 persen adalah pengungsi."
  },
  {
    year: "1987",
    title: "Intifada Pertama & Terbentuknya Hamas",
    description: "Perlawanan Palestina dimulai setelah kecelakaan lalu lintas di kamp pengungsi Jabalya. Hamas terbentuk sebagai cabang bersenjata Ikhwanul Muslimin."
  },
  {
    year: "1993",
    title: "Perjanjian Oslo",
    description: "Israel dan Palestina menandatangani perjanjian perdamaian yang mengarah pada pembentukan Otoritas Palestina dengan otonomi terbatas."
  },
  {
    year: "2000",
    title: "Intifada Kedua",
    description: "Periode bom bunuh diri, serangan penembakan, dan serangan udara Israel. Bandara Internasional Gaza dihancurkan oleh Israel."
  },
  {
    year: "2005",
    title: "Evakuasi Pemukiman Israel",
    description: "Israel mengevakuasi seluruh pasukan dan pemukimnya dari Gaza. Ekonomi terowongan berkembang pesat untuk akses ke Mesir."
  },
  {
    year: "2006",
    title: "Hamas Berkuasa di Gaza",
    description: "Hamas meraih kemenangan dalam pemilihan parlemen dan menguasai Gaza penuh. Israel dan Mesir memberlakukan blokade ketat."
  },
  {
    year: "2014",
    title: "Konflik Besar",
    description: "Pertempuran terburuk terjadi. Lebih dari 2.100 warga Palestina meninggal, kebanyakan warga sipil. Israel kehilangan 67 tentara dan 6 warga sipil."
  },
  {
    year: "2023",
    title: "Serangan 7 Oktober",
    description: "Hamas melancarkan serangan mengejutkan. Israel menanggapi dengan serangan udara masif dalam pertumpahan darah terburuk dalam 75 tahun."
  }
];

const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-black font-oswald" style={{ fontFamily: 'testSohneBreit-Buch, sans-serif' }} >
      {/* Hero Section */}
<section
  className="min-h-screen bg-cover bg-center bg-no-repeat relative"
  style={{ backgroundImage: "url('/latarbelakang.png')" }}
>
  <div className="absolute inset-0 bg-black/40"></div>

  <div className="relative z-10 px-8 py-20 flex justify-center items-center flex-col text-center pt-60">
    <h1 className="text-6xl font-bold text-white mb-4 ">
      Gaza News Portal
    </h1>
    <p className="text-xl text-gray-300">
      Portal Berita dan Informasi untuk Palestina dan Gaza
    </p>

    {/* Search Form */}
    <form onSubmit={handleSearch} className="mb-12 max-w-xl mt-8">
      <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur">
        <Search className="w-6 h-6 text-gray-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari berita..."
          className="flex-1 bg-transparent text-white outline-none"
        />
        <button
          type="submit"
          className="px-8 py-3 bg-[#248898] text-white rounded-xl hover:bg-[#1a6a77]"
        >
          Cari
        </button>
      </div>
    </form>
        </div>


    {/* Quick Actions */}
    <div className="grid md:grid-cols-3 gap-6">
      <button
        onClick={() => navigate('/articles')}
        className="p-8 bg-white/5 rounded-xl text-white hover:bg-white/10"
      >
        <h3 className="text-xl font-bold mb-2">Semua Berita</h3>
        <p className="text-gray-300">Jelajahi berita terkini</p>
      </button>

      <div className="p-8 bg-white/5 rounded-xl text-white">
        <h3 className="text-xl font-bold mb-2">Analisis Mendalam</h3>
        <p className="text-gray-300">Liputan komprehensif</p>
      </div>

      <div className="p-8 bg-white/5 rounded-xl text-white">
        <h3 className="text-xl font-bold mb-2">Bantuan Kemanusiaan</h3>
        <p className="text-gray-300">Informasi donasi & dukungan</p>
      </div>
    </div>
</section>

      {/* Timeline Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Timeline Sejarah Gaza
          </h2>

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className="p-8 bg-white/5 rounded-xl"
              >
                <div className="text-[#248898] text-2xl font-bold mb-2">
                  {event.year}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {event.title}
                </h3>
                <p className="text-gray-400">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            Gaza News Portal - Standing with Palestine
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;