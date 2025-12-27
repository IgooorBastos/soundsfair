'use client';

interface GlowOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'gold' | 'orange' | 'yellow';
  position?: { x: string; y: string };
  animate?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
}

export default function GlowOrb({
  size = 'lg',
  color = 'gold',
  position = { x: '50%', y: '50%' },
  animate = true,
  blur = 'xl',
  opacity = 0.3
}: GlowOrbProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
  };

  const colorClasses = {
    gold: 'bg-brand-gold',
    orange: 'bg-brand-orange',
    yellow: 'bg-semantic-lightning',
  };

  const blurClasses = {
    sm: 'blur-[40px]',
    md: 'blur-[60px]',
    lg: 'blur-[80px]',
    xl: 'blur-[120px]',
  };

  return (
    <div
      className={`
        absolute
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${blurClasses[blur]}
        ${animate ? 'animate-float' : ''}
        rounded-full
        pointer-events-none
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        opacity,
        zIndex: 0,
      }}
    />
  );
}
