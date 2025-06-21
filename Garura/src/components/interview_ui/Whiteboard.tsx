// src/components/interview_ui/Whiteboard.tsx
'use client';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { useRef, useEffect } from 'react';

export default function Whiteboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        containerRef.current.style.height = `${rect.height}px`;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full rounded-xl overflow-hidden border border-slate-700 shadow-lg"
    >
      <Tldraw />
    </div>
  );
}
