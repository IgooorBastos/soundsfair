/**
 * Bitcoin Fear & Greed Index API Route
 * Fetches and processes data from Alternative.me
 */

import { NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/lib/cache';
import { CACHE_DURATIONS } from '@/lib/constants';
import {
  fetchFearGreedFromAPI,
  processFearGreedData,
  getFearGreedColor,
  getFearGreedDescription,
  getFearGreedSuggestion,
  findFearGreedExtremes,
  calculateFearGreedTrend,
  getFearGreedEmoji,
  calculateFearGreedStats,
} from '@/lib/bitcoin/fear-greed';
import type { FearGreedData, FearGreedPoint, ApiResponse } from '@/app/types/tools';

export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

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

/**
 * GET /api/bitcoin/fear-greed
 * Returns Fear & Greed Index data
 *
 * Query params:
 * - limit: Number of days of historical data (default: 1, max: 365)
 * - includeStats: Include statistical analysis (default: false)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const includeStats = searchParams.get('includeStats') === 'true';

  // Parse and validate limit
  let limit = limitParam ? parseInt(limitParam) : 1;
  if (isNaN(limit) || limit < 1) limit = 1;
  if (limit > 365) limit = 365; // Max 1 year of data

  const cacheKey = `fear-greed-${limit}-${includeStats}`;

  // Try to get cached data
  const cached = getCachedData<FearGreedApiResponse>(cacheKey, CACHE_DURATIONS.FEAR_GREED);
  if (cached) {
    return NextResponse.json<ApiResponse<FearGreedApiResponse>>({
      success: true,
      data: cached,
      timestamp: Date.now(),
      cached: true
    });
  }

  try {
    // Fetch from Alternative.me API
    const apiData = await fetchFearGreedFromAPI(limit);

    // Process the data
    const fearGreedData = processFearGreedData(apiData);

    // Get metadata
    const color = getFearGreedColor(fearGreedData.value);
    const description = getFearGreedDescription(fearGreedData.value);
    const suggestion = getFearGreedSuggestion(fearGreedData.value);
    const emoji = getFearGreedEmoji(fearGreedData.value);

    const responseData: FearGreedApiResponse = {
      current: fearGreedData,
      metadata: {
        color,
        description,
        suggestion,
        emoji,
      },
    };

    // Add statistics if requested and we have historical data
    if (includeStats && fearGreedData.historicalData && fearGreedData.historicalData.length > 1) {
      const historicalData = fearGreedData.historicalData;
      const stats = calculateFearGreedStats(historicalData);
      const extremes = findFearGreedExtremes(historicalData);
      const trend = calculateFearGreedTrend(historicalData);

      responseData.stats = {
        ...stats,
        extremes,
        trend,
        daysAnalyzed: historicalData.length,
      };
    }

    // Cache the response
    setCachedData(cacheKey, responseData, CACHE_DURATIONS.FEAR_GREED);

    return NextResponse.json<ApiResponse<FearGreedApiResponse>>({
      success: true,
      data: responseData,
      timestamp: Date.now(),
      cached: false
    });

  } catch (error) {
    console.error('Fear & Greed API error:', error);

    // Try to return any cached data (even if expired)
    const expiredCache = getCachedData<FearGreedApiResponse>(cacheKey, Infinity);
    if (expiredCache) {
      return NextResponse.json<ApiResponse<FearGreedApiResponse>>({
        success: true,
        data: expiredCache,
        timestamp: Date.now(),
        cached: true
      }, { status: 200 });
    }

    return NextResponse.json<ApiResponse<FearGreedApiResponse>>({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch Fear & Greed data',
        code: 'FEAR_GREED_ERROR'
      },
      timestamp: Date.now()
    }, { status: 503 });
  }
}

/**
 * GET /api/bitcoin/fear-greed/simple
 * Returns just the current value (lightweight endpoint)
 */
export async function HEAD() {
  const cacheKey = 'fear-greed-simple';

  // Try cache first
  const cached = getCachedData<{ value: number; classification: string }>(
    cacheKey,
    CACHE_DURATIONS.FEAR_GREED
  );

  if (cached) {
    return NextResponse.json<ApiResponse<{ value: number; classification: string }>>({
      success: true,
      data: cached,
      timestamp: Date.now(),
      cached: true
    });
  }

  try {
    const apiData = await fetchFearGreedFromAPI(1);
    const fearGreedData = processFearGreedData(apiData);

    const simpleData = {
      value: fearGreedData.value,
      classification: fearGreedData.classification,
    };

    setCachedData(cacheKey, simpleData, CACHE_DURATIONS.FEAR_GREED);

    return NextResponse.json<ApiResponse<{ value: number; classification: string }>>({
      success: true,
      data: simpleData,
      timestamp: Date.now(),
      cached: false
    });

  } catch {
    return NextResponse.json<ApiResponse<{ value: number; classification: string }>>({
      success: false,
      error: {
        message: 'Failed to fetch Fear & Greed data',
        code: 'FEAR_GREED_ERROR'
      },
      timestamp: Date.now()
    }, { status: 503 });
  }
}
