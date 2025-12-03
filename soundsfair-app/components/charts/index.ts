/**
 * CHART COMPONENTS - Centralized Exports
 *
 * Purpose: Single import point for all chart components
 * Usage: import { PurchasingPowerChart, MoneySupplyChart } from '@/components/charts';
 */

// Level 1: Inflation Charts
export { PurchasingPowerChart } from './PurchasingPowerChart';
export { MoneySupplyChart } from './MoneySupplyChart';

// Level 3: Blockchain Charts
export { IssuanceScheduleChart } from './IssuanceScheduleChart';
export { BitcoinSupplyCurveChart } from './BitcoinSupplyCurveChart';

// Level 5, 8: Portfolio Charts
export { DCAPerformanceChart } from './DCAPerformanceChart';

/**
 * AVAILABLE CHARTS:
 *
 * Inflation (Level 1):
 * - PurchasingPowerChart: Shows USD purchasing power decline 1950-2023
 * - MoneySupplyChart: Shows M2 money supply explosion 2000-2023
 *
 * Blockchain (Level 3):
 * - IssuanceScheduleChart: Bitcoin halving schedule and block rewards
 * - BitcoinSupplyCurveChart: Total supply curve approaching 21M
 *
 * Portfolio (Level 5, 8):
 * - DCAPerformanceChart: Dollar-cost averaging results by start date
 *
 * COMING SOON (Phase 2 expansion):
 * - StockToFlowChart (Level 5)
 * - RealVsNominalReturnsChart (Level 5)
 * - PortfolioAllocationChart (Level 8)
 * - InflationAdjustedComparisonChart (Level 8)
 * - DollarReserveDeclineChart (Level 7)
 * - HashRateMigrationChart (Level 7)
 * - AdoptionCurveChart (Level 9)
 * ... (15+ additional charts planned)
 */
