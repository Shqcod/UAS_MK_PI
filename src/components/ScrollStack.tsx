// src/components/ScrollStack.tsx
import React, { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';

interface ScrollStackItemProps {
  children: ReactNode;
  className?: string;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, className = '' }) => (
  <div
    className={`scroll-stack-card relative w-full min-h-screen flex items-center justify-center px-8 md:px-20 ${className}`}
  >
    <div className="max-w-5xl w-full">
      {children}
    </div>
  </div>
);

interface ScrollStackProps {
  children: ReactNode;
}

const ScrollStack: React.FC<ScrollStackProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const cards = document.querySelectorAll('.scroll-stack-card');

    const update = () => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;

        // Progress dari -1 (di atas) sampai 1 (di bawah)
        const progress = Math.min(Math.max((windowCenter - cardCenter) / (window.innerHeight * 0.7), -1), 1);

        // Efek stack: kartu di bawah mengecil + blur + naik + opacity rendah
        const scale = 0.88 + (1 - Math.abs(progress)) * 0.12;
        const translateY = progress * 100;
        const blur = Math.max(0, (1 - (1 - Math.abs(progress))) * 20);
        const opacity = 0.4 + (1 - Math.abs(progress)) * 0.6;

        (card as HTMLElement).style.transform = `translateY(${translateY}px) scale(${scale})`;
        (card as HTMLElement).style.filter = `blur(${blur}px)`;
        (card as HTMLElement).style.opacity = `${opacity}`;
      });
    };

    lenis.on('scroll', update);
    update();

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div ref={containerRef} className="relative rounded-2xl" >
      {children}
      {/* Spacer biar scroll nyaman */}
      <div className="h-screen" />
    </div>
  );
};

export default ScrollStack;