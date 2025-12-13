/**
 * Bitcoin Fear & Greed Index Processing
 * Utilities for working with Alternative.me Fear & Greed Index data
 */

import { getFearGreedLevel, FEAR_GREED_LEVELS } from '../constants';
import type { FearGreedData, FearGreedPoint } from '@/app/types/tools';

/**
 * Raw API response from Alternative.me
 */
interface AlternativeMeResponse {
  name: string;
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update?: string;
  }>;
  metadata: {
    error?: string;
  };
}

/**
 * Fetch Fear & Greed Index from Alternative.me
 * @param limit Number of days of historical data (default: 1)
 * @returns Raw API response
 */
export async function fetchFearGreedFromAPI(limit: number = 1): Promise<AlternativeMeResponse> {
  const url = `https://api.alternative.me/fng/?limit=${limit}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Alternative.me API returned ${response.status}`);
  }

  const data = await response.json();

  if (data.metadata?.error) {
    throw new Error(data.metadata.error);
  }

  return data;
}

/**
 * Process raw API data into FearGreedData format
 * @param apiData Raw data from Alternative.me
 * @returns Processed Fear & Greed data
 */
export function processFearGreedData(apiData: AlternativeMeResponse): FearGreedData {
  if (!apiData.data || apiData.data.length === 0) {
    throw new Error('No Fear & Greed data available');
  }

  // Current (latest) data point
  const current = apiData.data[0];
  const value = parseInt(current.value);
  const timestamp = parseInt(current.timestamp) * 1000; // Convert to milliseconds

  // Get classification
  const levelKey = getFearGreedLevel(value);
  const level = FEAR_GREED_LEVELS[levelKey];
  const classification = level.label as FearGreedData['classification'];

  // Calculate 24h change if we have previous data
  let previousValue: number | undefined;
  let change24h: number | undefined;

  if (apiData.data.length > 1) {
    previousValue = parseInt(apiData.data[1].value);
    change24h = value - previousValue;
  }

  // Process historical data if available
  const historicalData: FearGreedPoint[] = apiData.data.map(point => ({
    date: new Date(parseInt(point.timestamp) * 1000).toISOString().split('T')[0],
    value: parseInt(point.value),
    classification: point.value_classification,
    timestamp: parseInt(point.timestamp) * 1000
  }));

  return {
    value,
    classification,
    timestamp,
    previousValue,
    change24h,
    historicalData: historicalData.length > 1 ? historicalData : undefined
  };
}

/**
 * Get color for Fear & Greed value
 * @param value Fear & Greed value (0-100)
 * @returns Hex color string
 */
export function getFearGreedColor(value: number): string {
  const levelKey = getFearGreedLevel(value);
  return FEAR_GREED_LEVELS[levelKey].color;
}

/**
 * Get description for Fear & Greed level
 * @param value Fear & Greed value (0-100)
 * @returns Description text
 */
export function getFearGreedDescription(value: number): string {
  const levelKey = getFearGreedLevel(value);

  const descriptions = {
    EXTREME_FEAR: 'Markets are experiencing extreme fear. This could present a buying opportunity for long-term investors.',
    FEAR: 'Fear is prevalent in the market. Investors are worried about potential losses.',
    NEUTRAL: 'The market sentiment is neutral. Neither fear nor greed is dominating.',
    GREED: 'Greed is driving the market. Investors are becoming optimistic and prices may be rising.',
    EXTREME_GREED: 'Markets are in extreme greed. This could indicate an overheated market and potential correction ahead.'
  };

  return descriptions[levelKey];
}

/**
 * Get trading suggestion based on Fear & Greed level
 * @param value Fear & Greed value (0-100)
 * @returns Trading suggestion (educational purposes only)
 */
export function getFearGreedSuggestion(value: number): string {
  const levelKey = getFearGreedLevel(value);

  const suggestions = {
    EXTREME_FEAR: 'Consider: This might be a good time to accumulate, as prices are often lower during extreme fear.',
    FEAR: 'Consider: Cautious buying opportunities may be present. Research before investing.',
    NEUTRAL: 'Consider: Normal market conditions. Follow your investment strategy.',
    GREED: 'Consider: Market may be overheating. Be cautious with new positions.',
    EXTREME_GREED: 'Consider: High risk of correction. Consider taking profits or waiting for better entry points.'
  };

  return suggestions[levelKey];
}

