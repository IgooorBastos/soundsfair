'use client';

import { useState, useEffect } from 'react';
import type { FearGreedData, FearGreedPoint } from '@/app/types/tools';

interface FearGreedApiResponse {
  current: FearGreedData;
  metadata: {
    color: string;
    description: string;
    suggestion: string;
    emoji: string;
  };
  stats?: {
    average: number;
    median: number;
    min: number;
    max: number;
    volatility: number;
    extremes: {
      highest: FearGreedPoint | null;
      lowest: FearGreedPoint | null;
    };
    trend: 'up' | 'down' | 'stable';
    daysAnalyzed: number;
    daysInExtremeFear: number;
    daysInExtremeGreed: number;
  };
}

export default function FearGreedIndex() {
  const [data, setData] = useState<FearGreedApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<30 | 90>(30);

  // Fetch Fear & Greed data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bitcoin/fear-greed?limit=${selectedPeriod}&includeStats=true`);
        if (!response.ok) throw new Error('Failed to fetch Fear & Greed data');

        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
          setError(null);
        } else {
          throw new Error(result.error?.message || 'Unknown error');
        }
      } catch (err) {
        console.error('Fear & Greed fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-8 mb-8">
          <div className="h-64 bg-gray-800 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">Failed to load Fear & Greed Index</p>
          <p className="text-gray-400 text-sm">{error || 'Please refresh the page or try again later.'}</p>
        </div>
      </div>
    );
  }

  const { current, metadata, stats } = data;
  const value = current.value;
  const change = current.change24h || 0;

  // Calculate gauge rotation (0-100 to -90deg to 90deg)
  const gaugeRotation = (value / 100) * 180 - 90;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Main Gauge Card */}
      <div className="bg-gradient-to-br from-surface-charcoal via-surface-charcoal to-black border-2 border-border-default rounded-lg p-8">
        {/* Gauge Visual */}
        <div className="relative w-full max-w-md mx-auto mb-8">
          <div className="relative aspect-[2/1]">
            {/* Colored Arc Background */}
            <svg className="w-full h-full" viewBox="0 0 200 100">
              {/* Extreme Fear - Red */}
              <path
                d="M 10 90 A 80 80 0 0 1 40 25"
                fill="none"
                stroke="#EF4444"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Fear - Orange */}
              <path
                d="M 40 25 A 80 80 0 0 1 80 10"
                fill="none"
                stroke="#F97316"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Neutral - Yellow */}
              <path
                d="M 80 10 A 80 80 0 0 1 120 10"
                fill="none"
                stroke="#FFD000"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Greed - Light Green */}
              <path
                d="M 120 10 A 80 80 0 0 1 160 25"
                fill="none"
                stroke="#84CC16"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Extreme Greed - Green */}
              <path
                d="M 160 25 A 80 80 0 0 1 190 90"
                fill="none"
                stroke="#22C55E"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>

            {/* Needle */}
            <div
              className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-700"
              style={{
                transform: `translateX(-50%) rotate(${gaugeRotation}deg)`,
                width: '4px',
                height: '45%',
              }}
            >
              <div className="w-full h-full bg-white rounded-full shadow-lg" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full border-4 border-surface-charcoal shadow-lg" />
            </div>
          </div>

          {/* Value Display */}
          <div className="text-center mt-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-6xl">{metadata.emoji}</span>
              <div className="text-6xl font-bold" style={{ color: metadata.color }}>
                {value}
              </div>
            </div>
            <div className="text-2xl font-semibold mb-1" style={{ color: metadata.color }}>
              {current.classification}
            </div>
            {change !== 0 && (
              <div className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change)} points (24h)
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-black/40 rounded-lg p-6 mb-4">
          <p className="text-gray-300 text-center">{metadata.description}</p>
        </div>

        {/* Suggestion */}
        <div className="bg-brand-yellow/10 border border-brand-yellow rounded-lg p-4">
          <p className="text-gray-200 text-center">
            <strong className="text-brand-yellow">💡 {metadata.suggestion}</strong>
          </p>
          <p className="text-xs text-gray-400 text-center mt-2">
            *This is educational content, not financial advice.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Average ({selectedPeriod}d)</div>
            <div className="text-3xl font-bold text-white mb-1">{stats.average}</div>
            <div className="text-xs text-gray-500">Median: {stats.median}</div>
          </div>

          <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Range</div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats.min}-{stats.max}
            </div>
            <div className="text-xs text-gray-500">Volatility: {stats.volatility.toFixed(1)}</div>
          </div>

          <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Trend ({selectedPeriod}d)</div>
            <div className="text-3xl font-bold mb-1">
              {stats.trend === 'up' && <span className="text-green-400">↗ Rising</span>}
              {stats.trend === 'down' && <span className="text-red-400">↘ Falling</span>}
              {stats.trend === 'stable' && <span className="text-yellow-400">→ Stable</span>}
            </div>
          </div>

          <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Extremes</div>
            <div className="text-sm text-red-400">Fear: {stats.daysInExtremeFear} days</div>
            <div className="text-sm text-green-400">Greed: {stats.daysInExtremeGreed} days</div>
          </div>
        </div>
      )}

      {/* Historical Chart */}
      {current.historicalData && current.historicalData.length > 1 && (
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-brand-yellow">Historical Data</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod(30)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedPeriod === 30
                    ? 'bg-brand-yellow text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setSelectedPeriod(90)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedPeriod === 90
                    ? 'bg-brand-yellow text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                90 Days
              </button>
            </div>
          </div>

          {/* Historical Chart */}
          <div className="relative h-64 bg-black/20 rounded-lg p-4">
            {/* Background color zones */}
            <div className="absolute inset-4 flex flex-col">
              <div className="flex-1 bg-green-500/10 border-b border-green-500/20"></div>
              <div className="flex-1 bg-lime-500/10 border-b border-lime-500/20"></div>
              <div className="flex-1 bg-yellow-500/10 border-b border-yellow-500/20"></div>
              <div className="flex-1 bg-orange-500/10 border-b border-orange-500/20"></div>
              <div className="flex-1 bg-red-500/10"></div>
            </div>

            <svg className="relative w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
              {/* Grid lines with labels */}
              {[
                { value: 100, label: '100' },
                { value: 75, label: '75' },
                { value: 50, label: '50' },
                { value: 25, label: '25' },
                { value: 0, label: '0' }
              ].map(({ value, label }) => {
                const y = 200 - (value * 2);
                return (
                  <g key={value}>
                    <line
                      x1="0"
                      y1={y}
                      x2="1000"
                      y2={y}
                      stroke="#4B5563"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                    <text x="5" y={y - 5} fill="#9CA3AF" fontSize="12">
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Line and area */}
              {(() => {
                const sortedData = current.historicalData.slice().sort((a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                const points = sortedData.map((point, i) => {
                  const x = (i / (sortedData.length - 1)) * 1000;
                  const y = 200 - (point.value * 2);
                  return { x, y, value: point.value };
                });

                const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');
                const areaPoints = `0,200 ${linePoints} 1000,200`;

                return (
                  <>
                    {/* Area fill */}
                    <polygon
                      points={areaPoints}
                      fill="url(#gradient)"
                      opacity="0.2"
                    />

                    {/* Line */}
                    <polyline
                      points={linePoints}
                      fill="none"
                      stroke="#FFD000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data points with color based on value */}
                    {points.map((point, i) => {
                      let color = '#FFD000';
                      if (point.value <= 24) color = '#EF4444'; // Extreme Fear
                      else if (point.value <= 49) color = '#F97316'; // Fear
                      else if (point.value <= 54) color = '#FFD000'; // Neutral
                      else if (point.value <= 74) color = '#84CC16'; // Greed
                      else color = '#22C55E'; // Extreme Greed

                      return (
                        <circle
                          key={i}
                          cx={point.x}
                          cy={point.y}
                          r="4"
                          fill={color}
                          stroke="#000"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </>
                );
              })()}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="25%" stopColor="#84CC16" />
                  <stop offset="50%" stopColor="#FFD000" />
                  <stop offset="75%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Date range */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>
              {current.historicalData && current.historicalData.length > 0 &&
                new Date(
                  current.historicalData.slice().sort((a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                  )[0].date
                ).toLocaleDateString()}
            </span>
            <span>Today</span>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-400">Extreme Fear (0-24)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-gray-400">Fear (25-49)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-brand-yellow rounded"></div>
              <span className="text-gray-400">Neutral (50-54)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-lime-500 rounded"></div>
              <span className="text-gray-400">Greed (55-74)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-400">Extreme Greed (75-100)</span>
            </div>
          </div>
        </div>
      )}

      {/* Understanding the Index */}
      <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-brand-yellow">Understanding the Fear & Greed Index</h3>
        <p className="text-gray-300 mb-4">
          The Bitcoin Fear & Greed Index analyzes emotions and sentiments from different sources and crunches them into one simple number.
          It helps you understand the dominant market sentiment and avoid making emotional decisions.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-black/40 rounded-lg p-4">
            <h4 className="font-semibold text-red-400 mb-2">😱 Extreme Fear (0-24)</h4>
            <p className="text-sm text-gray-400">
              Investors are very worried. This could be a buying opportunity, as "Be fearful when others are greedy, and greedy when others are fearful" - Warren Buffett.
            </p>
          </div>
          <div className="bg-black/40 rounded-lg p-4">
            <h4 className="font-semibold text-orange-400 mb-2">😨 Fear (25-49)</h4>
            <p className="text-sm text-gray-400">
              Market participants are fearful and uncertain. Prices may be declining or consolidating.
            </p>
          </div>
          <div className="bg-black/40 rounded-lg p-4">
            <h4 className="font-semibold text-brand-yellow mb-2">😐 Neutral (50-54)</h4>
            <p className="text-sm text-gray-400">
              The market is balanced between fear and greed. Normal conditions prevail.
            </p>
          </div>
          <div className="bg-black/40 rounded-lg p-4">
            <h4 className="font-semibold text-lime-400 mb-2">😃 Greed (55-74)</h4>
            <p className="text-sm text-gray-400">
              Optimism is increasing. Prices are often rising, and FOMO (Fear of Missing Out) starts to kick in.
            </p>
          </div>
          <div className="bg-black/40 rounded-lg p-4 md:col-span-2">
            <h4 className="font-semibold text-green-400 mb-2">🤑 Extreme Greed (75-100)</h4>
            <p className="text-sm text-gray-400">
              The market is overheating. Investors are becoming reckless and greedy, which often precedes a correction or crash.
              Consider taking profits or waiting for better entry points.
            </p>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-brand-yellow">What Influences the Index?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-white mb-2">📊 Volatility (25%)</h4>
            <p className="text-sm text-gray-400">
              Measures current volatility and maximum drawdowns compared to average values. High volatility = Fear.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">📈 Market Momentum (25%)</h4>
            <p className="text-sm text-gray-400">
              Current volume and momentum compared to averages. High volume + momentum = Greed.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">💬 Social Media (15%)</h4>
            <p className="text-sm text-gray-400">
              Analysis of Twitter/X hashtags and engagement rates related to Bitcoin.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">📰 Surveys (15%)</h4>
            <p className="text-sm text-gray-400">
              Weekly crypto polls gathering sentiment from market participants.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">₿ Bitcoin Dominance (10%)</h4>
            <p className="text-sm text-gray-400">
              Increasing dominance suggests fear (flight to safety). Decreasing = Greed (risk-on).
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">🔍 Google Trends (10%)</h4>
            <p className="text-sm text-gray-400">
              Search volume for Bitcoin-related queries indicates retail interest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
