import React, { useState, type FormEvent, useRef, useEffect, useMemo, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  highlightWords?: string[]; // Kata-kata yang ingin di-highlight dengan ukuran berbeda
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "1948",
    title: "النكبة (An-Nakba) - Bencana Besar Palestina",
    description: "750.000 warga Palestina dipaksa mengungsi dalam peristiwa Nakba. Ratusan desa dihancurkan dan dihapus dari peta. Populasi Gaza meningkat tiga kali lipat menjadi 200.000 jiwa.",
    highlightWords: ["750.000", "dipaksa mengungsi", "Nakba", "dihancurkan"]
  },
  {
    year: "1950-1960",
    title: "Di Bawah Pemerintahan Mesir",
    description: "Mesir mengelola Gaza, memberikan akses kerja dan pendidikan. UNRWA dibentuk untuk bantuan pengungsi. Kamp pengungsi 'sementara' menjadi permanen.",
    highlightWords: ["UNRWA", "pengungsi", "kamp"]
  },
  {
    year: "1967",
    title: "Pendudukan Israel - Penjajahan Baru Dimulai",
    description: "Israel merebut Gaza dalam Perang Enam Hari, memulai pendudukan militer brutal. 60% dari 394.000 populasi adalah pengungsi. Israel bangun pemukiman ilegal dan kontrol penuh air, listrik, ekonomi. Palestina kehilangan kebebasan bergerak.",
    highlightWords: ["pendudukan militer", "brutal", "pemukiman ilegal", "kehilangan kebebasan"]
  },
  {
    year: "1987",
    title: "Intifada Pertama - Perlawanan Rakyat",
    description: "Intifada meletus setelah insiden di Jabalya menewaskan empat warga Palestina. Perlawanan massal dimulai: demo, mogok, tolak pajak. Hamas terbentuk sebagai gerakan pembebasan. Israel respons dengan kekerasan: tembak, tahan massal, hancurkan rumah.",
    highlightWords: ["Intifada", "perlawanan", "pembebasan", "kekerasan"]
  },
  {
    year: "1993",
    title: "Perjanjian Oslo - Harapan yang Dikhianati",
    description: "Oslo ditandatangani dengan janji negara Palestina. Otoritas Palestina dibentuk dengan otonomi terbatas. Israel terus bangun pemukiman ilegal dan kontrol penuh Gaza. Janji kemerdekaan tidak pernah terwujud.",
    highlightWords: ["janji", "dikhianati", "pemukiman ilegal", "tidak pernah terwujud"]
  },
  {
    year: "2000",
    title: "Intifada Kedua - Perlawanan Berlanjut",
    description: "Provokasi Sharon di Al-Aqsa memicu Intifada Kedua. Rakyat bangkit melawan pendudukan. Israel respons dengan serangan brutal dan pengepungan total. Bandara Gaza dihancurkan. Ribuan warga sipil tewas.",
    highlightWords: ["provokasi", "bangkit melawan", "serangan brutal", "ribuan tewas"]
  },
  {
    year: "2005",
    title: "Penarikan Sepihak Israel dari Gaza",
    description: "Israel tarik pasukan tapi tetap kontrol perbatasan, laut, udara. Ini bukan kemerdekaan, tapi penjara terbuka terbesar di dunia. Ekonomi terowongan jadi satu-satunya akses ke Mesir.",
    highlightWords: ["penjara terbuka", "mengontrol", "bukan kemerdekaan"]
  },
  {
    year: "2006",
    title: "Hamas Menang Demokratis - Hukuman Kolektif Dimulai",
    description: "Hamas menang pemilu demokratis yang diakui internasional. Israel dan sekutu tolak hasil demokratis ini. Blokade ketat diberlakukan, menghukum 2 juta jiwa. Akses makanan, obat, bahan bangunan dibatasi ketat.",
    highlightWords: ["demokratis", "hukuman kolektif", "blokade", "2 juta sandera"]
  },
  {
    year: "2014",
    title: "Operasi 'Protective Edge' - Pembantaian Massal",
    description: "Israel luncurkan serangan terbesar ke Gaza. 2.251 warga Palestina tewas, termasuk 551 anak-anak dan 299 perempuan. 18.000 rumah hancur total. Sekolah PBB tempat pengungsi dibom. Dunia saksikan genosida modern.",
    highlightWords: ["2.251 dibunuh", "551 anak-anak", "genosida modern", "18.000 rumah hancur"]
  },
  {
    year: "2023",
    title: "7 Oktober - Titik Balik Perlawanan",
    description: "Hamas luncurkan Operasi Al-Aqsa Flood sebagai respons 17 tahun blokade dan 75 tahun pendudukan. Israel respons dengan pemboman paling brutal dalam sejarah. Lebih dari 10.000 sipil tewas dalam hitungan minggu. Infrastruktur sipil dihancurkan sistematis.",
    highlightWords: ["17 tahun blokade", "75 tahun pendudukan", "10.000 tewas", "sistematis"]
  },
  {
    year: "2024-2025",
    title: "Genosida Berlanjut - Dunia Menyaksikan",
    description: "Lebih dari 45.000 warga Palestina tewas, 70% perempuan dan anak. 100.000+ luka-luka. 80% Gaza utara hancur rata. Kelaparan dijadikan senjata perang. Rumah sakit tak berfungsi. Namun semangat rakyat Palestina untuk merdeka tidak pernah padam. Solidaritas global tumbuh di seluruh dunia.",
    highlightWords: ["45.000 tewas", "70% perempuan dan anak", "kelaparan sebagai senjata", "semangat tidak padam", "Palestina merdeka"]
  }
];

