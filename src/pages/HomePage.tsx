import React, { useState, type FormEvent, useRef, useEffect, useMemo, type ReactNode, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    title: "Serangan 7 Oktober & Eskalasi Perang",
    description: "Hamas melancarkan serangan mengejutkan terhadap Israel. Israel menanggapi dengan operasi militer besar-besaran di Gaza, menyebabkan puluhan ribu korban jiwa dan krisis kemanusiaan parah."
  },
  {
    year: "2024-2025",
    title: "Perang Berlanjut, Gencatan Senjata & Ketegangan",
    description: "Konflik berlanjut dengan kerugian besar di kedua belah pihak. Beberapa upaya gencatan senjata sementara (Januari & Oktober 2025), pertukaran sandera-tahanan, dan peningkatan bantuan kemanusiaan. Namun, pelanggaran terus terjadi, dengan korban sipil tetap tinggi hingga akhir 2025."
  }
];

interface ScrollRevealProps {
  children: ReactNode;
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
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  baseY = 0,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    // Animation for rotation
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );

    // Animation for vertical movement
    if (baseY !== 0) {
      gsap.fromTo(
        el,
        { y: baseY },
        {
          ease: 'none',
          y: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true
          }
        }
      );
    }

    const wordElements = el.querySelectorAll<HTMLElement>('.word');

    // Animation for opacity
    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

    // Animation for blur
    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, baseY, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <div ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold text-white ${textClassName}`}>
        {splitText}
      </p>
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

  // Animasi untuk tahun di background
  useEffect(() => {
    const yearElements = document.querySelectorAll('.year-bg-large');
    
    yearElements.forEach((yearEl) => {
      gsap.fromTo(
        yearEl,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 0.12,
          scale: 1,
          ease: 'power2.out',
          duration: 1.5,
          scrollTrigger: {
            trigger: yearEl.parentElement,
            start: 'top bottom',
            end: 'center center',
            scrub: 0.5,
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
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 px-8 py-20 flex justify-center items-center flex-col text-center pt-60">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Gaza News Portal
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl">
            Portal Berita dan Informasi untuk Palestina dan Gaza
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl w-full">
            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-lg border border-white/20">
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
                className="px-8 py-3 bg-[#248898] text-white rounded-xl hover:bg-[#1a6a77] transition-colors font-semibold"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Tombol Semua Berita */}
          <div className="mt-16">
            <button
              onClick={() => navigate('/articles')}
              className="px-20 py-5 bg-white/15 backdrop-blur-lg text-white text-xl font-semibold rounded-2xl hover:bg-white/25 transition-all border border-white/30 hover:border-white/50"
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
      <div className="py-32 px-4 md:px-8 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-32 tracking-tight">
            Timeline Sejarah Gaza
          </h2>

          <div className="space-y-40 md:space-y-48">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative flex items-center justify-center min-h-[70vh] md:min-h-screen">
                {/* Tahun besar di background - DI ATAS */}
                <div className="absolute top-10 md:top-20 left-0 right-0 flex justify-center">
                  <div className="year-bg-large text-[#248898] text-8xl md:text-[10rem] lg:text-[12rem] font-bold opacity-0 pointer-events-none z-0 tracking-tighter leading-none select-none">
                    {event.year}
                  </div>
                </div>

                <div className="relative z-10 w-full max-w-6xl text-center px-4 md:px-12 lg:px-20">
                  {/* Tahun kecil di atas judul */}
                  <div className="text-[#248898] text-2xl md:text-3xl font-bold mb-3 tracking-wider">
                    {event.year}
                  </div>
                  
                  <div className="text-[#248898] text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight px-4">
                    {event.title}
                  </div>

                  <div className="px-2 md:px-8 lg:px-16">
                    <ScrollReveal
                      baseOpacity={0}
                      enableBlur={true}
                      baseY={80}
                      baseRotation={10}
                      blurStrength={20}
                      containerClassName="backdrop-blur-sm bg-black/20 p-6 md:p-8 rounded-2xl border border-white/10"
                      textClassName="leading-relaxed"
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
      <div className="border-t border-white/10 py-12 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-400 text-lg tracking-wide">
              Gaza News Portal - Stand with Palestine
            </p>
            
          </div>
         
        </div>
      </div>
  );
};

export default HomePage;