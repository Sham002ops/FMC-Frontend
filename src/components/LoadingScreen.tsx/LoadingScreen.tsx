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
// Responsive rectangle width based on device width
const getRectWidth = () => {
    if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) return '100px'; // mobile
        if (window.innerWidth < 1024) return '200px'; // tablet
    }
    return '300px'; // desktop
};
const [RECT_W, setRectW] = useState(getRectWidth());

useEffect(() => {
    const handleResize = () => setRectW(getRectWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

  const addRectRef = (el: HTMLDivElement | null) => {
    if (el && !rectRefs.current.includes(el)) rectRefs.current.push(el);
  };

  useEffect(() => {
    const textEl = logoRef.current?.querySelector('text');

    if (isLoading) {
      // Reset positions
      gsap.set(rectRefs.current, { y: 0 });
      gsap.set(logoRef.current, { y: 0, opacity: 1 });
      if (textEl) gsap.set(textEl, { strokeDashoffset: 300 });

      // Start looping animation if not already running
      if (textEl && !logoAnimRef.current) {
        logoAnimRef.current = gsap.timeline({ repeat: -1 });
        logoAnimRef.current.to(textEl, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' });
        logoAnimRef.current.to(textEl, { strokeDashoffset: 300, duration: 1.2, ease: 'power1.inOut' });
      }
    } else {
      // Exit animation
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          if (onFinish) onFinish();
        },
      });

      tl.to(rectRefs.current, { y: -1050, duration: 0.5, stagger: 0.15 });
      gsap.set(logoRef.current, { y: -60, opacity: 0 });

      // Stop looping animation
      if (logoAnimRef.current) {
        logoAnimRef.current.kill();
        logoAnimRef.current = null;
      }
    }
  }, [isLoading, onFinish]);

  const parentVars = {
    ['--n']: RECT_COUNT,
    ['--rect-w']: RECT_W,
  } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent pointer-events-auto">
      <div className="loading-row relative" style={parentVars}>
        {Array.from({ length: RECT_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={addRectRef}
            className="rect-slice"
            style={{ ['--i']: i } as React.CSSProperties}
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