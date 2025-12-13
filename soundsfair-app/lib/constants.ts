/**
 * Bitcoin Protocol Constants
 */
export const BITCOIN_CONSTANTS = {
  // Unit conversions
  SATOSHI_PER_BTC: 100_000_000,

  // Supply
  MAX_SUPPLY: 21_000_000,
  GENESIS_DATE: '2009-01-03',

  // Halving
  BLOCKS_PER_HALVING: 210_000,
  AVERAGE_BLOCK_TIME_MINUTES: 10,
  NEXT_HALVING_BLOCK: 1_050_000, // Expected ~2028
  CURRENT_REWARD: 3.125, // BTC per block (after 2024 halving)

  // Known halvings with dates
  HALVINGS: [
    { block: 0, date: '2009-01-03', reward: 50, era: 0 },
    { block: 210_000, date: '2012-11-28', reward: 25, era: 1 },
    { block: 420_000, date: '2016-07-09', reward: 12.5, era: 2 },
    { block: 630_000, date: '2020-05-11', reward: 6.25, era: 3 },
    { block: 840_000, date: '2024-04-20', reward: 3.125, era: 4 },
    { block: 1_050_000, date: '~2028-03/04', reward: 1.5625, era: 5 },
  ] as const,
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Price APIs
  COINCAP_BASE: 'https://api.coincap.io/v2',
  COINCAP_BITCOIN: 'https://api.coincap.io/v2/assets/bitcoin',
  COINGECKO_BASE: 'https://api.coingecko.com/api/v3',
  COINGECKO_SIMPLE_PRICE: 'https://api.coingecko.com/api/v3/simple/price',

  // Blockchain data
  MEMPOOL_BASE: 'https://mempool.space/api',
  MEMPOOL_BLOCK_HEIGHT: 'https://mempool.space/api/blocks/tip/height',
  BLOCKCHAIN_INFO_BLOCK_HEIGHT: 'https://blockchain.info/q/getblockcount',

  // Market sentiment
  FEAR_GREED_BASE: 'https://api.alternative.me',
  FEAR_GREED_CURRENT: 'https://api.alternative.me/fng/?limit=1',
  FEAR_GREED_HISTORICAL: 'https://api.alternative.me/fng/?limit=',
} as const;

/**
 * Cache durations in seconds
 */
export const CACHE_DURATIONS = {
  // Very short cache
  PRICE_CURRENT: 60, // 1 minute
  BLOCK_HEIGHT: 600, // 10 minutes (average block time)

  // Medium cache
  FEAR_GREED: 3600, // 1 hour
  HISTORICAL_PRICE: 86400, // 24 hours

  // Long cache
  STATIC_DATA: 604800, // 7 days
} as const;

/**
 * Fear & Greed Index classifications
 */
export const FEAR_GREED_LEVELS = {
  EXTREME_FEAR: { min: 0, max: 24, label: 'Extreme Fear', color: '#EF4444' },
  FEAR: { min: 25, max: 44, label: 'Fear', color: '#F59E0B' },
  NEUTRAL: { min: 45, max: 55, label: 'Neutral', color: '#6B7280' },
  GREED: { min: 56, max: 75, label: 'Greed', color: '#10B981' },
  EXTREME_GREED: { min: 76, max: 100, label: 'Extreme Greed', color: '#22C55E' },
} as const;

/**
 * Get Fear & Greed level from value
 */
export function getFearGreedLevel(value: number): keyof typeof FEAR_GREED_LEVELS {
  if (value <= 24) return 'EXTREME_FEAR';
  if (value <= 44) return 'FEAR';
  if (value <= 55) return 'NEUTRAL';
  if (value <= 75) return 'GREED';
  return 'EXTREME_GREED';
}

/**
 * Supported fiat currencies
 */
export const SUPPORTED_CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', code: 'usd' },
  EUR: { symbol: '€', name: 'Euro', code: 'eur' },
  GBP: { symbol: '£', name: 'British Pound', code: 'gbp' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'brl' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'jpy' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'aud' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'cad' },
} as const;

/**
 * Bitcoin units
 */
export const BITCOIN_UNITS = {
  BTC: { name: 'Bitcoin', symbol: '₿', decimals: 8 },
  MBTC: { name: 'MilliBitcoin', symbol: 'mBTC', decimals: 5, multiplier: 0.001 },
  BITS: { name: 'Bits (Microbitcoin)', symbol: 'bits', decimals: 2, multiplier: 0.000001 },
  SATS: { name: 'Satoshis', symbol: 'sats', decimals: 0, multiplier: 0.00000001 },
} as const;

/**
 * UI Colors (matching soundsfair brand)
 */
export const THEME_COLORS = {
  // Brand colors
  BRAND_YELLOW: '#FFD000',
  BRAND_GOLD: '#FFD700',
  BLACK: '#000000',

  // Status colors
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
  NEUTRAL: '#6B7280',

  // Chart colors
  CHART_PRIMARY: '#FFD000',
  CHART_SECONDARY: '#FFD700',
  CHART_TERTIARY: '#10B981',
  CHART_QUATERNARY: '#3B82F6',
} as const;
