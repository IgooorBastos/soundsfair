// Types for Tools Suite

export type Asset = 'BTC' | 'SP500' | 'GOLD' | 'MSCI_WORLD';

export type Frequency = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface PriceData {
  date: string;
  price: number;
}

export interface DCAInput {
  amount: number;
  frequency: Frequency;
  startDate: string;
  endDate: string;
  assets: Asset[];
  customTicker?: string;
}

export interface DCAResult {
  asset: Asset;
  totalInvested: number;
  units: number;
  currentValue: number;
  roi: number;
  cagr: number;
  drawdown: number;
  volatility: number;
  transactions: Transaction[];
}

export interface Transaction {
  date: string;
  invested: number;
  price: number;
  units: number;
  cumulativeUnits: number;
  portfolioValue: number;
}

export interface DCACalculation {
  results: DCAResult[];
  chartData: ChartDataPoint[];
  shareId?: string;
}

export interface ChartDataPoint {
  date: string;
  [key: string]: number | string; // Dynamic keys for each asset
}

export interface HalvingData {
  currentBlock: number;
  nextHalvingBlock: number;
  blocksRemaining: number;
  estimatedDate: string;
  currentReward: number;
  nextReward: number;
  progress: number;
}

export interface FeeEstimate {
  slow: {
    satPerVbyte: number;
    totalSats: number;
    usdEquivalent: number;
    estimatedTime: string;
  };
  medium: {
    satPerVbyte: number;
    totalSats: number;
    usdEquivalent: number;
    estimatedTime: string;
  };
  fast: {
    satPerVbyte: number;
    totalSats: number;
    usdEquivalent: number;
    estimatedTime: string;
  };
}

export interface ConversionRate {
  btc: number;
  usd: number;
  eur: number;
  gbp: number;
  brl: number;
  usdt: number;
  usdc: number;
  sats: number;
}

// ==========================================
// New Tool Types (2025)
// ==========================================

/**
 * Bitcoin price data with metadata
 */
export interface BitcoinPrice {
  usd: number;
  eur?: number;
  gbp?: number;
  brl?: number;
  jpy?: number;
  aud?: number;
  cad?: number;
  sats: number;
  change24h: number;
  change7d?: number;
  marketCap?: number;
  volume24h?: number;
  timestamp: number;
}

/**
 * Extended halving information
 */
export interface HalvingInfo {
  currentBlock: number;
  nextHalvingBlock: number;
  blocksRemaining: number;
  estimatedDate: Date;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  currentReward: number;
  nextReward: number;
  progressPercent: number;
  currentEra: number;
  completedHalvings: number;
}

/**
 * Historical halving data
 */
export interface HistoricalHalving {
  block: number;
  date: string;
  reward: number;
  era: number;
  priceAtHalving?: number;
}

/**
 * "What If" calculator result
 */
export interface WhatIfResult {
  investmentDate: string;
  investmentAmount: number;
  btcPriceAtPurchase: number;
  btcAccumulated: number;
  currentBtcPrice: number;
  currentValue: number;
  roi: number;
  roiPercent: number;
  annualizedReturn: number;
  daysHeld: number;
  yearsHeld: number;
  comparisonAssets?: {
    sp500?: {
      currentValue: number;
      roi: number;
      roiPercent: number;
    };
    gold?: {
      currentValue: number;
      roi: number;
      roiPercent: number;
    };
  };
}

/**
 * Fear & Greed Index data
 */
export interface FearGreedData {
  value: number;
  classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  timestamp: number;
  previousValue?: number;
  change24h?: number;
  historicalData?: FearGreedPoint[];
}

/**
 * Single Fear & Greed data point
 */
export interface FearGreedPoint {
  date: string;
  value: number;
  classification: string;
  timestamp: number;
}

/**
 * Currency type for conversions
 */
export type Currency = 'usd' | 'eur' | 'gbp' | 'brl' | 'jpy' | 'aud' | 'cad';

/**
 * Bitcoin unit type
 */
export type BitcoinUnit = 'btc' | 'mbtc' | 'bits' | 'sats';

/**
 * Conversion rates for all supported currencies
 */
export interface ConversionRates {
  btc: number;
  sats: number;
  mbtc: number;
  bits: number;
  usd: number;
  eur: number;
  gbp: number;
  brl: number;
  jpy: number;
  aud: number;
  cad: number;
}

/**
 * Historical Bitcoin price for a specific date
 */
export interface HistoricalPrice {
  date: string;
  price: number;
  timestamp: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  timestamp: number;
  cached?: boolean;
}
