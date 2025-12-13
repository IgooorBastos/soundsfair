/**
 * Bitcoin Unit Conversion Utilities
 * Handles conversions between BTC, mBTC, bits, sats, and fiat currencies
 */

import { BITCOIN_CONSTANTS } from '../constants';
import type { ConversionRates, Currency, BitcoinUnit } from '@/app/types/tools';

/**
 * Convert Bitcoin to Satoshis
 * @param btc Amount in BTC
 * @returns Amount in satoshis
 */
export function btcToSats(btc: number): number {
  return Math.round(btc * BITCOIN_CONSTANTS.SATOSHI_PER_BTC);
}

/**
 * Convert Satoshis to Bitcoin
 * @param sats Amount in satoshis
 * @returns Amount in BTC
 */
export function satsToBtc(sats: number): number {
  return sats / BITCOIN_CONSTANTS.SATOSHI_PER_BTC;
}

/**
 * Convert Bitcoin to mBTC (milliBitcoin)
 * @param btc Amount in BTC
 * @returns Amount in mBTC
 */
export function btcToMbtc(btc: number): number {
  return btc * 1000;
}

/**
 * Convert mBTC to Bitcoin
 * @param mbtc Amount in mBTC
 * @returns Amount in BTC
 */
export function mbtcToBtc(mbtc: number): number {
  return mbtc / 1000;
}

/**
 * Convert Bitcoin to bits (microbitcoin)
 * @param btc Amount in BTC
 * @returns Amount in bits
 */
export function btcToBits(btc: number): number {
  return btc * 1_000_000;
}

/**
 * Convert bits to Bitcoin
 * @param bits Amount in bits
 * @returns Amount in BTC
 */
export function bitsToBtc(bits: number): number {
  return bits / 1_000_000;
}

/**
 * Convert Bitcoin to fiat currency
 * @param btc Amount in BTC
 * @param btcPriceInCurrency Price of 1 BTC in the target currency
 * @returns Amount in fiat currency
 */
export function btcToFiat(btc: number, btcPriceInCurrency: number): number {
  return btc * btcPriceInCurrency;
}

/**
 * Convert fiat currency to Bitcoin
 * @param fiat Amount in fiat currency
 * @param btcPriceInCurrency Price of 1 BTC in the target currency
 * @returns Amount in BTC
 */
export function fiatToBtc(fiat: number, btcPriceInCurrency: number): number {
  if (btcPriceInCurrency === 0) return 0;
  return fiat / btcPriceInCurrency;
}

/**
 * Convert satoshis to fiat currency
 * @param sats Amount in satoshis
 * @param btcPriceInCurrency Price of 1 BTC in the target currency
 * @returns Amount in fiat currency
 */
export function satsToFiat(sats: number, btcPriceInCurrency: number): number {
  const btc = satsToBtc(sats);
  return btcToFiat(btc, btcPriceInCurrency);
}

/**
 * Convert fiat currency to satoshis
 * @param fiat Amount in fiat currency
 * @param btcPriceInCurrency Price of 1 BTC in the target currency
 * @returns Amount in satoshis
 */
export function fiatToSats(fiat: number, btcPriceInCurrency: number): number {
  const btc = fiatToBtc(fiat, btcPriceInCurrency);
  return btcToSats(btc);
}

/**
 * Get all conversion rates for a given BTC amount and prices
 * @param btcAmount Amount in BTC
 * @param prices Object with BTC prices in different currencies
 * @returns Object with all conversion rates
 */
export function getAllConversionRates(
  btcAmount: number,
  prices: Record<Currency, number>
): ConversionRates {
  return {
    btc: btcAmount,
    sats: btcToSats(btcAmount),
    mbtc: btcToMbtc(btcAmount),
    bits: btcToBits(btcAmount),
    usd: btcToFiat(btcAmount, prices.usd || 0),
    eur: btcToFiat(btcAmount, prices.eur || 0),
    gbp: btcToFiat(btcAmount, prices.gbp || 0),
    brl: btcToFiat(btcAmount, prices.brl || 0),
    jpy: btcToFiat(btcAmount, prices.jpy || 0),
    aud: btcToFiat(btcAmount, prices.aud || 0),
    cad: btcToFiat(btcAmount, prices.cad || 0),
  };
}

/**
 * Convert between any two Bitcoin units
 * @param amount Amount in source unit
 * @param fromUnit Source unit
 * @param toUnit Target unit
 * @returns Amount in target unit
 */
