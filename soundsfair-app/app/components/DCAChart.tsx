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
import type { DCAResult } from '../types/tools';
import { formatCurrency, formatNumber } from '../lib/dca-calculator';

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
      <div className="bg-surface-charcoal border-2 border-brand-gold rounded-lg p-4 shadow-glow">
        <p className="text-sm font-semibold text-brand-gold mb-2">{formattedDate}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            const result = results.find(r => r.asset === entry.name);
            if (!result) return null;

            // Find the transaction for this date
            const transaction = result.transactions.find(t => t.date === date);
            if (!transaction) return null;

            return (
              <div key={index} className="text-sm">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="font-medium" style={{ color: entry.color }}>
                    {entry.name}
                  </span>
                  <span className="font-bold text-brand-gold">
                    {viewMode === 'indexed'
                      ? `${formatNumber(entry.value as number, 1)}x`
                      : formatCurrency(transaction.portfolioValue)
                    }
                  </span>
                </div>
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>Invested:</span>
                  <span>{formatCurrency(transaction.invested * result.transactions.filter(t => t.date <= date).length)}</span>
                </div>
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>Units:</span>
                  <span>{formatNumber(transaction.cumulativeUnits, 4)} {entry.name}</span>
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
        const transaction = result.transactions.find(t => t.date === point.date);
        if (transaction) {
          newPoint[result.asset] = transaction.portfolioValue;
        }
      });
      return newPoint;
    });
  };

  const displayData = viewMode === 'indexed' ? chartData : getAbsoluteChartData();

  // Asset configuration
  const assetConfig = {
    BTC: {
      name: 'Bitcoin',
      color: '#FFD000',
      strokeWidth: 3
    }
  };

  return (
    <div className="bg-surface-charcoal border border-border-default rounded-card p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-1">
            Portfolio Growth Over Time
          </h3>
          <p className="text-sm text-text-tertiary">
            {viewMode === 'indexed'
              ? 'Normalized to 100 at start date for easy comparison'
              : 'Total portfolio value in USD'
            }
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-border-default">
          <button
            onClick={() => setViewMode('indexed')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'indexed'
                ? 'bg-brand-gold text-black'
                : 'bg-surface-dark text-text-tertiary hover:text-text-primary'
            }`}
          >
            Indexed (100)
          </button>
          <button
            onClick={() => setViewMode('absolute')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-border-default ${
              viewMode === 'absolute'
                ? 'bg-brand-gold text-black'
                : 'bg-surface-dark text-text-tertiary hover:text-text-primary'
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
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend/Info */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-default">
        <div className="text-center">
          <p className="text-xs text-text-tertiary mb-1">Start Date</p>
          <p className="text-sm font-semibold text-text-primary">
            {format(parseISO(startDate), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-tertiary mb-1">Data Points</p>
          <p className="text-sm font-semibold text-text-primary">
            {chartData.length} transactions
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-tertiary mb-1">Duration</p>
          <p className="text-sm font-semibold text-text-primary">
            {results[0]?.transactions.length || 0} periods
          </p>
        </div>
      </div>

      {/* Chart Tips */}
      <div className="mt-4 p-3 bg-brand-gold/5 border border-brand-gold/20 rounded-lg">
        <p className="text-xs text-text-tertiary">
          <span className="font-semibold text-brand-gold">💡 Tip:</span>{' '}
          Hover over the chart to see detailed portfolio values, invested amounts, and accumulated units at any point in time.
          Toggle between indexed and absolute views to compare different perspectives.
        </p>
      </div>
    </div>
  );
}
