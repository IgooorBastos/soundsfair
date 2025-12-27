'use client';

interface ScanLinesProps {
  opacity?: number;
  className?: string;
}

export default function ScanLines({
  opacity = 0.05,
  className = ''
}: ScanLinesProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    >
      {/* Horizontal scan lines */}
      <div
        className="absolute inset-0 animate-scan"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 215, 0, ${opacity}) 2px,
            rgba(255, 215, 0, ${opacity}) 4px
          )`,
        }}
      />

      {/* Moving scan beam */}
      <div
        className="absolute inset-x-0 h-32 animate-scan opacity-30"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255, 215, 0, 0.1), transparent)',
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}
