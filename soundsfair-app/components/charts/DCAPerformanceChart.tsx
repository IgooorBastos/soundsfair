/**
 * DCA PERFORMANCE CHART
 * Level 5, 8: Shows Dollar-Cost Averaging results by start date
 *
 * Visualization: Multi-line chart comparing DCA strategies
 * Data: dca-performance-by-start.csv
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
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { loadDataset } from '@/lib/charts/dataLoader';
import { formatCurrency, formatDuration } from '@/lib/charts/formatters';
import {
  CHART_COLORS,
  XAXIS_CONFIG,
  YAXIS_CONFIG,
  GRID_CONFIG,
  TOOLTIP_CONFIG,
  LEGEND_CONFIG,
  ANIMATION_CONFIG,
  MARGIN_CONFIG,
} from '@/lib/charts/chartConfig';
import '@/app/styles/visual-identity.css';

interface ChartData {
  Month: number;
  DCA_Start_2015: number;
  DCA_Start_2017: number;
  DCA_Start_2018: number;
  DCA_Start_2021: number;
}

interface TooltipEntry {
  payload: ChartData;
  value: number;
  name: string;
  color?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
}

function DCAPerformanceTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const monthLabel = formatDuration(payload[0].payload.Month);
    return (
      <div style={TOOLTIP_CONFIG.contentStyle}>
        <p style={TOOLTIP_CONFIG.labelStyle}>
          <strong>After {monthLabel}</strong>
        </p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ ...TOOLTIP_CONFIG.itemStyle, color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value, 0)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export const DCAPerformanceChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const rawData = await loadDataset('portfolio', 'dca-performance-by-start');

      // Transform generic ChartDataPoint[] to specific ChartData[]
      const chartData: ChartData[] = rawData.map(item => ({
        Month: Number(item.Month),
        DCA_Start_2015: Number(item.DCA_Start_2015),
        DCA_Start_2017: Number(item.DCA_Start_2017),
        DCA_Start_2018: Number(item.DCA_Start_2018),
        DCA_Start_2021: Number(item.DCA_Start_2021),
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
      <h3 className="vi-chart-title">DCA Performance by Start Date</h3>
      <p className="vi-chart-description">
        $100/month invested in Bitcoin - results by start year (assumes zero fees)
      </p>

      <div className="vi-chart-wrapper">
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={data}
            margin={MARGIN_CONFIG.default}
            {...ANIMATION_CONFIG}
          >
            <CartesianGrid {...GRID_CONFIG} />

            <XAxis
              dataKey="Month"
              {...XAXIS_CONFIG}
              tickFormatter={(value) => formatDuration(value)}
            >
              <Label
                value="Time Period"
                position="insideBottom"
                offset={-10}
                style={{ fill: CHART_COLORS.textMuted }}
              />
            </XAxis>

            <YAxis
              {...YAXIS_CONFIG}
              scale="log"
              domain={[100, 200000]}
              ticks={[100, 1000, 10000, 100000]}
              tickFormatter={(value) => formatCurrency(value, 0)}
            >
              <Label
                value="Portfolio Value (USD, log scale)"
                angle={-90}
                position="insideLeft"
                style={{ fill: CHART_COLORS.textMuted, textAnchor: 'middle' }}
              />
            </YAxis>

            <Tooltip content={<DCAPerformanceTooltip />} />

            <Legend
              {...LEGEND_CONFIG}
              formatter={(value) => value.replace('DCA_Start_', 'Started ')}
            />

            <Line
              type="monotone"
              dataKey="DCA_Start_2015"
              name="DCA_Start_2015"
              stroke={CHART_COLORS.gold}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="DCA_Start_2017"
              name="DCA_Start_2017"
              stroke={CHART_COLORS.green}
              strokeWidth={2.5}
              dot={false}
              strokeDasharray="5 5"
            />

            <Line
              type="monotone"
              dataKey="DCA_Start_2018"
              name="DCA_Start_2018"
              stroke={CHART_COLORS.blue}
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="DCA_Start_2021"
              name="DCA_Start_2021"
              stroke={CHART_COLORS.red}
              strokeWidth={2}
              dot={false}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">Started 2015</p>
          <p className="text-xl font-bold text-vi-gold">$145k</p>
          <p className="text-xs text-vi-green mt-1">+2,917% ROI</p>
        </div>
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">Started 2017</p>
          <p className="text-xl font-bold text-vi-green">$85k</p>
          <p className="text-xs text-vi-green mt-1">+1,483% ROI</p>
        </div>
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">Started 2018</p>
          <p className="text-xl font-bold text-vi-blue">$38k</p>
          <p className="text-xs text-vi-green mt-1">+583% ROI</p>
        </div>
        <div className="p-4 bg-vi-chart-grid rounded-lg">
          <p className="text-xs text-vi-text-muted mb-1">Started 2021</p>
          <p className="text-xl font-bold text-vi-text-primary">$5.6k</p>
          <p className="text-xs text-vi-green mt-1">+17% ROI</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-vi-chart-grid rounded-lg text-sm">
        <p className="text-vi-text-muted">
          <strong className="text-vi-gold">Key Insight:</strong> DCA (Dollar-Cost Averaging) removes timing stress.
          ALL start dates shown are <strong className="text-vi-green">profitable</strong> over 4+ years, despite Bitcoin&apos;s
          70-80% drawdowns. Time in market &gt; timing the market.
        </p>
      </div>

      <div className="mt-4 p-4 border border-vi-chart-grid rounded-lg text-xs text-vi-text-muted">
        <p><strong>Assumptions:</strong> $100/month consistent investment | Zero fees (add 1-2% for realism) |
        Monthly average price used | Past performance doesn&apos;t guarantee future results</p>
      </div>
    </div>
  );
};