export function convertBitcoinUnits(
  amount: number,
  fromUnit: BitcoinUnit,
  toUnit: BitcoinUnit
): number {
  if (fromUnit === toUnit) return amount;

  // First convert to BTC (base unit)
  let btc: number;
  switch (fromUnit) {
    case 'btc':
      btc = amount;
      break;
    case 'mbtc':
      btc = mbtcToBtc(amount);
      break;
    case 'bits':
      btc = bitsToBtc(amount);
      break;
    case 'sats':
      btc = satsToBtc(amount);
      break;
  }

  // Then convert from BTC to target unit
  switch (toUnit) {
    case 'btc':
      return btc;
    case 'mbtc':
      return btcToMbtc(btc);
    case 'bits':
      return btcToBits(btc);
    case 'sats':
      return btcToSats(btc);
  }
}

/**
 * Format Bitcoin amount with appropriate unit
 * @param btc Amount in BTC
 * @param preferredUnit Preferred display unit
 * @param decimals Number of decimal places
 * @returns Formatted string with unit
 */
export function formatBitcoinAmount(
  btc: number,
  preferredUnit: BitcoinUnit = 'btc',
  decimals?: number
): string {
  const amount = convertBitcoinUnits(btc, 'btc', preferredUnit);

  // Auto-determine decimals if not specified
  let decimalPlaces = decimals;
  if (decimalPlaces === undefined) {
    switch (preferredUnit) {
      case 'btc':
        decimalPlaces = 8;
        break;
      case 'mbtc':
        decimalPlaces = 5;
        break;
      case 'bits':
        decimalPlaces = 2;
        break;
      case 'sats':
        decimalPlaces = 0;
        break;
    }
  }

  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });

  const unitSymbols = {
    btc: '₿',
    mbtc: 'mBTC',
    bits: 'bits',
    sats: 'sats'
  };

  return `${formatted} ${unitSymbols[preferredUnit]}`;
}

/**
 * Format fiat amount with currency symbol
 * @param amount Amount in fiat
 * @param currency Currency code
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted string with currency symbol
 */
export function formatFiatAmount(
  amount: number,
  currency: Currency = 'usd',
  decimals: number = 2
): string {
  const currencySymbols: Record<Currency, string> = {
    usd: '$',
    eur: '€',
    gbp: '£',
    brl: 'R$',
    jpy: '¥',
    aud: 'A$',
    cad: 'C$',
  };

  const symbol = currencySymbols[currency] || '$';
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  // For Japanese Yen, typically no decimals
  if (currency === 'jpy') {
    return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
  }

  return `${symbol}${formatted}`;
}

/**
 * Calculate the purchasing power of satoshis
 * Useful for understanding "How many sats can I get for $X?"
 * @param usdAmount Amount in USD
 * @param btcPriceUsd Current BTC price in USD
 * @returns Number of satoshis
 */
export function calculateSatsPurchasingPower(
  usdAmount: number,
  btcPriceUsd: number
): number {
  return fiatToSats(usdAmount, btcPriceUsd);
}

/**
 * Calculate the fiat value of satoshis
 * Useful for pricing in sats
 * @param satsAmount Amount in satoshis
 * @param btcPriceUsd Current BTC price in USD
 * @returns Value in USD
 */
export function calculateSatsValue(
  satsAmount: number,
  btcPriceUsd: number
): number {
  return satsToFiat(satsAmount, btcPriceUsd);
}

/**
 * Parse a Bitcoin amount string (with or without unit)
 * Examples: "0.5 BTC", "50000 sats", "1.5"
 * @param input String to parse
 * @returns Object with amount and detected unit
 */
export function parseBitcoinAmount(input: string): {
  amount: number;
  unit: BitcoinUnit;
} | null {
  const cleaned = input.trim().toLowerCase();

  // Match number followed by optional unit
  const match = cleaned.match(/^([\d,.]+)\s*(btc|mbtc|bits?|sats?)?$/);
  if (!match) return null;

  const amount = parseFloat(match[1].replace(/,/g, ''));
  if (isNaN(amount)) return null;

  // Determine unit
  let unit: BitcoinUnit = 'btc';
  if (match[2]) {
    if (match[2].startsWith('mbtc')) unit = 'mbtc';
    else if (match[2].startsWith('bit')) unit = 'bits';
    else if (match[2].startsWith('sat')) unit = 'sats';
    else unit = 'btc';
  }

  return { amount, unit };
}

/**
 * Validate if a Bitcoin amount is valid
 * @param amount Amount to validate
 * @param unit Unit of the amount
 * @returns True if valid, false otherwise
 */
export function isValidBitcoinAmount(amount: number, unit: BitcoinUnit = 'btc'): boolean {
  if (isNaN(amount) || !isFinite(amount) || amount < 0) {
    return false;
  }

  // Convert to BTC for comparison
  const btc = convertBitcoinUnits(amount, unit, 'btc');

  // Check if amount exceeds total supply
  if (btc > BITCOIN_CONSTANTS.MAX_SUPPLY) {
    return false;
  }

  // Check minimum amount (1 satoshi in BTC)
  const minBtc = 0.00000001;
  if (btc > 0 && btc < minBtc) {
    return false;
  }

  return true;
}