interface ScrollRevealProps {
  children: string;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  baseY?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  highlightWords?: string[];
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.05,
  baseRotation = 2,
  baseY = 50,
  blurStrength = 8,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom-=10%',
  wordAnimationEnd = 'bottom bottom-=5%',
  highlightWords = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const text = children;
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      
      // Check if this word should be highlighted
      const shouldHighlight = highlightWords.some(hw => 
        word.toLowerCase().includes(hw.toLowerCase())
      );
      
      return (
        <span 
          className={`inline-block word ${shouldHighlight ? 'highlight-word' : ''}`} 
          key={index}
        >
          {word}
        </span>
      );
    });
  }, [children, highlightWords]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    // Smooth rotation animation
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'power2.out',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=10%',
          end: rotationEnd,
          scrub: 1.5
        }
      }
    );

    // Smooth vertical movement
    if (baseY !== 0) {
      gsap.fromTo(
        el,
        { y: baseY },
        {
          ease: 'power2.out',
          y: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=10%',
            end: rotationEnd,
            scrub: 1.5
          }
        }
      );
    }

    const wordElements = el.querySelectorAll<HTMLElement>('.word');

    // Smooth opacity animation
    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity, filter' },
      {
        ease: 'power2.out',
        opacity: 1,
        stagger: 0.03,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=15%',
          end: wordAnimationEnd,
          scrub: 1.2
        }
      }
    );

    // Smooth blur animation
    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'power2.out',
          filter: 'blur(0px)',
          stagger: 0.03,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=15%',
            end: wordAnimationEnd,
            scrub: 1.2
          }
        }
      );
    }

    // Special animation for highlighted words
    const highlightElements = el.querySelectorAll<HTMLElement>('.highlight-word');
    if (highlightElements.length > 0) {
      gsap.fromTo(
        highlightElements,
        { scale: 0.95 },
        {
          scale: 1,
          ease: 'back.out(1.2)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: 1
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, baseY, rotationEnd, wordAnimationEnd, blurStrength, highlightWords]);

  return (
    <div ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p className={`text-[clamp(1.1rem,2.8vw,2rem)] leading-[1.8] font-normal text-white/95 ${textClassName}`}>
        {splitText}
      </p>
      <style>{`
        .highlight-word {
          font-size: clamp(1.3rem, 3.2vw, 2.4rem);
          font-weight: 700;
          color: #3FB9CC;
          text-shadow: 0 0 20px rgba(63, 185, 204, 0.3);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Enhanced year background animation with parallax
  useEffect(() => {
    const yearElements = document.querySelectorAll('.year-bg-large');
    
    yearElements.forEach((yearEl) => {
      // Parallax effect
      gsap.to(yearEl, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: yearEl.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });

      // Fade in/out effect
      gsap.fromTo(
        yearEl,
        {
          opacity: 0,
          scale: 0.85,
        },
        {
          opacity: 0.08,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: yearEl.parentElement,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden" style={{ fontFamily: 'testSohneBreit-Buch, sans-serif' }}>
      {/* Hero Section */}
      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/latarbelakang.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

        <div className="relative z-10 px-8 py-20 flex justify-center items-center flex-col text-center pt-60">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
            Gaza News Portal
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl tracking-wide drop-shadow-lg">
            Portal Berita dan Informasi untuk Palestina dan Gaza
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl w-full">
            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300">
              <Search className="w-6 h-6 text-gray-300" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari berita tentang Palestina..."
                className="flex-1 bg-transparent text-white outline-none placeholder-gray-300 text-lg"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-[#248898] text-white rounded-xl hover:bg-[#1a6a77] transition-all duration-300 font-semibold hover:scale-105 active:scale-95"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Tombol Semua Berita */}
          <div className="mt-16">
            <button
              onClick={() => navigate('/articles')}
              className="px-20 py-5 bg-white/15 backdrop-blur-lg text-white text-xl font-semibold rounded-2xl hover:bg-white/25 transition-all duration-300 border border-white/30 hover:border-white/50 hover:scale-105 active:scale-95 shadow-2xl"
            >
              Semua Berita
            </button>

            <p className="text-gray-300 mt-4 text-sm tracking-wide">
              Jelajahi berita terkini dari Gaza dan Palestina
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <div className="py-32 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-32 tracking-tight">
            Timeline Sejarah <span className="text-[#248898]">Perjuangan</span> Gaza
          </h2>

          <div className="space-y-32 md:space-y-40 lg:space-y-48">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative flex items-center justify-center min-h-[60vh] md:min-h-[70vh]">
                {/* Tahun besar di background dengan parallax */}
                <div className="absolute top-10 md:top-16 left-0 right-0 flex justify-center pointer-events-none">
                  <div className="year-bg-large text-[#248898] text-[8rem] md:text-[12rem] lg:text-[15rem] font-black opacity-0 z-0 tracking-tighter leading-none select-none">
                    {event.year}
                  </div>
                </div>

                <div className="relative z-10 w-full max-w-6xl text-center px-4 md:px-12 lg:px-20">
                  {/* Tahun kecil di atas judul */}
                  <div className="text-[#3FB9CC] text-2xl md:text-3xl lg:text-4xl font-black mb-4 tracking-wider drop-shadow-lg">
                    {event.year}
                  </div>
                  
                  <div className="text-[#3FB9CC] text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-10 leading-tight px-4 drop-shadow-2xl">
                    {event.title}
                  </div>

                  <div className="px-2 md:px-8 lg:px-16">
                    <ScrollReveal
                      baseOpacity={0.05}
                      enableBlur={true}
                      baseY={60}
                      baseRotation={1.5}
                      blurStrength={10}
                      containerClassName="backdrop-blur-md bg-black/30 p-5 md:p-7 lg:p-9 rounded-3xl border border-[#248898]/20 hover:border-[#248898]/40 transition-all duration-500 shadow-2xl"
                      textClassName="leading-relaxed text-left"
                      highlightWords={event.highlightWords}
                    >
                      {event.description}
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-16 bg-black/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-300 text-xl tracking-wide font-semibold mb-2">
            Gaza News Portal
          </p>
          <p className="text-[#3FB9CC] text-2xl font-bold tracking-wider">
            🇵🇸 Stand with Palestine - Free Palestine 🇵🇸
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;