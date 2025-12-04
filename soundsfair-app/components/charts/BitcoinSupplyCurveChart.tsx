/**
 * BITCOIN SUPPLY CURVE CHART
 * Level 3: Shows total BTC mined over time approaching 21M limit
 *
 * Visualization: Area chart showing S-curve asymptotic approach
 * Data: total-supply-curve.csv
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  ReferenceLine,
} from 'recharts';
import { loadDataset } from '@/lib/charts/dataLoader';
import { formatYear, formatBTC, formatPercent } from '@/lib/charts/formatters';
import {
  CHART_COLORS,
  XAXIS_CONFIG,
  YAXIS_CONFIG,
  GRID_CONFIG,
  TOOLTIP_CONFIG,
  ANIMATION_CONFIG,
  MARGIN_CONFIG,
} from '@/lib/charts/chartConfig';
import '@/app/styles/visual-identity.css';

interface ChartData {
  Year: number;
  Total_BTC_Mined: number;
  Percent_Of_Total_Supply: number;
  Remaining_BTC: number;
}

export const BitcoinSupplyCurveChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const rawData = await loadDataset('blockchain', 'total-supply-curve');

      // Transform generic ChartDataPoint[] to specific ChartData[]
      const chartData: ChartData[] = rawData.map(item => ({
        Year: Number(item.Year),
        Total_BTC_Mined: Number(item.Total_BTC_Mined),
        Percent_Of_Total_Supply: Number(item.Percent_Of_Total_Supply),
        Remaining_BTC: Number(item.Remaining_BTC),
      }));

      setData(chartData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="vi-chart-container">
        <div className="flex items-center justify-center h-64">
          <p className="text-vi-text-muted">Loading chart data...</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={TOOLTIP_CONFIG.contentStyle}>
          <p style={TOOLTIP_CONFIG.labelStyle}>
            <strong>{formatYear(data.Year)}</strong>
          </p>
          <p style={TOOLTIP_CONFIG.itemStyle}>
            Total Mined: {formatBTC(data.Total_BTC_Mined * 1000000, 2)}M
          </p>
          <p style={TOOLTIP_CONFIG.itemStyle}>
            Percentage: {formatPercent(data.Percent_Of_Total_Supply, 1, true)}
          </p>
          <p style={TOOLTIP_CONFIG.itemStyle}>
            Remaining: {formatBTC(data.Remaining_BTC * 1000000, 2)}M
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="vi-chart-container">
      <h3 className="vi-chart-title">Bitcoin Supply Curve (2009-2140)</h3>
      <p className="vi-chart-description">
        S-curve showing asymptotic approach to 21 million hard cap
      </p>

      <div className="vi-chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={data}
            margin={MARGIN_CONFIG.default}
            {...ANIMATION_CONFIG}
          >
            <defs>
              <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.gold} stopOpacity={0.8} />
                <stop offset="95%" stopColor={CHART_COLORS.gold} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid {...GRID_CONFIG} />

            <XAxis
              dataKey="Year"
              {...XAXIS_CONFIG}
              domain={[2009, 2140]}
              ticks={[2009, 2020, 2040, 2060, 2080, 2100, 2120, 2140]}
            >
              <Label
                value="Year"
                position="insideBottom"
                offset={-10}
                style={{ fill: CHART_COLORS.textMuted }}
              />
            </XAxis>

            <YAxis
              {...YAXIS_CONFIG}
              domain={[0, 21]}
              ticks={[0, 5, 10, 15, 21]}
              tickFormatter={(value) => `${value}M`}
            >
              <Label
                value="Total Bitcoin Mined (Millions)"
                angle={-90}
                position="insideLeft"
                style={{ fill: CHART_COLORS.textMuted, textAnchor: 'middle' }}
              />
            </YAxis>

            <Tooltip content={<CustomTooltip />} />

            {/* Reference line at 21M cap */}
            <ReferenceLine
              y={21}
              stroke={CHART_COLORS.red}
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: '21M Hard Cap',
                position: 'right',
                fill: CHART_COLORS.red,
                fontSize: 12,
                fontWeight: 'bold',
              }}
            />

            {/* Current year reference (2024) */}
            <ReferenceLine
              x={2024}
              stroke={CHART_COLORS.blue}
              strokeDasharray="3 3"
              opacity={0.5}
              label={{
                value: 'Today',
                position: 'top',
                fill: CHART_COLORS.blue,
                fontSize: 11,
              }}
            />

            <Area
              type="monotone"
              dataKey="Total_BTC_Mined"
              stroke={CHART_COLORS.gold}
              strokeWidth={3}
              fill="url(#supplyGradient)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">Mined as of 2024</p>
          <p className="text-2xl font-bold text-vi-gold">~19.69M BTC</p>
          <p className="text-xs text-vi-green mt-1">93.8% of total</p>
        </div>
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">Remaining to Mine</p>
          <p className="text-2xl font-bold text-vi-text-primary">~1.31M BTC</p>
          <p className="text-xs text-vi-text-muted mt-1">6.2% remaining</p>
        </div>
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">Final Bitcoin</p>
          <p className="text-2xl font-bold text-vi-red">~2140</p>
          <p className="text-xs text-vi-text-muted mt-1">116 years away</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-vi-chart-grid rounded-lg text-sm">
        <p className="text-vi-text-muted">
          <strong className="text-vi-gold">Key Insight:</strong> Bitcoin's supply follows a predictable S-curve,
          asymptotically approaching but <strong>never exceeding</strong> 21 million BTC. This absolute scarcity
          is enforced by mathematics, not policy.
        </p>
      </div>
    </div>
  );
};
