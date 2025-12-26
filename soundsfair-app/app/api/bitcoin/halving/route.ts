/**
 * Bitcoin Halving API Route
 * Fetches current block height and calculates halving information
 */

import { NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/lib/cache';
import { CACHE_DURATIONS } from '@/lib/constants';
import {
  fetchCurrentBlockHeight,
  calculateNextHalving,
  getHistoricalHalvings,
  getFutureHalvings,
  getCountdownToHalving,
  calculateSupplyAtBlock,
  calculateSupplyPercentage,
  calculateDailyMiningReward,
  getHalvingMilestone,
} from '@/lib/bitcoin/halving';
import type { HalvingInfo, HistoricalHalving, ApiResponse } from '@/app/types/tools';

export const runtime = 'edge';
export const revalidate = 600; // Revalidate every 10 minutes

interface HalvingApiResponse {
  current: HalvingInfo;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
  };
  supply: {
    current: number;
    percentage: number;
    remaining: number;
    dailyReward: number;
  };
  historical: HistoricalHalving[];
  future?: HalvingInfo[];
  milestone?: string | null;
}

/**
 * GET /api/bitcoin/halving
 * Returns comprehensive halving information
 *
 * Query params:
 * - includeFuture: Include future halvings (default: false)
 * - futureCount: Number of future halvings to include (default: 5)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeFuture = searchParams.get('includeFuture') === 'true';
  const futureCount = parseInt(searchParams.get('futureCount') || '5');

  const cacheKey = `halving-data-${includeFuture}-${futureCount}`;

  // Try to get cached data
  const cached = getCachedData<HalvingApiResponse>(cacheKey, CACHE_DURATIONS.BLOCK_HEIGHT);
  if (cached) {
    return NextResponse.json<ApiResponse<HalvingApiResponse>>({
      success: true,
      data: cached,
      timestamp: Date.now(),
      cached: true
    });
  }

  try {
    // Fetch current block height
    const currentBlock = await fetchCurrentBlockHeight();

    // Calculate halving information
    const halvingInfo = calculateNextHalving(currentBlock);

    // Get countdown
    const countdown = getCountdownToHalving(halvingInfo);

    // Calculate supply information
    const currentSupply = calculateSupplyAtBlock(currentBlock);
    const supplyPercentage = calculateSupplyPercentage(currentBlock);
    const dailyReward = calculateDailyMiningReward(currentBlock);

    // Get historical halvings
    const historical = getHistoricalHalvings();

    // Get future halvings if requested
    let future: HalvingInfo[] | undefined;
    if (includeFuture) {
      const currentEra = halvingInfo.currentEra;
      const maxEra = currentEra + futureCount;
      future = getFutureHalvings(currentBlock, maxEra);
    }

    // Check for milestone
    const milestone = getHalvingMilestone(halvingInfo.blocksRemaining);

    const responseData: HalvingApiResponse = {
      current: halvingInfo,
      countdown,
      supply: {
        current: currentSupply,
        percentage: supplyPercentage,
        remaining: 21_000_000 - currentSupply,
        dailyReward,
      },
      historical,
      ...(future && { future }),
      ...(milestone && { milestone }),
    };

    // Cache the response
    setCachedData(cacheKey, responseData, CACHE_DURATIONS.BLOCK_HEIGHT);

    return NextResponse.json<ApiResponse<HalvingApiResponse>>({
      success: true,
      data: responseData,
      timestamp: Date.now(),
      cached: false
    });

  } catch (error) {
    console.error('Halving API error:', error);

    // Try to return any cached data (even if expired)
    const expiredCache = getCachedData<HalvingApiResponse>(cacheKey, Infinity);
    if (expiredCache) {
      return NextResponse.json<ApiResponse<HalvingApiResponse>>({
        success: true,
        data: expiredCache,
        timestamp: Date.now(),
        cached: true
      }, { status: 200 });
    }

    return NextResponse.json<ApiResponse<HalvingApiResponse>>({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch halving data',
        code: 'HALVING_ERROR'
      },
      timestamp: Date.now()
    }, { status: 503 });
  }
}

/**
 * GET /api/bitcoin/halving/block
 * Returns just the current block height (lightweight endpoint)
 */
export async function HEAD() {
  const cacheKey = 'block-height-only';

  // Try cache first
  const cached = getCachedData<number>(cacheKey, CACHE_DURATIONS.BLOCK_HEIGHT);
  if (cached) {
    return NextResponse.json<ApiResponse<{ blockHeight: number }>>({
      success: true,
      data: { blockHeight: cached },
      timestamp: Date.now(),
      cached: true
    });
  }

  try {
    const blockHeight = await fetchCurrentBlockHeight();

    setCachedData(cacheKey, blockHeight, CACHE_DURATIONS.BLOCK_HEIGHT);

    return NextResponse.json<ApiResponse<{ blockHeight: number }>>({
      success: true,
      data: { blockHeight },
      timestamp: Date.now(),
      cached: false
    });

  } catch {
    return NextResponse.json<ApiResponse<{ blockHeight: number }>>({
      success: false,
      error: {
        message: 'Failed to fetch block height',
        code: 'BLOCK_HEIGHT_ERROR'
      },
      timestamp: Date.now()
    }, { status: 503 });
  }
}
