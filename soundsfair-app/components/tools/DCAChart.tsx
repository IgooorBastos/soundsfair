"use client";

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { DCAResult } from '@/app/types/tools';
import { formatCurrency, formatNumber } from '@/lib/dca-calculator';

interface DCAChartProps {
  chartData: any[];
  results: DCAResult[];
  startDate: string;
}

type ViewMode = 'indexed' | 'absolute';

export default function DCAChart({ chartData, results, startDate }: DCAChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('indexed');

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const date = label;
    const formattedDate = date ? format(parseISO(date), 'MMM d, yyyy') : '';

    return (
      <div className="bg-dark-grey border-2 border-brand-yellow rounded-lg p-4 shadow-glow">
        <p className="text-sm font-semibold text-brand-yellow mb-2">{formattedDate}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => {
            const result = results.find(r => r.asset === entry.name);
            if (!result) return null;

            // Find the transaction for this date
            const transaction = result.transactions.find(t => t.date === date);
            if (!transaction) return null;

            return (
              <div key={index} className="text-sm border-t border-gray-800 pt-2 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <span className="font-medium text-white">
                    ₿ Bitcoin
                  </span>
                  <span className="font-bold text-brand-yellow">
                    {viewMode === 'indexed'
                      ? `${formatNumber(entry.value as number, 1)}x`
                      : formatCurrency(transaction.portfolioValue)
                    }
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Total Invested:</span>
                  <span className="text-white">{formatCurrency(
                    result.transactions
                      .filter(t => t.date <= date)
                      .reduce((sum, t) => sum + t.invested, 0)
                  )}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Accumulated:</span>
                  <span className="text-white">{formatNumber(transaction.cumulativeUnits, 6)} BTC</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Custom dot component for hover effect
  const CustomDot = (props: any) => {
    const { cx, cy, stroke, payload, dataKey } = props;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={stroke}
        stroke="#000"
        strokeWidth={2}
        className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
      />
    );
  };

  // Generate absolute value chart data
  const getAbsoluteChartData = () => {
    return chartData.map(point => {
      const newPoint: any = { date: point.date };
      results.forEach(result => {
        // Use the pre-calculated values from generateChartData
        newPoint[result.asset] = point[`${result.asset}_portfolioValue`];
        newPoint[`${result.asset}_invested`] = point[`${result.asset}_totalInvested`];
      });
      return newPoint;
    });
  };

  const displayData = viewMode === 'indexed' ? chartData : getAbsoluteChartData();

  // Asset configuration
  const assetConfig = {
    BTC: {
      name: 'Bitcoin',
      color: '#FFD700', // brand-yellow
      strokeWidth: 3
    }
  };

  return (
    <div className="bg-dark-grey border border-gray-800 rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            Portfolio Growth Over Time
          </h3>
          <p className="text-sm text-gray-400">
            {viewMode === 'indexed'
              ? 'Portfolio value normalized to 100 (gray dashed line = total invested baseline)'
              : 'Portfolio value vs total invested over time'
            }
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-800">
          <button
            onClick={() => setViewMode('indexed')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'indexed'
                ? 'bg-brand-yellow text-black'
                : 'bg-black text-gray-400 hover:text-white'
            }`}
          >
            Indexed (100)
          </button>
          <button
            onClick={() => setViewMode('absolute')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-800 ${
              viewMode === 'absolute'
                ? 'bg-brand-yellow text-black'
                : 'bg-black text-gray-400 hover:text-white'
            }`}
          >
            Absolute ($)
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={displayData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2A2A2A"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              stroke="#808080"
              tick={{ fill: '#808080', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = parseISO(value);
                return format(date, 'MMM yy');
              }}
              minTickGap={50}
            />
            <YAxis
              stroke="#808080"
              tick={{ fill: '#808080', fontSize: 12 }}
              tickFormatter={(value) => {
                if (viewMode === 'indexed') {
                  return `${value.toFixed(0)}x`;
                }
                return `$${(value / 1000).toFixed(0)}k`;
              }}
              label={{
                value: viewMode === 'indexed' ? 'Index (100 = start)' : 'Portfolio Value (USD)',
                angle: -90,
                position: 'insideLeft',
                fill: '#808080',
                fontSize: 12
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#FFD000',
                strokeWidth: 1,
                strokeDasharray: '5 5'
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px'
              }}
              iconType="line"
              formatter={(value) => {
                const config = assetConfig[value as keyof typeof assetConfig];
                return config ? config.name : value;
              }}
            />

            {results.map((result, index) => {
              const config = assetConfig[result.asset as keyof typeof assetConfig] || {
                name: result.asset,
                color: '#FFD000',
                strokeWidth: 2
              };

              return (
                <>
                  {/* Portfolio Value Line */}
                  <Line
                    key={result.asset}
                    type="monotone"
                    dataKey={result.asset}
                    name={result.asset}
                    stroke={config.color}
                    strokeWidth={config.strokeWidth}
                    dot={false}
                    activeDot={(props) => (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={5}
                        fill={config.color}
                        stroke="#000"
                        strokeWidth={2}
                      />
                    )}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />

                  {/* Total Invested Line (Baseline) */}
                  <Line
                    key={`${result.asset}_invested`}
                    type="monotone"
                    dataKey={`${result.asset}_invested`}
                    name="Total Invested"
                    stroke="#808080"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </>
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend/Info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Start Date</p>
          <p className="text-sm font-semibold text-white">
            {format(parseISO(startDate), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Data Points</p>
          <p className="text-sm font-semibold text-white">
            {chartData.length} transactions
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Duration</p>
          <p className="text-sm font-semibold text-white">
            {results[0]?.transactions.length || 0} periods
          </p>
        </div>
      </div>

      {/* Chart Tips */}
      <div className="mt-4 p-3 bg-brand-yellow/5 border border-brand-yellow/20 rounded-lg">
        <p className="text-xs text-gray-400 mb-2">
          <span className="font-semibold text-brand-yellow">💡 Tip:</span>{' '}
          Hover over the chart to see detailed portfolio values, invested amounts, and accumulated units at any point in time.
        </p>
        <p className="text-xs text-gray-400">
          <span className="font-semibold text-white">Yellow line</span> = Portfolio Value (what your investment is worth) •{' '}
          <span className="font-semibold text-white">Gray dashed line</span> = Total Invested (money you put in) •{' '}
          When yellow is above gray, you're in profit!
        </p>
      </div>
    </div>
  );
}
