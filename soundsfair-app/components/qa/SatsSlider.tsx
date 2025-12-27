'use client';

import { useState, useEffect } from 'react';

interface SatsSliderProps {
  value: number;
  onChange: (value: number) => void;
}

// Tier definitions based on sat amount
const getTier = (sats: number) => {
  if (sats <= 10000) {
    return {
      name: 'Quick Signal',
      color: '#CD7F32', // Bronze/Copper
      bgClass: 'from-amber-900/20 to-orange-900/20',
      borderClass: 'border-amber-700/50',
      textClass: 'text-amber-500',
      icon: '⚡',
      description: 'Direct answer, 1-2 paragraphs',
      responseTime: '24 hours',
      features: ['Concise response', 'Key points only', 'Email delivery']
    };
  } else if (sats <= 50000) {
    return {
      name: 'Deep Dive',
      color: '#C0C0C0', // Silver
      bgClass: 'from-slate-800/20 to-slate-700/20',
      borderClass: 'border-slate-500/50',
      textClass: 'text-slate-300',
      icon: '📖',
      description: 'Detailed analysis with examples',
      responseTime: '48 hours',
      features: ['In-depth explanation', 'Multiple examples', 'Visual aids', 'External references']
    };
  } else {
    return {
      name: 'Full Stack',
      color: '#FFD000', // Gold (brand color)
      bgClass: 'from-brand-gold/20 to-yellow-600/20',
      borderClass: 'border-brand-gold/50',
      textClass: 'text-brand-gold',
      icon: '🎯',
      description: 'Video explanation + comprehensive write-up',
      responseTime: '1 week',
      features: ['5-10 min video response', 'Screen sharing/demos', 'Written summary', 'Code examples', '1 follow-up question']
    };
  }
};

export default function SatsSlider({ value, onChange }: SatsSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const tier = getTier(localValue);

  // Debounce onChange to avoid too many updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(localValue);
    }, 100);
    return () => clearTimeout(timeout);
  }, [localValue, onChange]);

  // Calculate slider percentage for gradient
  const percentage = ((localValue - 1000) / (100000 - 1000)) * 100;

  // Get gradient position for slider track
  const getGradientColor = (position: number) => {
    if (position <= 33) return '#CD7F32'; // Bronze
    if (position <= 66) return '#C0C0C0'; // Silver
    return '#FFD000'; // Gold
  };

  // Preset amounts
  const presets = [
    { amount: 1000, label: '1k' },
    { amount: 5000, label: '5k' },
    { amount: 10000, label: '10k' },
    { amount: 25000, label: '25k' },
    { amount: 50000, label: '50k' },
    { amount: 100000, label: '100k' }
  ];

  // Snap to nearest thousand
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    const snapped = Math.round(newValue / 1000) * 1000;
    setLocalValue(snapped);
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 1000;
    const clamped = Math.max(1000, newValue); // No maximum limit - pay what you want
    setLocalValue(clamped);
  };

  // Simulated BTC price (you can replace with real-time API)
  const btcPrice = 100000; // $100k per BTC
  const usdValue = ((localValue / 100000000) * btcPrice).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Choose Your Investment <span className="text-semantic-error">*</span>
        </label>
        <p className="text-xs text-text-muted">
          More sats = deeper analysis. Pay what matches the value you need.
        </p>
      </div>

      {/* Current Selection Display */}
      <div className={`relative p-6 rounded-card border-2 ${tier.borderClass} bg-gradient-to-br ${tier.bgClass} backdrop-blur-sm`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{tier.icon}</span>
            <div>
              <h3 className={`text-2xl font-bold ${tier.textClass}`}>{tier.name}</h3>
              <p className="text-sm text-text-tertiary">{tier.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-brand-gold">
              {localValue.toLocaleString()}
            </div>
            <div className="text-xs text-text-muted">sats</div>
            <div className="text-sm text-text-tertiary mt-1">≈ ${usdValue}</div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          {tier.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span className="text-semantic-success">✓</span>
              <span className="text-text-secondary">{feature}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm pt-2 border-t border-border-default/30">
            <span className="text-brand-gold">⏱️</span>
            <span className="text-text-tertiary">Response time: <strong className={tier.textClass}>{tier.responseTime}</strong></span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-4">
        {/* Custom range slider with gradient */}
        <div className="relative pt-2">
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={localValue}
            onChange={handleSliderChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer
                       bg-gradient-to-r from-amber-700 via-slate-500 to-brand-gold
                       focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-surface-black
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-6
                       [&::-webkit-slider-thumb]:h-6
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-brand-gold
                       [&::-webkit-slider-thumb]:border-2
                       [&::-webkit-slider-thumb]:border-surface-black
                       [&::-webkit-slider-thumb]:cursor-grab
                       [&::-webkit-slider-thumb]:shadow-glow
                       [&::-webkit-slider-thumb]:active:cursor-grabbing
                       [&::-moz-range-thumb]:w-6
                       [&::-moz-range-thumb]:h-6
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-brand-gold
                       [&::-moz-range-thumb]:border-2
                       [&::-moz-range-thumb]:border-surface-black
                       [&::-moz-range-thumb]:cursor-grab
                       [&::-moz-range-thumb]:shadow-glow"
          />

          {/* Tick marks */}
          <div className="flex justify-between mt-2 px-1">
            {presets.map((preset) => (
              <button
                key={preset.amount}
                type="button"
                onClick={() => setLocalValue(preset.amount)}
                className={`text-xs px-2 py-1 rounded transition-all ${
                  localValue === preset.amount
                    ? 'text-brand-gold font-bold'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick preset buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          <span className="text-xs text-text-muted self-center">Quick select:</span>
          {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setLocalValue(amount)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                localValue === amount
                  ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                  : 'border-border-default bg-surface-black text-text-tertiary hover:border-border-muted hover:text-text-secondary'
              }`}
            >
              {(amount / 1000).toLocaleString()}k
            </button>
          ))}
        </div>

        {/* Custom amount input */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="text-xs text-brand-gold hover:underline"
          >
            {showCustomInput ? '− Hide custom amount' : '+ Enter custom amount'}
          </button>

          {showCustomInput && (
            <div className="mt-3 max-w-xs mx-auto">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1000"
                  step="100"
                  value={localValue}
                  onChange={handleCustomInput}
                  className="flex-1 px-4 py-2 bg-surface-black border border-brand-gold rounded-lg
                             text-text-primary text-center font-mono
                             focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  placeholder="Enter any amount"
                />
                <span className="text-text-muted text-sm">sats</span>
              </div>
              <p className="text-xs text-text-muted mt-1">
                Min: 1,000 sats • <span className="text-text-tertiary">No maximum - pay what feels right</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Value guidance */}
      <div className="bg-surface-black/50 border border-border-default rounded-lg p-4">
        <p className="text-xs text-text-tertiary text-center leading-relaxed">
          <span className="text-brand-gold font-semibold">💡 Value Guide:</span> Start with 1-5k sats for quick answers.
          Complex topics deserve 10-25k sats. Video explanations: 50k+ sats.
        </p>
        <p className="text-xs text-text-muted text-center mt-2 italic">
          Pay what you feel the answer is worth to you. Higher contributions enable deeper research.
        </p>
      </div>
    </div>
  );
}
