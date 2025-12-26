/**
 * Bitcoin Price API Route
 * Fetches real-time Bitcoin price with fallback strategies
 * Pattern: CoinCap (primary) → CoinGecko (fallback) → Cached data (emergency)
 */

import { NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/lib/cache';
import { API_ENDPOINTS, CACHE_DURATIONS, BITCOIN_CONSTANTS } from '@/lib/constants';
import type { BitcoinPrice, ApiResponse } from '@/app/types/tools';

export const runtime = 'edge';
export const revalidate = 60; // Revalidate every 60 seconds

/**
 * GET /api/bitcoin/price
 * Returns current Bitcoin price in multiple currencies
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currencies = searchParams.get('currencies')?.split(',') || ['usd'];

  const cacheKey = `btc-price-${currencies.join('-')}`;

  // Try to get cached data first
  const cached = getCachedData<BitcoinPrice>(cacheKey, CACHE_DURATIONS.PRICE_CURRENT);
  if (cached) {
    return NextResponse.json<ApiResponse<BitcoinPrice>>({
      success: true,
      data: cached,
      timestamp: Date.now(),
      cached: true
    });
  }

  try {
    // Primary source: CoinCap API
    const priceData = await fetchFromCoinCap();

    // Cache the successful response
    setCachedData(cacheKey, priceData, CACHE_DURATIONS.PRICE_CURRENT);

    return NextResponse.json<ApiResponse<BitcoinPrice>>({
      success: true,
      data: priceData,
      timestamp: Date.now(),
      cached: false
    });

  } catch (primaryError) {
    console.error('CoinCap API failed:', primaryError);

    try {
      // Fallback source: CoinGecko API
      const priceData = await fetchFromCoinGecko(currencies);

      // Cache the fallback response
      setCachedData(cacheKey, priceData, CACHE_DURATIONS.PRICE_CURRENT);

      return NextResponse.json<ApiResponse<BitcoinPrice>>({
        success: true,
        data: priceData,
        timestamp: Date.now(),
        cached: false
      });

    } catch (fallbackError) {
      console.error('CoinGecko API failed:', fallbackError);

      // Try to get any cached data (even if expired)
      const expiredCache = getCachedData<BitcoinPrice>(cacheKey, Infinity);
      if (expiredCache) {
        return NextResponse.json<ApiResponse<BitcoinPrice>>({
          success: true,
          data: expiredCache,
          timestamp: Date.now(),
          cached: true
        }, { status: 200 });
      }

      // All sources failed
      return NextResponse.json<ApiResponse<BitcoinPrice>>({
        success: false,
        error: {
          message: 'Failed to fetch Bitcoin price from all sources',
          code: 'PRICE_FETCH_ERROR'
        },
        timestamp: Date.now()
      }, { status: 503 });
    }
  }
}

/**
 * Fetch price from CoinCap API
 */
async function fetchFromCoinCap(): Promise<BitcoinPrice> {
  const response = await fetch(API_ENDPOINTS.COINCAP_BITCOIN, {
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`CoinCap API returned ${response.status}`);
  }

  const data = await response.json();
  const asset = data.data;

  // CoinCap returns USD by default
  const usdPrice = parseFloat(asset.priceUsd);
  const change24h = parseFloat(asset.changePercent24Hr);
  const marketCap = parseFloat(asset.marketCapUsd);
  const volume24h = parseFloat(asset.volumeUsd24Hr);

  // For other currencies, we need to fetch exchange rates
  const rates = await fetchExchangeRates();

  const priceData: BitcoinPrice = {
    usd: usdPrice,
    sats: BITCOIN_CONSTANTS.SATOSHI_PER_BTC, // 1 BTC = 100M sats (constant)
    change24h,
    marketCap,
    volume24h,
    timestamp: Date.now()
  };

  // Add other currencies if requested
  if (rates.eur) priceData.eur = usdPrice * rates.eur;
  if (rates.gbp) priceData.gbp = usdPrice * rates.gbp;
  if (rates.brl) priceData.brl = usdPrice * rates.brl;
  if (rates.jpy) priceData.jpy = usdPrice * rates.jpy;
  if (rates.aud) priceData.aud = usdPrice * rates.aud;
  if (rates.cad) priceData.cad = usdPrice * rates.cad;

  return priceData;
}

/**
 * Fetch price from CoinGecko API (fallback)
 */
async function fetchFromCoinGecko(currencies: string[]): Promise<BitcoinPrice> {
  const currenciesParam = currencies.join(',');
  const url = `${API_ENDPOINTS.COINGECKO_SIMPLE_PRICE}?ids=bitcoin&vs_currencies=${currenciesParam}&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;

  const response = await fetch(url, {
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API returned ${response.status}`);
  }

  const data = await response.json();
  const btcData = data.bitcoin;

  if (!btcData) {
    throw new Error('Bitcoin data not found in CoinGecko response');
  }

  const priceData: BitcoinPrice = {
    usd: btcData.usd,
    sats: BITCOIN_CONSTANTS.SATOSHI_PER_BTC,
    change24h: btcData.usd_24h_change || 0,
    marketCap: btcData.usd_market_cap,
    volume24h: btcData.usd_24h_vol,
    timestamp: Date.now()
  };

  // Add other currencies if available
  if (btcData.eur) priceData.eur = btcData.eur;
  if (btcData.gbp) priceData.gbp = btcData.gbp;
  if (btcData.brl) priceData.brl = btcData.brl;
  if (btcData.jpy) priceData.jpy = btcData.jpy;
  if (btcData.aud) priceData.aud = btcData.aud;
  if (btcData.cad) priceData.cad = btcData.cad;

  return priceData;
}

/**
 * Fetch exchange rates (USD to other currencies)
 * Uses a simple cached exchange rate API
 */
async function fetchExchangeRates(): Promise<Record<string, number>> {
  const cacheKey = 'exchange-rates';
  const cached = getCachedData<Record<string, number>>(cacheKey, 3600); // Cache for 1 hour

  if (cached) {
    return cached;
  }

  try {
    // Use a free exchange rate API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();

    const rates: Record<string, number> = {
      eur: data.rates.EUR || 0.85,
      gbp: data.rates.GBP || 0.73,
      brl: data.rates.BRL || 5.0,
      jpy: data.rates.JPY || 110,
      aud: data.rates.AUD || 1.35,
      cad: data.rates.CAD || 1.25,
    };

    setCachedData(cacheKey, rates, 3600);
    return rates;

  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Return default rates as fallback
    return {
      eur: 0.85,
      gbp: 0.73,
      brl: 5.0,
      jpy: 110,
      aud: 1.35,
      cad: 1.25,
    };
  }
}
