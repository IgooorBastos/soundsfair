/**
 * CHART CONFIGURATION - Shared Settings for All Charts
 *
 * Purpose: Centralized configuration for consistent chart appearance
 * Usage: Import and spread config objects into Recharts components
 */

/**
 * Visual Identity Colors
 * Matches /app/styles/visual-identity.css
 */
export const CHART_COLORS = {
  // Primary colors
  gold: '#FFD000',
  goldMuted: '#E6B800',
  red: '#FF4444',
  blue: '#4477FF',
  gray: '#808080',
  green: '#10B981',

  // Background & UI
  black: '#000000',
  charcoal: '#1A1A1A',
  darkGray: '#242424',
  chartGrid: '#2A2A2A',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#F5F5F5',
  textMuted: '#9CA3AF',
};

/**
 * Semantic color assignments
 */
export const SEMANTIC_COLORS = {
  bitcoin: CHART_COLORS.gold,
  fiat: CHART_COLORS.red,
  traditional: CHART_COLORS.blue,
  neutral: CHART_COLORS.gray,
  positive: CHART_COLORS.green,
  negative: CHART_COLORS.red,
};

/**
 * Chart series colors for multi-line charts
 * Ordered by priority (most important first)
 */
export const SERIES_COLORS = [
  CHART_COLORS.gold, // Primary (Bitcoin, main metric)
  CHART_COLORS.blue, // Secondary (comparison, traditional)
  CHART_COLORS.red, // Tertiary (fiat, negative)
  CHART_COLORS.green, // Quaternary (positive outcome)
  CHART_COLORS.gray, // Quinary (context)
];

/**
 * Responsive breakpoints (matching Tailwind)
 */
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

/**
 * Chart dimensions by breakpoint
 */
export const CHART_DIMENSIONS = {
  mobile: {
    width: '100%',
    height: 250,
  },
  tablet: {
    width: '100%',
    height: 350,
  },
  desktop: {
    width: '100%',
    height: 400,
  },
};

/**
 * Typography for charts
 */
