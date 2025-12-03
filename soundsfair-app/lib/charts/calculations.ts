/**
 * CALCULATIONS - Financial and Bitcoin-specific Calculations
 *
 * Purpose: Reusable calculation functions for charts and data analysis
 * Usage: Import functions for inflation, DCA, portfolio calculations
 */

/**
 * Calculate future value with compound interest/inflation
 * @param principal - Initial amount
 * @param rate - Annual rate (as decimal: 0.03 = 3%)
 * @param years - Number of years
 * @returns Future value
 */
export function compoundInterest(
  principal: number,
  rate: number,
  years: number
): number {
  return principal * Math.pow(1 + rate, years);
}

/**
 * Calculate purchasing power erosion due to inflation
 * @param initial - Initial value (typically 1.0 or 100)
 * @param inflationRate - Annual inflation rate (decimal)
 * @param years - Number of years
 * @returns Remaining purchasing power
 */
export function purchasingPowerAfterInflation(
  initial: number,
  inflationRate: number,
  years: number
): number {
  return initial * Math.pow(1 - inflationRate, years);
}

/**
 * Calculate real return (adjusted for inflation)
 * @param nominalReturn - Nominal return (decimal)
 * @param inflationRate - Inflation rate (decimal)
 * @returns Real return (decimal)
 */
export function realReturn(nominalReturn: number, inflationRate: number): number {
  return (nominalReturn - inflationRate) / (1 + inflationRate);
}

/**
 * Calculate DCA (Dollar-Cost Averaging) performance
 * @param monthlyInvestment - Amount invested each month
 * @param priceData - Array of {month, price} objects
 * @returns Object with total invested, BTC accumulated, current value
 */
export function calculateDCA(
  monthlyInvestment: number,
  priceData: Array<{ month: number; price: number }>
): {
  totalInvested: number;
  btcAccumulated: number;
  currentValue: number;
  returnPercent: number;
} {
  let totalInvested = 0;
  let btcAccumulated = 0;

  priceData.forEach(({ price }) => {
    totalInvested += monthlyInvestment;
    btcAccumulated += monthlyInvestment / price;
  });

  const currentPrice = priceData[priceData.length - 1].price;
  const currentValue = btcAccumulated * currentPrice;
  const returnPercent = ((currentValue - totalInvested) / totalInvested) * 100;

  return {
    totalInvested,
    btcAccumulated,
    currentValue,
    returnPercent,
  };
}

/**
 * Calculate Stock-to-Flow ratio
 * @param existingStock - Total existing supply
 * @param annualFlow - Annual new supply
 * @returns Stock-to-Flow ratio
 */
export function stockToFlowRatio(existingStock: number, annualFlow: number): number {
  return existingStock / annualFlow;
}

/**
 * Calculate Bitcoin block reward at given height
 * @param blockHeight - Block height
 * @returns Block reward in BTC
 */
export function bitcoinBlockReward(blockHeight: number): number {
  const halvings = Math.floor(blockHeight / 210000);
  const initialReward = 50;
  return initialReward / Math.pow(2, halvings);
}

/**
 * Calculate total Bitcoin supply at given block height
 * @param blockHeight - Block height
 * @returns Total BTC mined
 */
export function totalBitcoinSupply(blockHeight: number): number {
  let totalSupply = 0;
  let currentHeight = 0;
  let halvingCount = 0;

  while (currentHeight < blockHeight) {
    const nextHalving = (halvingCount + 1) * 210000;
    const blocksInThisEra = Math.min(nextHalving, blockHeight) - currentHeight;
    const rewardThisEra = 50 / Math.pow(2, halvingCount);

    totalSupply += blocksInThisEra * rewardThisEra;
    currentHeight += blocksInThisEra;
    halvingCount++;

    if (currentHeight >= blockHeight) break;
  }

  return totalSupply;
}

/**
 * Calculate portfolio allocation percentages
 * @param allocations - Object with asset names and amounts
 * @returns Object with asset percentages
 */
export function calculatePortfolioAllocation(
  allocations: Record<string, number>
): Record<string, number> {
  const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const percentages: Record<string, number> = {};

  Object.entries(allocations).forEach(([asset, amount]) => {
    percentages[asset] = (amount / total) * 100;
  });

  return percentages;
}

