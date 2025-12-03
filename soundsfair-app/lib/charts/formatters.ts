/**
 * FORMATTERS - Number and Date Formatting for Charts
 *
 * Purpose: Consistent formatting across all chart components
 * Usage: Import format functions for axis labels, tooltips, legends
 */

/**
 * Format currency values (USD)
 * @param value - Numeric value
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string like "$1,234.56"
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format large numbers with K/M/B/T suffixes
 * @param value - Numeric value
 * @param decimals - Decimal places (default: 1)
 * @returns Formatted string like "1.2M" or "45.6B"
 */
export function formatCompact(value: number, decimals: number = 1): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(decimals)}T`;
  }
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}

/**
 * Format percentage values
 * @param value - Numeric value (as decimal: 0.05 = 5%)
 * @param decimals - Decimal places (default: 1)
 * @param asDecimal - If true, value is already percentage (5 = 5%)
 * @returns Formatted string like "5.0%"
 */
export function formatPercent(
  value: number,
  decimals: number = 1,
  asDecimal: boolean = false
): string {
  const percentValue = asDecimal ? value : value * 100;
  return `${percentValue.toFixed(decimals)}%`;
}

/**
 * Format BTC amounts
 * @param value - BTC amount
 * @param decimals - Decimal places (default: 2)
 * @returns Formatted string like "0.05 BTC"
 */
export function formatBTC(value: number, decimals: number = 2): string {
  if (value >= 1e6) {
    return `${formatCompact(value, decimals)} BTC`;
  }
  return `${value.toFixed(decimals)} BTC`;
}

/**
 * Format satoshis (for very small BTC amounts)
 * @param sats - Satoshi amount
 * @returns Formatted string like "50,000 sats"
 */
export function formatSats(sats: number): string {
  return `${formatNumber(sats, 0)} sats`;
}

/**
 * Format plain numbers with thousands separators
 * @param value - Numeric value
 * @param decimals - Decimal places (default: 0)
 * @returns Formatted string like "1,234,567"
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format year labels
 * @param year - Year as number or string
 * @returns String like "2024" or "'24" (short form)
 */
export function formatYear(year: number | string, short: boolean = false): string {
  const yearStr = year.toString();
  return short ? `'${yearStr.slice(-2)}` : yearStr;
}

/**
 * Format quarter labels (for quarterly data)
 * @param quarter - String like "Q1_2021"
 * @returns Formatted string like "Q1 '21"
 */
export function formatQuarter(quarter: string): string {
  const [q, year] = quarter.split('_');
  return `${q} '${year.slice(-2)}`;
}

/**
 * Format date strings
 * @param date - Date string or Date object
 * @param format - 'short' | 'long' | 'numeric'
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'numeric' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'numeric') {
    return dateObj.toLocaleDateString('en-US');
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { month: 'short', year: 'numeric' }
      : { month: 'long', day: 'numeric', year: 'numeric' };

  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Format axis tick values based on value range
 * Smart formatter that chooses appropriate format based on magnitude
 * @param value - Tick value
 * @param type - 'currency' | 'number' | 'percent'
 * @returns Formatted string
 */
export function formatAxisTick(
  value: number,
  type: 'currency' | 'number' | 'percent' = 'number'
): string {
  switch (type) {
    case 'currency':
      return value >= 1000 ? formatCompact(value, 1) : formatCurrency(value, 0);
    case 'percent':
      return formatPercent(value, 0, true);
    case 'number':
    default:
      return value >= 1000 ? formatCompact(value, 1) : formatNumber(value, 0);
  }
}

/**
 * Format tooltip values with context
 * @param label - Label (e.g., "Year: 2024")
 * @param value - Numeric value
 * @param type - Value type for formatting
 * @returns Formatted string for tooltip display
 */
export function formatTooltip(
  label: string,
  value: number,
  type: 'currency' | 'number' | 'percent' | 'btc' = 'number'
): string {
  let formattedValue: string;

  switch (type) {
    case 'currency':
      formattedValue = formatCurrency(value, 2);
      break;
    case 'percent':
      formattedValue = formatPercent(value, 2, true);
      break;
    case 'btc':
      formattedValue = formatBTC(value, 4);
      break;
    case 'number':
    default:
      formattedValue = formatNumber(value, 2);
  }

  return `${label}: ${formattedValue}`;
}

/**
 * Format change indicators (positive/negative with +/- sign)
 * @param value - Change value
 * @param isPercent - If true, format as percentage
 * @returns Formatted string like "+5.2%" or "-3.1"
 */
export function formatChange(value: number, isPercent: boolean = true): string {
  const sign = value >= 0 ? '+' : '';
  const formatted = isPercent ? formatPercent(value, 1, true) : formatNumber(value, 1);
  return `${sign}${formatted}`;
}

/**
 * Format duration (in months or years)
 * @param months - Duration in months
 * @returns String like "6 months" or "2 years"
 */
export function formatDuration(months: number): string {
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  return `${years}y ${remainingMonths}m`;
}

/**
 * Abbreviate long text labels (for mobile displays)
 * @param text - Text to abbreviate
 * @param maxLength - Maximum length (default: 15)
 * @returns Abbreviated text with ellipsis if needed
 */
export function abbreviateLabel(text: string, maxLength: number = 15): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Format ratio (e.g., stock-to-flow)
 * @param numerator - Numerator value
 * @param denominator - Denominator value
 * @returns Formatted string like "62.5:1"
 */
export function formatRatio(numerator: number, denominator: number = 1): string {
  const ratio = numerator / denominator;
  return `${ratio.toFixed(1)}:1`;
}
