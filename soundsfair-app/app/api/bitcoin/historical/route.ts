/**
 * Bitcoin Historical Price API Route
 * Fetches Bitcoin price for a specific date
 * Pattern: CoinCap (primary) → CoinGecko (fallback) → Mock data (emergency)
 *
 * Note: Uses CoinCap as primary because it has unlimited historical data (free forever)
 * CoinGecko free tier only allows 365 days of historical data
 */

import { NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/lib/cache';
import { CACHE_DURATIONS } from '@/lib/constants';
import type { HistoricalPrice, ApiResponse } from '@/app/types/tools';

export const runtime = 'edge';
export const revalidate = 86400; // Revalidate every 24 hours (historical data doesn't change)

/**
 * GET /api/bitcoin/historical?date=YYYY-MM-DD
 * Returns Bitcoin price for a specific date
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');

  if (!dateParam) {
    return NextResponse.json<ApiResponse<HistoricalPrice>>({
      success: false,
      error: {
        message: 'Date parameter is required (format: YYYY-MM-DD)',
        code: 'MISSING_DATE'
      },
      timestamp: Date.now()
    }, { status: 400 });
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateParam)) {
    return NextResponse.json<ApiResponse<HistoricalPrice>>({
      success: false,
      error: {
        message: 'Invalid date format. Use YYYY-MM-DD',
        code: 'INVALID_DATE_FORMAT'
      },
      timestamp: Date.now()
    }, { status: 400 });
  }

  // Check if date is in valid range (Bitcoin started ~2010-07-18)
  const requestedDate = new Date(dateParam);
  const bitcoinFirstDate = new Date('2010-07-18');
  const today = new Date();

  if (requestedDate < bitcoinFirstDate) {
    return NextResponse.json<ApiResponse<HistoricalPrice>>({
      success: false,
      error: {
        message: 'Bitcoin price data is only available from 2010-07-18 onwards',
        code: 'DATE_TOO_EARLY'
      },
      timestamp: Date.now()
    }, { status: 400 });
  }

  if (requestedDate > today) {
    return NextResponse.json<ApiResponse<HistoricalPrice>>({
      success: false,
      error: {
        message: 'Cannot fetch future Bitcoin prices',
        code: 'DATE_IN_FUTURE'
      },
      timestamp: Date.now()
    }, { status: 400 });
  }

  const cacheKey = `btc-historical-${dateParam}`;

  // Try to get cached data first (historical data doesn't change, so cache forever)
  const cached = getCachedData<HistoricalPrice>(cacheKey, CACHE_DURATIONS.HISTORICAL_PRICE);
  if (cached) {
    return NextResponse.json<ApiResponse<HistoricalPrice>>({
      success: true,
      data: cached,
      timestamp: Date.now(),
      cached: true
    });
  }

  try {
    // Primary source: CoinCap API (unlimited historical data, free forever)
    const priceData = await fetchFromCoinCap(dateParam);

    // Cache the successful response (24 hours, but historical data doesn't really change)
    setCachedData(cacheKey, priceData, CACHE_DURATIONS.HISTORICAL_PRICE);

    return NextResponse.json<ApiResponse<HistoricalPrice>>({
      success: true,
      data: priceData,
      timestamp: Date.now(),
      cached: false
    });

  } catch (primaryError) {
    console.error('CoinCap historical API failed:', primaryError);

    try {
      // Fallback: Try CoinGecko (limited to 365 days on free tier)
      const priceData = await fetchFromCoinGecko(dateParam);

      // Cache the fallback response
      setCachedData(cacheKey, priceData, CACHE_DURATIONS.HISTORICAL_PRICE);

      return NextResponse.json<ApiResponse<HistoricalPrice>>({
        success: true,
        data: priceData,
        timestamp: Date.now(),
        cached: false
      });

    } catch (fallbackError) {
      console.error('CoinGecko historical API failed:', fallbackError);

      // Production should never serve mocked financial data.
      if (process.env.NODE_ENV !== 'production') {
        try {
          // Dev-only last resort: Use mock data based on approximate historical prices
          const priceData = getMockHistoricalPrice(dateParam);

          // Cache the mock data
          setCachedData(cacheKey, priceData, CACHE_DURATIONS.HISTORICAL_PRICE);

          return NextResponse.json<ApiResponse<HistoricalPrice>>({
            success: true,
            data: priceData,
            timestamp: Date.now(),
            cached: false
          });
        } catch {
          // fall through to "all sources failed"
        }
      }

      // Try to get any cached data (even if expired)
      const expiredCache = getCachedData<HistoricalPrice>(cacheKey, Infinity);
      if (expiredCache) {
        return NextResponse.json<ApiResponse<HistoricalPrice>>({
          success: true,
          data: expiredCache,
          timestamp: Date.now(),
          cached: true
        }, { status: 200 });
      }

      // All sources failed
      return NextResponse.json<ApiResponse<HistoricalPrice>>({
        success: false,
        error: {
          message: 'Failed to fetch historical Bitcoin price from all sources',
          code: 'HISTORICAL_PRICE_FETCH_ERROR'
        },
        timestamp: Date.now()
      }, { status: 503 });
    }
  }
}

/**
 * Fetch historical price from CoinCap API (PRIMARY - unlimited historical data)
 * Uses the history endpoint with timestamp conversion
 */
async function fetchFromCoinCap(dateString: string): Promise<HistoricalPrice> {
  // CoinCap requires Unix timestamp in milliseconds
  const date = new Date(dateString);
  const startTimestamp = date.getTime();
  const endTimestamp = startTimestamp + (24 * 60 * 60 * 1000); // Add 24 hours

  const url = `https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=${startTimestamp}&end=${endTimestamp}`;

  const response = await fetch(url, {
    next: { revalidate: 86400 }
  });

  if (!response.ok) {
    throw new Error(`CoinCap API returned ${response.status}`);
  }

  const data = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error('No historical data found for this date');
  }

  // Get the first data point (closest to the requested date)
  const priceData = data.data[0];
  const price = parseFloat(priceData.priceUsd);

  if (isNaN(price) || price <= 0) {
    throw new Error('Invalid price data received');
  }

  return {
    date: dateString,
    price,
    timestamp: Date.now()
  };
}

