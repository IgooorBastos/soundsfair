/**
 * React Hook for Bitcoin Price
 * Provides real-time Bitcoin price updates with auto-refresh
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { BitcoinPrice, Currency } from '@/app/types/tools';

interface UseBitcoinPriceOptions {
  /**
   * Currencies to fetch prices for
   * @default ['usd']
   */
  currencies?: Currency[];

  /**
   * Auto-refresh interval in milliseconds
   * @default 60000 (1 minute)
   */
  refreshInterval?: number;

  /**
   * Enable auto-refresh
   * @default true
   */
  autoRefresh?: boolean;

  /**
   * Callback when price updates
   */
  onPriceUpdate?: (price: BitcoinPrice) => void;

  /**
   * Callback when error occurs
   */
  onError?: (error: Error) => void;
}

interface UseBitcoinPriceReturn {
  /**
   * Current Bitcoin price data
   */
  price: BitcoinPrice | null;

  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error state
   */
  error: Error | null;

  /**
   * Manually refresh the price
   */
  refresh: () => Promise<void>;

  /**
   * Last update timestamp
   */
  lastUpdated: number | null;

  /**
   * Whether data is from cache
   */
  isCached: boolean;
}

/**
 * Hook to fetch and manage Bitcoin price
 *
 * @example
 * ```tsx
 * const { price, loading, error, refresh } = useBitcoinPrice({
 *   currencies: ['usd', 'eur'],
 *   refreshInterval: 30000,
 * });
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return <div>BTC Price: ${price?.usd}</div>;
 * ```
 */
export function useBitcoinPrice(options: UseBitcoinPriceOptions = {}): UseBitcoinPriceReturn {
  const {
    currencies = ['usd'],
    refreshInterval = 60000,
    autoRefresh = true,
    onPriceUpdate,
    onError
  } = options;

  const [price, setPrice] = useState<BitcoinPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isCached, setIsCached] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch Bitcoin price from API
   */
  const fetchPrice = useCallback(async () => {
    try {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const currenciesParam = currencies.join(',');
      const response = await fetch(
        `/api/bitcoin/price?currencies=${currenciesParam}`,
        { signal: abortController.signal }
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch Bitcoin price');
      }

      const priceData = data.data;
      setPrice(priceData);
      setError(null);
      setLastUpdated(data.timestamp);
      setIsCached(data.cached || false);

      // Call onPriceUpdate callback if provided
      if (onPriceUpdate) {
        onPriceUpdate(priceData);
      }

    } catch (err) {
      // Ignore abort errors
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);

      // Call onError callback if provided
      if (onError) {
        onError(error);
      }

      console.error('Failed to fetch Bitcoin price:', error);

    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [currencies, onPriceUpdate, onError]);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchPrice();
  }, [fetchPrice]);

  /**
   * Set up auto-refresh
   */
  useEffect(() => {
    // Initial fetch
    fetchPrice();

    // Set up interval for auto-refresh
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchPrice();
      }, refreshInterval);
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchPrice, autoRefresh, refreshInterval]);

  return {
    price,
    loading,
    error,
    refresh,
    lastUpdated,
    isCached,
  };
}

/**
 * Hook to get a specific currency price
 * Simplified version that returns just the price number
 *
 * @example
 * ```tsx
 * const { price: usdPrice, loading } = useBitcoinPriceSimple('usd');
 * return <div>${usdPrice || '...'}</div>;
 * ```
 */
export function useBitcoinPriceSimple(currency: Currency = 'usd') {
  const { price, loading, error } = useBitcoinPrice({
    currencies: [currency],
    refreshInterval: 60000,
  });

  return {
    price: price?.[currency] || null,
    loading,
    error,
  };
}

/**
 * Hook to monitor price changes
 * Useful for displaying price change indicators
 */
export function useBitcoinPriceChange(currency: Currency = 'usd') {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<{
    amount: number;
    percent: number;
    direction: 'up' | 'down' | 'stable';
  } | null>(null);

  const { price, loading, error } = useBitcoinPrice({
    currencies: [currency],
    refreshInterval: 60000,
    onPriceUpdate: (newPrice) => {
      const currentPrice = newPrice[currency];
      if (currentPrice && previousPrice !== null) {
        const change = currentPrice - previousPrice;
        const changePercent = (change / previousPrice) * 100;

        setPriceChange({
          amount: change,
          percent: changePercent,
          direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        });
      }
      setPreviousPrice(currentPrice || null);
    },
  });

  return {
    price: price?.[currency] || null,
    priceChange,
    loading,
    error,
  };
}

/**
 * Hook to format Bitcoin price
 * Returns formatted string with currency symbol
 */
export function useFormattedBitcoinPrice(currency: Currency = 'usd') {
  const { price, loading, error } = useBitcoinPriceSimple(currency);

  const formattedPrice = price
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
    : null;

  return {
    formattedPrice,
    rawPrice: price,
    loading,
    error,
  };
}
