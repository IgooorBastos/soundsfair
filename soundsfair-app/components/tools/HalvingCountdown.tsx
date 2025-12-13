'use client';

import { useState, useEffect } from 'react';
import type { HalvingInfo, HistoricalHalving } from '@/app/types/tools';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface HalvingApiResponse {
  current: HalvingInfo;
  countdown: CountdownData;
  supply: {
    current: number;
    percentage: number;
    remaining: number;
    dailyReward: number;
  };
  historical: HistoricalHalving[];
}

export default function HalvingCountdown() {
  const [data, setData] = useState<HalvingApiResponse | null>(null);
  const [countdown, setCountdown] = useState<CountdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch halving data from API
  useEffect(() => {
    const fetchHalvingData = async () => {
      try {
        const response = await fetch('/api/bitcoin/halving');
        if (!response.ok) throw new Error('Failed to fetch halving data');

        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
          setCountdown(result.data.countdown);
          setError(null);
        } else {
          throw new Error(result.error?.message || 'Unknown error');
        }
      } catch (err) {
        console.error('Halving data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load halving data');
      } finally {
        setLoading(false);
      }
    };

    fetchHalvingData();
  }, []);

  // Update countdown every second
  useEffect(() => {
    if (!countdown) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (!prev) return null;

        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-8 mb-8">
          <div className="h-40 bg-gray-800 animate-pulse rounded"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-charcoal border border-border-default rounded-lg p-6">
              <div className="h-24 bg-gray-800 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || !countdown) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">Failed to load halving data</p>
          <p className="text-gray-400 text-sm">{error || 'Please refresh the page or try again later.'}</p>
        </div>
      </div>
    );
  }

  const { current: halvingInfo, supply, historical: historicalHalvings } = data;
  const progressPercent = halvingInfo.progressPercent;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Main Countdown Card */}
      <div className="bg-gradient-to-br from-brand-yellow/10 via-surface-charcoal to-surface-charcoal border-2 border-brand-yellow rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Next Bitcoin Halving
          </h2>
          <p className="text-gray-400">
            Block Height: <span className="text-brand-yellow font-mono">{halvingInfo.nextHalvingBlock.toLocaleString()}</span>
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Estimated Date: <span className="text-white">{new Date(halvingInfo.estimatedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </p>
        </div>

        {/* Countdown Display */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-black/40 rounded-lg p-4 text-center">
            <div className="text-3xl md:text-5xl font-bold text-brand-yellow font-mono">
              {countdown.days}
            </div>
            <div className="text-sm text-gray-400 mt-2">Days</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 text-center">
            <div className="text-3xl md:text-5xl font-bold text-brand-yellow font-mono">
              {countdown.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 mt-2">Hours</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 text-center">
            <div className="text-3xl md:text-5xl font-bold text-brand-yellow font-mono">
              {countdown.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 mt-2">Minutes</div>
          </div>
          <div className="bg-black/40 rounded-lg p-4 text-center">
            <div className="text-3xl md:text-5xl font-bold text-brand-yellow font-mono">
              {countdown.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-400 mt-2">Seconds</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress to Next Halving</span>
            <span className="text-brand-yellow font-semibold">{progressPercent.toFixed(2)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-yellow to-yellow-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Block {halvingInfo.currentBlock.toLocaleString()}</span>
            <span>{halvingInfo.blocksRemaining.toLocaleString()} blocks remaining</span>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Current Reward */}
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
          <div className="text-sm text-gray-400 mb-2">Current Block Reward</div>
          <div className="text-3xl font-bold text-brand-yellow mb-1">
            {halvingInfo.currentReward} BTC
          </div>
          <div className="text-sm text-gray-400">
            Era {halvingInfo.currentEra} • Since block {halvingInfo.currentEra * 210000}
          </div>
        </div>

        {/* Next Reward */}
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
          <div className="text-sm text-gray-400 mb-2">Next Block Reward</div>
          <div className="text-3xl font-bold text-green-400 mb-1">
            {halvingInfo.nextReward} BTC
          </div>
          <div className="text-sm text-gray-400">
            Era {halvingInfo.currentEra + 1} • Starting block {halvingInfo.nextHalvingBlock.toLocaleString()}
          </div>
        </div>

        {/* Supply Progress */}
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
          <div className="text-sm text-gray-400 mb-2">Bitcoin Supply</div>
          <div className="text-3xl font-bold text-white mb-1">
            {supply.percentage.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-400">
            {supply.current.toLocaleString()} of 21M BTC mined
          </div>
        </div>
      </div>

      {/* What is Halving? Section */}
      <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-brand-yellow">What is Bitcoin Halving?</h3>
        <div className="space-y-4 text-gray-300">
          <p>
            The Bitcoin halving is a pre-programmed event that occurs every <strong className="text-white">210,000 blocks</strong> (approximately every 4 years)
            where the block reward miners receive for validating transactions is cut in half.
          </p>
          <p>
            This mechanism is built into Bitcoin's protocol to control inflation and ensure that only
            <strong className="text-brand-yellow"> 21 million bitcoins</strong> will ever exist. As the block reward decreases over time,
            Bitcoin becomes increasingly scarce, similar to precious metals like gold.
          </p>
          <div className="bg-black/40 rounded-lg p-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Total Halvings So Far</div>
                <div className="text-2xl font-bold text-brand-yellow">{historicalHalvings.length}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Remaining Halvings</div>
                <div className="text-2xl font-bold text-white">~{32 - historicalHalvings.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Halvings Timeline */}
      <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-6 text-brand-yellow">Halving Timeline</h3>
        <div className="space-y-4">
          {/* Next Halving (Future) - Show First */}
          <div className="flex items-start gap-4 pb-4 border-b border-gray-800">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-yellow/30 border-2 border-brand-yellow flex items-center justify-center animate-pulse">
              <span className="text-brand-yellow font-bold">{halvingInfo.currentEra + 1}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="font-semibold text-brand-yellow">
                    Halving #{halvingInfo.currentEra + 1} (Upcoming)
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(halvingInfo.estimatedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand-yellow">
                    {halvingInfo.nextReward} BTC
                  </div>
                  <div className="text-xs text-gray-400">block reward</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                Block {halvingInfo.nextHalvingBlock.toLocaleString()} • {countdown.days} days remaining
              </div>
            </div>
          </div>

          {/* Historical Halvings */}
          {historicalHalvings.filter(h => h.era <= halvingInfo.currentEra).slice().reverse().map((halving, index) => (
            <div
              key={halving.era}
              className="flex items-start gap-4 pb-4 border-b border-gray-800 last:border-0"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-700/50 border-2 border-gray-600 flex items-center justify-center">
                <span className="text-gray-400 font-bold">{halving.era}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="font-semibold text-gray-300">
                      {halving.era === 0 ? 'Genesis' : `Halving #${halving.era}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(halving.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-400">
                      {halving.reward} BTC
                    </div>
                    <div className="text-xs text-gray-500">block reward</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Block {halving.block.toLocaleString()}
                  {halving.era > 0 && (
                    <span className="ml-2">
                      • Reward reduced from {halving.reward * 2} BTC to {halving.reward} BTC
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-brand-yellow">Why Halvings Matter</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">📉 Reduced Inflation</h4>
            <p className="text-sm text-gray-400">
              Each halving cuts Bitcoin's inflation rate in half, making it increasingly scarce.
              This deflationary model is unique compared to traditional fiat currencies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">⚖️ Stock-to-Flow Ratio</h4>
            <p className="text-sm text-gray-400">
              Halvings increase Bitcoin's stock-to-flow ratio, a metric comparing existing supply
              to new production, similar to precious metals like gold.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">💰 Price Impact</h4>
            <p className="text-sm text-gray-400">
              Historically, Bitcoin's price has increased significantly in the 12-18 months following
              each halving due to reduced supply and increased scarcity.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">⛏️ Mining Economics</h4>
            <p className="text-sm text-gray-400">
              Halvings force miners to become more efficient or exit the market, ensuring only
              the most secure and efficient operations continue to secure the network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