export const CHART_TYPOGRAPHY = {
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif`,
  monoFamily: `'IBM Plex Mono', 'Courier New', monospace`,
  sizes: {
    title: 24,
    subtitle: 18,
    axis: 12,
    legend: 14,
    tooltip: 14,
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

/**
 * Base chart configuration (Recharts)
 * Spread this into ResponsiveContainer or chart components
 */
export const BASE_CHART_CONFIG = {
  style: {
    fontFamily: CHART_TYPOGRAPHY.fontFamily,
  },
};

/**
 * CartesianGrid configuration (grid lines)
 */
export const GRID_CONFIG = {
  strokeDasharray: '3 3',
  stroke: CHART_COLORS.chartGrid,
  opacity: 0.5,
  vertical: false, // Typically only horizontal grid lines
};

/**
 * XAxis configuration
 */
export const XAXIS_CONFIG = {
  stroke: CHART_COLORS.textMuted,
  tick: {
    fill: CHART_COLORS.textMuted,
    fontSize: CHART_TYPOGRAPHY.sizes.axis,
  },
  axisLine: {
    stroke: CHART_COLORS.chartGrid,
  },
  tickLine: {
    stroke: CHART_COLORS.chartGrid,
  },
};

/**
 * YAxis configuration
 */
export const YAXIS_CONFIG = {
  stroke: CHART_COLORS.textMuted,
  tick: {
    fill: CHART_COLORS.textMuted,
    fontSize: CHART_TYPOGRAPHY.sizes.axis,
  },
  axisLine: {
    stroke: CHART_COLORS.chartGrid,
  },
  tickLine: {
    stroke: CHART_COLORS.chartGrid,
  },
};

/**
 * Tooltip configuration
 */
export const TOOLTIP_CONFIG = {
  contentStyle: {
    backgroundColor: CHART_COLORS.charcoal,
    border: `1px solid ${CHART_COLORS.darkGray}`,
    borderRadius: '8px',
    color: CHART_COLORS.textPrimary,
    fontSize: CHART_TYPOGRAPHY.sizes.tooltip,
    fontFamily: CHART_TYPOGRAPHY.fontFamily,
  },
  itemStyle: {
    color: CHART_COLORS.textSecondary,
  },
  labelStyle: {
    color: CHART_COLORS.gold,
    fontWeight: CHART_TYPOGRAPHY.weights.semibold,
  },
  cursor: {
    fill: CHART_COLORS.gold,
    opacity: 0.1,
  },
};

/**
 * Legend configuration
 */
export const LEGEND_CONFIG = {
  wrapperStyle: {
    fontSize: CHART_TYPOGRAPHY.sizes.legend,
    color: CHART_COLORS.textSecondary,
    fontFamily: CHART_TYPOGRAPHY.fontFamily,
  },
  iconType: 'line' as const, // 'line' | 'square' | 'circle'
};

/**
 * Animation configuration
 */
export const ANIMATION_CONFIG = {
  animationDuration: 800,
  animationEasing: 'ease-out' as const,
};

/**
 * Margin configuration (chart padding)
 */
export const MARGIN_CONFIG = {
  default: { top: 20, right: 30, left: 20, bottom: 20 },
  compact: { top: 10, right: 20, left: 10, bottom: 10 },
  generous: { top: 30, right: 50, left: 30, bottom: 30 },
};

/**
 * Line chart stroke widths
 */
export const STROKE_WIDTHS = {
  thin: 1,
  normal: 2,
  thick: 3,
  emphasis: 4,
};

/**
 * Area chart opacity
 */
export const AREA_OPACITY = {
  fill: 0.3,
  stroke: 1.0,
};

/**
 * Bar chart configuration
 */
export const BAR_CONFIG = {
  radius: [4, 4, 0, 0] as [number, number, number, number], // Top corners rounded
  maxBarSize: 60,
};

/**
 * Pie/Donut chart configuration
 */
export const PIE_CONFIG = {
  innerRadius: '60%', // For donut charts
  outerRadius: '80%',
  paddingAngle: 2,
  startAngle: 90,
  labelLine: false,
};

/**
 * Accessibility configuration
 */
export const ACCESSIBILITY_CONFIG = {
  ariaLabel: 'Chart visualization',
  focusable: true,
  role: 'img',
};

/**
 * Get responsive chart height based on window width
 * @param width - Window width
 * @returns Optimal chart height
 */
export function getResponsiveHeight(width: number): number {
  if (width < BREAKPOINTS.tablet) {
    return CHART_DIMENSIONS.mobile.height;
  }
  if (width < BREAKPOINTS.desktop) {
    return CHART_DIMENSIONS.tablet.height;
  }
  return CHART_DIMENSIONS.desktop.height;
}

/**
 * Get optimal tick count based on chart width
 * Prevents overcrowded labels on mobile
 * @param width - Chart width
 * @returns Number of ticks to display
 */
export function getOptimalTickCount(width: number): number {
  if (width < BREAKPOINTS.mobile) return 4;
  if (width < BREAKPOINTS.tablet) return 6;
  if (width < BREAKPOINTS.desktop) return 8;
  return 10;
}

/**
 * Color scale generator for gradient effects
 * @param baseColor - Starting color (hex)
 * @param steps - Number of gradient steps
 * @returns Array of hex colors
 */
export function generateColorScale(baseColor: string, steps: number = 5): string[] {
  // Simplified: returns variations of base color
  // For production, use color manipulation library (e.g., chroma.js)
  const colors = [baseColor];
  for (let i = 1; i < steps; i++) {
    const opacity = 1 - (i / steps) * 0.6;
    colors.push(`${baseColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
  }
  return colors;
}

/**
 * Combine multiple configurations
 * @param configs - Configuration objects to merge
 * @returns Merged configuration
 */
export function mergeConfigs<T extends Record<string, any>>(...configs: T[]): T {
  return Object.assign({}, ...configs);
}
