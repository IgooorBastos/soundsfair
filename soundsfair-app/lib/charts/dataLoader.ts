/**
 * DATA LOADER - CSV Parsing and Data Loading Utilities
 *
 * Purpose: Load and parse CSV chart data files
 * Usage: Import and call load functions in chart components
 */

export interface ChartDataPoint {
  [key: string]: string | number;
}

/**
 * Load CSV data from public directory
 * @param filename - Relative path from /data/charts/ directory
 * @returns Parsed array of data objects
 */
export async function loadChartData(filename: string): Promise<ChartDataPoint[]> {
  try {
    const response = await fetch(`/data/charts/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.statusText}`);
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error loading chart data: ${filename}`, error);
    return [];
  }
}

/**
 * Parse CSV text into array of objects
 * @param csvText - Raw CSV string
 * @returns Array of data objects with column headers as keys
 */
export function parseCSV(csvText: string): ChartDataPoint[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Extract headers
  const headers = lines[0].split(',').map(h => h.trim());

  // Parse data rows
  const data: ChartDataPoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: ChartDataPoint = {};

    headers.forEach((header, index) => {
      const value = values[index];
      // Try to parse as number, otherwise keep as string
      row[header] = isNaN(Number(value)) ? value : Number(value);
    });

    data.push(row);
  }

  return data;
}

/**
 * Load specific chart dataset by category and name
 * @param category - inflation, blockchain, portfolio, geopolitics
 * @param dataset - filename without .csv extension
 */
export async function loadDataset(
  category: 'inflation' | 'blockchain' | 'portfolio' | 'geopolitics',
  dataset: string
): Promise<ChartDataPoint[]> {
  return loadChartData(`${category}/${dataset}.csv`);
}

/**
 * Preload multiple datasets (for better performance)
 * @param datasets - Array of {category, dataset} objects
 */
export async function preloadDatasets(
  datasets: Array<{ category: string; dataset: string }>
): Promise<Record<string, ChartDataPoint[]>> {
  const results: Record<string, ChartDataPoint[]> = {};

  await Promise.all(
    datasets.map(async ({ category, dataset }) => {
      const key = `${category}/${dataset}`;
      results[key] = await loadChartData(`${key}.csv`);
    })
  );

  return results;
}

/**
 * Transform data for specific chart requirements
 * @param data - Raw data array
 * @param transformer - Function to transform each row
 */
export function transformData<T>(
  data: ChartDataPoint[],
  transformer: (row: ChartDataPoint) => T
): T[] {
  return data.map(transformer);
}

/**
 * Filter data by date range
 * @param data - Data with Year column
 * @param startYear - Start year (inclusive)
 * @param endYear - End year (inclusive)
 */
export function filterByYearRange(
  data: ChartDataPoint[],
  startYear: number,
  endYear: number
): ChartDataPoint[] {
  return data.filter(row => {
    const year = Number(row.Year);
    return year >= startYear && year <= endYear;
  });
}

/**
 * Get latest data point from dataset
 * @param data - Chart data array
 */
export function getLatestDataPoint(data: ChartDataPoint[]): ChartDataPoint | null {
  return data.length > 0 ? data[data.length - 1] : null;
}

/**
 * Calculate year-over-year change
 * @param data - Data with numeric Year column
 * @param valueKey - Column to calculate change for
 */
export function calculateYoYChange(
  data: ChartDataPoint[],
  valueKey: string
): ChartDataPoint[] {
  return data.map((row, index) => {
    if (index === 0) {
      return { ...row, [`${valueKey}_YoY_Change`]: 0 };
    }

    const currentValue = Number(row[valueKey]);
    const previousValue = Number(data[index - 1][valueKey]);
    const change = ((currentValue - previousValue) / previousValue) * 100;

    return {
      ...row,
      [`${valueKey}_YoY_Change`]: Math.round(change * 100) / 100,
    };
  });
}
