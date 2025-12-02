import { NextRequest, NextResponse } from 'next/server';

// Cache for 24h for historical prices, 5min for recent prices
const CACHE_DURATION_HISTORICAL = 24 * 60 * 60; // 24 hours in seconds
const CACHE_DURATION_RECENT = 5 * 60; // 5 minutes in seconds

interface PriceCache {
  data: any;
  timestamp: number;
}

const cache = new Map<string, PriceCache>();

function getCacheKey(asset: string, from: string, to: string): string {
  return `${asset}-${from}-${to}`;
}

function isCacheValid(cacheEntry: PriceCache, isHistorical: boolean): boolean {
  const now = Date.now();
  const maxAge = isHistorical ? CACHE_DURATION_HISTORICAL * 1000 : CACHE_DURATION_RECENT * 1000;
  return (now - cacheEntry.timestamp) < maxAge;
}

async function fetchBitcoinPrice(from: string, to: string): Promise<any[]> {
  const fromDate = new Date(from).getTime();
  const toDate = new Date(to).getTime();

  try {
    // Primary: CoinCap API (unlimited historical data, free forever)
    const response = await fetch(
      `https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=${fromDate}&end=${toDate}`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );

    if (!response.ok) {
      throw new Error('CoinCap API failed');
    }

    const data = await response.json();

    return data.data.map((item: any) => ({
      date: new Date(item.time).toISOString().split('T')[0],
      price: parseFloat(item.priceUsd)
    }));
  } catch (error) {
    console.error('CoinCap error, trying CoinGecko fallback:', error);

    // Fallback to CoinGecko (365 days limit on free tier)
    return fetchBitcoinPriceCoinGecko(from, to);
  }
}

async function fetchBitcoinPriceCoinGecko(from: string, to: string): Promise<any[]> {
  const fromTimestamp = Math.floor(new Date(from).getTime() / 1000);
  const toTimestamp = Math.floor(new Date(to).getTime() / 1000);

  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`
  );

  if (!response.ok) {
    throw new Error('CoinGecko API also failed');
  }

  const data = await response.json();

  // Transform to our format
  return data.prices.map(([timestamp, price]: [number, number]) => ({
    date: new Date(timestamp).toISOString().split('T')[0],
    price: price
  }));
}


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const asset = searchParams.get('asset');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: from, to' },
        { status: 400 }
      );
    }

    // Only Bitcoin is supported - reject other assets
    const assetUpper = asset?.toUpperCase();
    if (asset && assetUpper !== 'BTC' && assetUpper !== 'BITCOIN') {
      return NextResponse.json(
        {
          error: 'Only Bitcoin is supported',
          message: 'This DCA calculator focuses exclusively on Bitcoin - the only truly scarce digital asset.'
        },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = getCacheKey('BTC', from, to);
    const cachedEntry = cache.get(cacheKey);

    const isHistorical = new Date(to) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Older than 7 days

    if (cachedEntry && isCacheValid(cachedEntry, isHistorical)) {
      return NextResponse.json({
        data: cachedEntry.data,
        cached: true,
        timestamp: cachedEntry.timestamp
      });
    }

    // Fetch fresh Bitcoin price data
    const priceData = await fetchBitcoinPrice(from, to);

    // Update cache
    cache.set(cacheKey, {
      data: priceData,
      timestamp: Date.now()
    });

    return NextResponse.json({
      data: priceData,
      cached: false,
      asset: 'BTC',
      from: from,
      to: to,
      count: priceData.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Bitcoin price data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
