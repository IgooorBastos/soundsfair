/**
 * ISSUANCE SCHEDULE CHART
 * Level 3: Shows Bitcoin halving schedule and declining block rewards
 *
 * Visualization: Step-down chart showing reward halvings
 * Data: issuance-schedule.csv
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
import { formatYear, formatBTC, formatNumber } from '@/lib/charts/formatters';
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
  Block_Height: number;
  Block_Reward_BTC: number;
  Daily_Issuance_BTC: number;
  Annual_Issuance_BTC: number;
}

export const IssuanceScheduleChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const chartData = await loadDataset('blockchain', 'issuance-schedule');
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
            Block Reward: {formatBTC(data.Block_Reward_BTC, 3)}
          </p>
          <p style={TOOLTIP_CONFIG.itemStyle}>
            Daily Issuance: {formatBTC(data.Daily_Issuance_BTC, 0)}
          </p>
          <p style={TOOLTIP_CONFIG.itemStyle}>
            Block Height: {formatNumber(data.Block_Height, 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  const halvingYears = [2012, 2016, 2020, 2024, 2028];

  return (
    <div className="vi-chart-container">
      <h3 className="vi-chart-title">Bitcoin Issuance Schedule (Halvings)</h3>
      <p className="vi-chart-description">
        Block reward decreases by 50% every 210,000 blocks (~4 years)
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
              domain={[2009, 2060]}
              ticks={[2009, 2012, 2016, 2020, 2024, 2028, 2032, 2040, 2060]}
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
              scale="log"
              domain={[0.01, 100]}
              ticks={[0.01, 0.1, 1, 10, 50]}
              tickFormatter={(value) => value >= 1 ? value.toString() : value.toFixed(2)}
            >
              <Label
                value="Block Reward (BTC per block)"
                angle={-90}
                position="insideLeft"
                style={{ fill: CHART_COLORS.textMuted, textAnchor: 'middle' }}
              />
            </YAxis>

            <Tooltip content={<CustomTooltip />} />

            {/* Reference lines for halving events */}
            {halvingYears.map((year) => (
              <ReferenceLine
                key={year}
                x={year}
                stroke={CHART_COLORS.gold}
                strokeDasharray="3 3"
                opacity={0.3}
              />
            ))}

            <Line
              type="stepAfter"
              dataKey="Block_Reward_BTC"
              stroke={CHART_COLORS.gold}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-vi-chart-grid rounded">
          <p className="text-vi-text-muted mb-1">2009-2012</p>
          <p className="text-lg font-bold text-vi-gold">50 BTC</p>
        </div>
        <div className="p-3 bg-vi-chart-grid rounded">
          <p className="text-vi-text-muted mb-1">2012-2016</p>
          <p className="text-lg font-bold text-vi-gold">25 BTC</p>
        </div>
        <div className="p-3 bg-vi-chart-grid rounded">
          <p className="text-vi-text-muted mb-1">2016-2020</p>
          <p className="text-lg font-bold text-vi-gold">12.5 BTC</p>
        </div>
        <div className="p-3 bg-vi-chart-grid rounded">
          <p className="text-vi-text-muted mb-1">2020-2024</p>
          <p className="text-lg font-bold text-vi-gold">6.25 BTC</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-vi-chart-grid rounded-lg text-sm">
        <p className="text-vi-text-muted">
          <strong className="text-vi-gold">Key Insight:</strong> Bitcoin's issuance is <strong>predetermined and decreasing</strong>.
          Each halving cuts new supply by 50%, making Bitcoin increasingly scarce. Final bitcoin will be mined around 2140.
        </p>
      </div>
    </div>
  );
};
