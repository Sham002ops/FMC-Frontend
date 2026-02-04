'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type Props = {
  isLoading: boolean;
  onFinish?: () => void;
};

export default function LoadingScreen({ isLoading, onFinish }: Props) {
  const rectRefs = useRef<HTMLDivElement[]>([]);
  const logoRef = useRef<SVGSVGElement | null>(null);
  const logoAnimRef = useRef<GSAPTimeline | null>(null);
  const RECT_COUNT = 9;

  // ✅ NEW: Dynamic height calculation
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenHeight(window.innerHeight);
      
      const handleResize = () => {
        setScreenHeight(window.innerHeight);
        setRectW(getRectWidth());
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getRectWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return '100px';
      if (window.innerWidth < 1024) return '200px';
    }
    return '300px';
  };
  const [RECT_W, setRectW] = useState(getRectWidth());

  const addRectRef = (el: HTMLDivElement | null) => {
    if (el && !rectRefs.current.includes(el)) rectRefs.current.push(el);
  };

  useEffect(() => {
    const textEl = logoRef.current?.querySelector('text');

    if (isLoading) {
      gsap.set(rectRefs.current, { y: 0 });
      gsap.set(logoRef.current, { y: 0, opacity: 1 });
      if (textEl) gsap.set(textEl, { strokeDashoffset: 300 });

      if (textEl && !logoAnimRef.current) {
        logoAnimRef.current = gsap.timeline({ repeat: -1 });
        logoAnimRef.current.to(textEl, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' });
        logoAnimRef.current.to(textEl, { strokeDashoffset: 300, duration: 1.2, ease: 'power1.inOut' });
      }
    } else {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => {
          if (onFinish) onFinish();
        },
      });

      // ✅ Dynamic slide distance based on screen height
      const slideDistance = -(screenHeight * 1.5); // 150% of screen height
      
      tl.to(rectRefs.current, { 
        y: slideDistance,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.in'
      });
      
      gsap.set(logoRef.current, { y: -60, opacity: 0 });

      if (logoAnimRef.current) {
        logoAnimRef.current.kill();
        logoAnimRef.current = null;
      }
    }
  }, [isLoading, onFinish, screenHeight]);

  const parentVars = {
    ['--n']: RECT_COUNT,
    ['--rect-w']: RECT_W,
    ['--rect-h']: `${screenHeight * 1.2}px`, // ✅ 120% of screen height
  } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent pointer-events-auto overflow-hidden">
      <div className="loading-row relative" style={parentVars}>
        {Array.from({ length: RECT_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={addRectRef}
            className="rect-slice"
            style={{ 
              ['--i']: i,
              height: `var(--rect-h)`, // ✅ Dynamic height
            } as React.CSSProperties}
          />
        ))}

        <svg
          ref={logoRef}
          className="absolute inset-0 m-auto w-32 h-32"
          viewBox="0 0 250 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fefefe" />
              <stop offset="100%" stopColor="#fefefe" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="'Raleway', sans-serif"
            fontSize="80"
            fill="none"
            stroke="url(#grad3)"
            strokeWidth="2"
            strokeDasharray="300"
            strokeDashoffset="300"
            filter="url(#glow)"
          >
            FMC
          </text>
        </svg>
      </div>
    </div>
  );
}