/**
 * Fetch historical price from CoinGecko API (FALLBACK - only 365 days on free tier)
 * Uses the market_chart/range endpoint with timestamp conversion
 */
async function fetchFromCoinGecko(dateString: string): Promise<HistoricalPrice> {
  const date = new Date(dateString);
  const fromTimestamp = Math.floor(date.getTime() / 1000);
  const toTimestamp = fromTimestamp + (24 * 60 * 60); // Add 24 hours

  const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;

  const response = await fetch(url, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API returned ${response.status}`);
  }

  const data = await response.json();

  if (!data.prices || data.prices.length === 0) {
    throw new Error('Invalid response from CoinGecko - missing price data');
  }

  // Get the first price [timestamp, price]
  const [, price] = data.prices[0];

  if (isNaN(price) || price <= 0) {
    throw new Error('Invalid price data received');
  }

  return {
    date: dateString,
    price,
    timestamp: Date.now()
  };
}

/**
 * Generate mock historical price data as last resort
 * Based on approximate real historical Bitcoin prices
 */
function getMockHistoricalPrice(dateString: string): HistoricalPrice {
  console.warn('⚠️ Using mock Bitcoin price data for', dateString);

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth();

  // Approximate historical prices based on real data
  let basePrice = 50000; // Default fallback

  if (year === 2010) basePrice = 0.5;
  else if (year === 2011) basePrice = 10;
  else if (year === 2012) basePrice = 12;
  else if (year === 2013 && month < 11) basePrice = 150;
  else if (year === 2013) basePrice = 900;
  else if (year === 2014) basePrice = 600;
  else if (year === 2015) basePrice = 250;
  else if (year === 2016) basePrice = 600;
  else if (year === 2017 && month < 11) basePrice = 4000;
  else if (year === 2017) basePrice = 15000;
  else if (year === 2018) basePrice = 6500;
  else if (year === 2019) basePrice = 7500;
  else if (year === 2020 && month < 10) basePrice = 10000;
  else if (year === 2020) basePrice = 18000;
  else if (year === 2021 && month < 4) basePrice = 50000;
  else if (year === 2021 && month < 7) basePrice = 35000;
  else if (year === 2021) basePrice = 55000;
  else if (year === 2022) basePrice = 20000;
  else if (year === 2023) basePrice = 30000;
  else if (year === 2024) basePrice = 65000;
  else if (year >= 2025) basePrice = 95000;

  // Add some volatility (±5%)
  const volatility = (Math.random() - 0.5) * 0.1;
  const price = basePrice * (1 + volatility);

  return {
    date: dateString,
    price: Math.round(price * 100) / 100,
    timestamp: Date.now()
  };
}
