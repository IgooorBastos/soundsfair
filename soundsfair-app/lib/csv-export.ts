import type { DCAInput, DCAResult, Transaction } from '@/app/types/tools';
import { formatCurrency, formatPercentage, formatNumber } from './dca-calculator';

/**
 * Escapes a value for CSV format according to RFC 4180
 * - Wraps in quotes if contains comma, quote, or newline
 * - Doubles any existing quotes
 */
function escapeCSVValue(value: string | number): string {
  const stringValue = String(value);

  // Check if value needs escaping
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Double any existing quotes and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Formats a date string for CSV display
 */
function formatCSVDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Generates the CSV header section with metadata and investment settings
 */
function generateCSVHeader(formData: DCAInput): string {
  const now = new Date();
  const timestamp = now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Map frequency to display label
  const frequencyLabels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly'
  };

  const lines = [
    '# Bitcoin DCA Calculator - Export',
    `# Generated: ${timestamp}`,
    '# Website: soundsfair.com',
    '#',
    '# Investment Settings',
    'Setting,Value',
    `Amount per Period,${formatCurrency(formData.amount)}`,
    `Frequency,${frequencyLabels[formData.frequency] || formData.frequency}`,
    `Start Date,${formatCSVDate(formData.startDate)}`,
    `End Date,${formatCSVDate(formData.endDate)}`,
    '#'
  ];

  return lines.join('\n');
}

/**
 * Generates the summary section with key metrics
 */
function generateSummarySection(results: DCAResult[]): string {
  if (results.length === 0) return '';

  const result = results[0]; // Bitcoin only

  const lines = [
    '# Summary Results',
    'Asset,Total Invested,Units Acquired,Current Value,ROI,CAGR,Max Drawdown,Volatility',
    [
      'Bitcoin',
      escapeCSVValue(formatCurrency(result.totalInvested)),
      escapeCSVValue(formatNumber(result.units, 6)), // 6 decimals for BTC
      escapeCSVValue(formatCurrency(result.currentValue)),
      escapeCSVValue(formatPercentage(result.roi)),
      escapeCSVValue(formatPercentage(result.cagr)),
      escapeCSVValue(formatPercentage(result.drawdown)),
      escapeCSVValue(formatPercentage(result.volatility))
    ].join(','),
    '#'
  ];

  return lines.join('\n');
}

/**
 * Generates the transaction history section
 */
function generateTransactionsSection(results: DCAResult[]): string {
  if (results.length === 0 || results[0].transactions.length === 0) return '';

  const result = results[0]; // Bitcoin only

  const lines = [
    '# Transaction History',
    'Date,Invested,BTC Price,BTC Purchased,Cumulative BTC,Portfolio Value'
  ];

  // Add each transaction
  for (const tx of result.transactions) {
    lines.push([
      formatCSVDate(tx.date),
      formatCurrency(tx.invested),
      escapeCSVValue(formatCurrency(tx.price)),
      escapeCSVValue(formatNumber(tx.units, 6)), // 6 decimals for BTC
      escapeCSVValue(formatNumber(tx.cumulativeUnits, 6)),
      escapeCSVValue(formatCurrency(tx.portfolioValue))
    ].join(','));
  }

  return lines.join('\n');
}

/**
 * Main export function that generates CSV and triggers download
 */
export function exportDCAToCSV(formData: DCAInput, results: DCAResult[]): void {
  try {
    // Validate inputs
    if (!results || results.length === 0) {
      console.error('No results to export');
      return;
    }

    // Generate CSV sections
    const headerSection = generateCSVHeader(formData);
    const summarySection = generateSummarySection(results);
    const transactionsSection = generateTransactionsSection(results);

    // Combine all sections
    const csvContent = [
      headerSection,
      summarySection,
      transactionsSection
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Generate filename with current date
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `dca-bitcoin-${today}.csv`;

    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
}
