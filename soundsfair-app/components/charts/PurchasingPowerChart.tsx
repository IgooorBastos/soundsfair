/**
 * PURCHASING POWER CHART
 * Level 1: Shows USD purchasing power decline 1950-2023
 *
 * Visualization: Area chart showing erosion of $1 over time
 * Data: purchasing-power-decline.csv
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
} from 'recharts';
import { loadDataset } from '@/lib/charts/dataLoader';
import { formatCurrency, formatYear, formatPercent } from '@/lib/charts/formatters';
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
  Purchasing_Power_USD: number;
  Cumulative_Inflation_Percent: number;
}

interface TooltipEntry {
  payload: ChartData;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
}

function PurchasingPowerTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={TOOLTIP_CONFIG.contentStyle}>
        <p style={TOOLTIP_CONFIG.labelStyle}>
          <strong>{formatYear(data.Year)}</strong>
        </p>
        <p style={TOOLTIP_CONFIG.itemStyle}>
          Purchasing Power: {formatCurrency(data.Purchasing_Power_USD, 2)}
        </p>
        <p style={TOOLTIP_CONFIG.itemStyle}>
          Cumulative Inflation: {formatPercent(data.Cumulative_Inflation_Percent, 1, true)}
        </p>
      </div>
    );
  }
  return null;
}

export const PurchasingPowerChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const rawData = await loadDataset('inflation', 'purchasing-power-decline');

      // Transform generic ChartDataPoint[] to specific ChartData[]
      const chartData: ChartData[] = rawData.map(item => ({
        Year: Number(item.Year),
        Purchasing_Power_USD: Number(item.Purchasing_Power_USD),
        Cumulative_Inflation_Percent: Number(item.Cumulative_Inflation_Percent),
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

  return (
    <div className="vi-chart-container">
      <h3 className="vi-chart-title">Purchasing Power Decline (1950-2023)</h3>
      <p className="vi-chart-description">
        How $1.00 in 1950 loses 95%+ purchasing power by 2023 due to inflation
      </p>

      <div className="vi-chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={data}
            margin={MARGIN_CONFIG.default}
            {...ANIMATION_CONFIG}
          >
            <defs>
              <linearGradient id="purchasingPowerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.gold} stopOpacity={0.8} />
                <stop offset="95%" stopColor={CHART_COLORS.red} stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid {...GRID_CONFIG} />

            <XAxis
              dataKey="Year"
              {...XAXIS_CONFIG}
              tickFormatter={(value) => formatYear(value, true)}
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
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1.0]}
              tickFormatter={(value) => formatCurrency(value, 2)}
            >
              <Label
                value="Purchasing Power (USD)"
                angle={-90}
                position="insideLeft"
                style={{ fill: CHART_COLORS.textMuted, textAnchor: 'middle' }}
              />
            </YAxis>

            <Tooltip content={<PurchasingPowerTooltip />} />

            <Area
              type="monotone"
              dataKey="Purchasing_Power_USD"
              stroke={CHART_COLORS.gold}
              strokeWidth={3}
              fill="url(#purchasingPowerGradient)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-vi-chart-grid rounded-lg text-sm">
        <p className="text-vi-text-muted">
          <strong className="text-vi-gold">Key Insight:</strong> $1.00 in 1950 has the buying power of only $0.05 today.
          That&apos;s a <strong className="text-vi-red">95% loss</strong> of purchasing power due to continuous inflation.
        </p>
      </div>
    </div>
  );
};
