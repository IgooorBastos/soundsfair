/**
 * MONEY SUPPLY CHART
 * Level 1: Shows US M2 money supply explosion 2000-2023
 *
 * Visualization: Line chart with dramatic 2020-2021 spike
 * Data: m2-money-supply.csv
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  ReferenceLine,
} from 'recharts';
import { loadDataset } from '@/lib/charts/dataLoader';
import { formatCompact, formatYear, formatPercent } from '@/lib/charts/formatters';
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
  M2_Money_Supply_Trillion_USD: number;
  Annual_Change_Percent: number;
}

export const MoneySupplyChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const chartData = await loadDataset('inflation', 'm2-money-supply');
      setData(chartData as ChartData[]);
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
            M2 Supply: ${data.M2_Money_Supply_Trillion_USD}T
          </p>
          <p style={TOOLTIP_CONFIG.itemStyle}>
            Annual Change:{' '}
            <span
              style={{
                color:
                  data.Annual_Change_Percent > 15
                    ? CHART_COLORS.red
                    : CHART_COLORS.green,
              }}
            >
              {formatPercent(data.Annual_Change_Percent, 1, true)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="vi-chart-container">
      <h3 className="vi-chart-title">US M2 Money Supply Growth (2000-2023)</h3>
      <p className="vi-chart-description">
        Visualizing "money printer go brrr" - dramatic expansion during COVID-19
      </p>

      <div className="vi-chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={MARGIN_CONFIG.default}
            {...ANIMATION_CONFIG}
          >
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
              tickFormatter={(value) => `$${value}T`}
            >
              <Label
                value="M2 Money Supply (Trillions USD)"
                angle={-90}
                position="insideLeft"
                style={{ fill: CHART_COLORS.textMuted, textAnchor: 'middle' }}
              />
            </YAxis>

            <Tooltip content={<CustomTooltip />} />

            {/* Reference line at 2020 (COVID spike) */}
            <ReferenceLine
              x={2020}
              stroke={CHART_COLORS.red}
              strokeDasharray="3 3"
              opacity={0.5}
              label={{
                value: 'COVID Stimulus',
                position: 'top',
                fill: CHART_COLORS.red,
                fontSize: 12,
              }}
            />

            <Line
              type="monotone"
              dataKey="M2_Money_Supply_Trillion_USD"
              stroke={CHART_COLORS.red}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.red, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">2000 Supply</p>
          <p className="text-2xl font-bold text-vi-text-primary">$4.6T</p>
        </div>
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">2020-2021 Increase</p>
          <p className="text-2xl font-bold text-vi-red">+29.3%</p>
        </div>
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">2023 Supply</p>
          <p className="text-2xl font-bold text-vi-text-primary">$21.0T</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-vi-chart-grid rounded-lg text-sm">
        <p className="text-vi-text-muted">
          <strong className="text-vi-gold">Key Insight:</strong> M2 money supply grew from $4.6T (2000) to $21.0T (2023)
          - a <strong className="text-vi-red">356% increase</strong>. The steepest spike occurred in 2020-2021 during COVID stimulus.
        </p>
      </div>
    </div>
  );
};
