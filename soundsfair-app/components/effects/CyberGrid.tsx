'use client';

import { useEffect, useRef } from 'react';

interface CyberGridProps {
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
}

export default function CyberGrid({
  intensity = 'medium',
  animated = true,
  className = ''
}: CyberGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Grid settings based on intensity
    const gridSettings = {
      low: { size: 80, opacity: 0.05, lineWidth: 0.5 },
      medium: { size: 60, opacity: 0.1, lineWidth: 1 },
      high: { size: 40, opacity: 0.15, lineWidth: 1.5 },
    };

    const { size, opacity, lineWidth } = gridSettings[intensity];

    let animationFrame: number;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vertical lines
      ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
      ctx.lineWidth = lineWidth;

      const currentOffset = animated ? offset : 0;

      // Vertical lines
      for (let x = currentOffset % size; x < canvas.width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = currentOffset % size; y < canvas.height; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Intersection points with glow
      ctx.fillStyle = `rgba(255, 215, 0, ${opacity * 2})`;
      for (let x = currentOffset % size; x < canvas.width; x += size) {
        for (let y = currentOffset % size; y < canvas.height; y += size) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (animated) {
        offset += 0.2; // Slow movement
        if (offset > size) offset = 0;
        animationFrame = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [intensity, animated]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