/**
 * Calculate average Fear & Greed over a period
 * @param data Array of historical Fear & Greed points
 * @returns Average value
 */
export function calculateAverageFearGreed(data: FearGreedPoint[]): number {
  if (data.length === 0) return 50; // Neutral default

  const sum = data.reduce((acc, point) => acc + point.value, 0);
  return Math.round(sum / data.length);
}

/**
 * Find extreme points in historical data
 * @param data Array of historical Fear & Greed points
 * @returns Object with highest and lowest points
 */
export function findFearGreedExtremes(data: FearGreedPoint[]): {
  highest: FearGreedPoint | null;
  lowest: FearGreedPoint | null;
} {
  if (data.length === 0) {
    return { highest: null, lowest: null };
  }

  const highest = data.reduce((max, point) =>
    point.value > max.value ? point : max
  , data[0]);

  const lowest = data.reduce((min, point) =>
    point.value < min.value ? point : min
  , data[0]);

  return { highest, lowest };
}

/**
 * Calculate trend direction over recent period
 * @param data Array of historical Fear & Greed points (most recent first)
 * @param days Number of days to analyze (default: 7)
 * @returns Trend direction: 'up', 'down', or 'stable'
 */
export function calculateFearGreedTrend(
  data: FearGreedPoint[],
  days: number = 7
): 'up' | 'down' | 'stable' {
  if (data.length < days) {
    return 'stable';
  }

  const recentData = data.slice(0, days);
  const firstValue = recentData[recentData.length - 1].value;
  const lastValue = recentData[0].value;
  const change = lastValue - firstValue;

  // Consider stable if change is less than 5 points
  if (Math.abs(change) < 5) {
    return 'stable';
  }

  return change > 0 ? 'up' : 'down';
}

/**
 * Get emoji for Fear & Greed level
 * @param value Fear & Greed value (0-100)
 * @returns Emoji string
 */
export function getFearGreedEmoji(value: number): string {
  const levelKey = getFearGreedLevel(value);

  const emojis = {
    EXTREME_FEAR: '😱',
    FEAR: '😨',
    NEUTRAL: '😐',
    GREED: '😃',
    EXTREME_GREED: '🤑'
  };

  return emojis[levelKey];
}

/**
 * Check if value is in a specific Fear & Greed range
 * @param value Fear & Greed value (0-100)
 * @param targetLevel Target level to check
 * @returns True if value is in the target level range
 */
export function isInFearGreedLevel(
  value: number,
  targetLevel: keyof typeof FEAR_GREED_LEVELS
): boolean {
  const level = FEAR_GREED_LEVELS[targetLevel];
  return value >= level.min && value <= level.max;
}

/**
 * Get historical statistics
 * @param data Array of historical Fear & Greed points
 * @returns Statistics object
 */
export function calculateFearGreedStats(data: FearGreedPoint[]): {
  average: number;
  median: number;
  min: number;
  max: number;
  volatility: number;
  daysInExtremeFear: number;
  daysInExtremeGreed: number;
} {
  if (data.length === 0) {
    return {
      average: 50,
      median: 50,
      min: 50,
      max: 50,
      volatility: 0,
      daysInExtremeFear: 0,
      daysInExtremeGreed: 0
    };
  }

  const values = data.map(d => d.value).sort((a, b) => a - b);

  const average = calculateAverageFearGreed(data);
  const median = values[Math.floor(values.length / 2)];
  const min = values[0];
  const max = values[values.length - 1];

  // Calculate volatility (standard deviation)
  const variance = data.reduce((acc, point) =>
    acc + Math.pow(point.value - average, 2), 0
  ) / data.length;
  const volatility = Math.sqrt(variance);

  // Count extreme days
  const daysInExtremeFear = data.filter(d => d.value <= 24).length;
  const daysInExtremeGreed = data.filter(d => d.value >= 76).length;

  return {
    average: Math.round(average),
    median,
    min,
    max,
    volatility: Math.round(volatility * 100) / 100,
    daysInExtremeFear,
    daysInExtremeGreed
  };
}

/**
 * Format Fear & Greed value for display
 * @param value Fear & Greed value (0-100)
 * @returns Formatted string
 */
export function formatFearGreedValue(value: number): string {
  const levelKey = getFearGreedLevel(value);
  const level = FEAR_GREED_LEVELS[levelKey];
  return `${value} - ${level.label}`;
}