/**
 * Calculate compound annual growth rate (CAGR)
 * @param beginValue - Starting value
 * @param endValue - Ending value
 * @param years - Number of years
 * @returns CAGR as decimal
 */
export function calculateCAGR(
  beginValue: number,
  endValue: number,
  years: number
): number {
  return Math.pow(endValue / beginValue, 1 / years) - 1;
}

/**
 * Calculate standard deviation (volatility measure)
 * @param values - Array of numeric values
 * @returns Standard deviation
 */
export function standardDeviation(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculate Sharpe ratio (risk-adjusted return)
 * @param returns - Array of periodic returns
 * @param riskFreeRate - Risk-free rate (typically 3-month Treasury)
 * @returns Sharpe ratio
 */
export function sharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
  const avgReturn = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const excessReturn = avgReturn - riskFreeRate;
  const stdDev = standardDeviation(returns);
  return stdDev === 0 ? 0 : excessReturn / stdDev;
}

/**
 * Calculate maximum drawdown
 * @param values - Array of portfolio values over time
 * @returns Maximum drawdown as decimal (negative value)
 */
export function maximumDrawdown(values: number[]): number {
  let maxDrawdown = 0;
  let peak = values[0];

  values.forEach(value => {
    if (value > peak) {
      peak = value;
    }
    const drawdown = (value - peak) / peak;
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown;
}

/**
 * Calculate moving average
 * @param values - Array of values
 * @param period - Period length (e.g., 7 for 7-day MA)
 * @returns Array of moving averages
 */
export function movingAverage(values: number[], period: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(NaN); // Not enough data yet
    } else {
      const slice = values.slice(i - period + 1, i + 1);
      const avg = slice.reduce((sum, val) => sum + val, 0) / period;
      result.push(avg);
    }
  }

  return result;
}

/**
 * Calculate year-over-year percentage change
 * @param current - Current value
 * @param previous - Previous year value
 * @returns YoY change as percentage
 */
export function yoyChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate future value of series of payments (annuity)
 * @param payment - Regular payment amount
 * @param rate - Interest rate per period (decimal)
 * @param periods - Number of periods
 * @returns Future value
 */
export function futureValueAnnuity(
  payment: number,
  rate: number,
  periods: number
): number {
  if (rate === 0) return payment * periods;
  return payment * ((Math.pow(1 + rate, periods) - 1) / rate);
}

/**
 * Calculate break-even Bitcoin price for mining
 * @param electricityCost - Cost per kWh (USD)
 * @param powerConsumption - Miner power consumption (kW)
 * @param hashRate - Miner hash rate (TH/s)
 * @param networkHashRate - Total network hash rate (TH/s)
 * @param blockReward - Current block reward (BTC)
 * @param blocksPerDay - Blocks mined per day (typically 144)
 * @returns Break-even Bitcoin price (USD)
 */
export function miningBreakEven(
  electricityCost: number,
  powerConsumption: number,
  hashRate: number,
  networkHashRate: number,
  blockReward: number,
  blocksPerDay: number = 144
): number {
  const dailyElectricityCost = powerConsumption * 24 * electricityCost;
  const minerShare = hashRate / networkHashRate;
  const dailyBTCEarned = blockReward * blocksPerDay * minerShare;

  return dailyBTCEarned === 0 ? Infinity : dailyElectricityCost / dailyBTCEarned;
}

/**
 * Calculate effective interest rate with compounding
 * @param nominalRate - Nominal annual rate
 * @param compoundingPeriods - Times compounded per year (12 = monthly)
 * @returns Effective annual rate
 */
export function effectiveAnnualRate(
  nominalRate: number,
  compoundingPeriods: number
): number {
  return Math.pow(1 + nominalRate / compoundingPeriods, compoundingPeriods) - 1;
}

/**
 * Calculate time to double investment (Rule of 72 approximation)
 * @param rate - Annual growth rate (decimal)
 * @returns Years to double
 */
export function yearsToDouble(rate: number): number {
  return Math.log(2) / Math.log(1 + rate);
}

/**
 * Calculate inflation-adjusted value
 * @param nominalValue - Value in nominal terms
 * @param cpiStart - CPI at start
 * @param cpiEnd - CPI at end
 * @returns Value in real (constant dollar) terms
 */
export function inflationAdjusted(
  nominalValue: number,
  cpiStart: number,
  cpiEnd: number
): number {
  return nominalValue * (cpiStart / cpiEnd);
}
