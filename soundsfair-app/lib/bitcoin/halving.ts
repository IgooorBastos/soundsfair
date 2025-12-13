/**
 * Bitcoin Halving Calculations
 * Calculates halving information, estimates, and historical data
 */

import { addDays, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { BITCOIN_CONSTANTS } from '../constants';
import type { HalvingInfo, HistoricalHalving } from '@/app/types/tools';

/**
 * Fetch current block height from blockchain
 * Uses mempool.space as primary source
 */
export async function fetchCurrentBlockHeight(): Promise<number> {
  try {
    // Primary: mempool.space API
    const response = await fetch('https://mempool.space/api/blocks/tip/height', {
      next: { revalidate: 600 } // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error('Mempool.space API failed');
    }

    const height = await response.json();
    return typeof height === 'number' ? height : parseInt(height);

  } catch (error) {
    console.error('Mempool.space failed, trying fallback:', error);

    try {
      // Fallback: blockchain.info API
      const fallbackResponse = await fetch('https://blockchain.info/q/getblockcount');
      const height = await fallbackResponse.text();
      return parseInt(height);

    } catch (fallbackError) {
      console.error('All block height sources failed:', fallbackError);
      throw new Error('Failed to fetch current block height');
    }
  }
}

/**
 * Calculate next halving information
 * @param currentBlock Current block height
 * @returns Detailed halving information
 */
export function calculateNextHalving(currentBlock: number): HalvingInfo {
  const { BLOCKS_PER_HALVING, AVERAGE_BLOCK_TIME_MINUTES } = BITCOIN_CONSTANTS;

  // Determine current halving era (0, 1, 2, 3, 4...)
  const currentEra = Math.floor(currentBlock / BLOCKS_PER_HALVING);

  // Calculate next halving block
  const nextHalvingBlock = (currentEra + 1) * BLOCKS_PER_HALVING;

  // Blocks remaining until next halving
  const blocksRemaining = nextHalvingBlock - currentBlock;

  // Calculate time remaining
  const minutesRemaining = blocksRemaining * AVERAGE_BLOCK_TIME_MINUTES;
  const daysRemaining = Math.ceil(minutesRemaining / (60 * 24));
  const hoursRemaining = Math.ceil(minutesRemaining / 60);

  // Estimate date of next halving
  const estimatedDate = addDays(new Date(), daysRemaining);

  // Calculate current and next rewards
  const currentReward = 50 / Math.pow(2, currentEra);
  const nextReward = currentReward / 2;

  // Calculate progress percentage within current era
  const blocksIntoCurrentEra = currentBlock % BLOCKS_PER_HALVING;
  const progressPercent = (blocksIntoCurrentEra / BLOCKS_PER_HALVING) * 100;

  // Count completed halvings (same as current era)
  const completedHalvings = currentEra;

  return {
    currentBlock,
    nextHalvingBlock,
    blocksRemaining,
    estimatedDate,
    daysRemaining,
    hoursRemaining,
    minutesRemaining: Math.ceil(minutesRemaining),
    currentReward,
    nextReward,
    progressPercent,
    currentEra,
    completedHalvings,
  };
}

/**
 * Get historical halving data
 * @returns Array of all historical halvings
 */
export function getHistoricalHalvings(): HistoricalHalving[] {
  return BITCOIN_CONSTANTS.HALVINGS.map(halving => ({
    block: halving.block,
    date: halving.date,
    reward: halving.reward,
    era: halving.era,
  }));
}

/**
 * Get specific halving by era
 * @param era Halving era number (0, 1, 2, 3, 4...)
 * @returns Halving data or null if not found
 */
export function getHalvingByEra(era: number): HistoricalHalving | null {
  const halving = BITCOIN_CONSTANTS.HALVINGS.find(h => h.era === era);
  if (!halving) return null;

  return {
    block: halving.block,
    date: halving.date,
    reward: halving.reward,
    era: halving.era,
  };
}

/**
 * Calculate time until next halving from current date
 * @param halvingInfo Halving information
 * @returns Object with days, hours, minutes countdown
 */
export function getCountdownToHalving(halvingInfo: HalvingInfo): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
} {
  const now = new Date();
  const halvingDate = halvingInfo.estimatedDate;

  // Total differences
  const totalMinutes = differenceInMinutes(halvingDate, now);
  const totalHours = differenceInHours(halvingDate, now);
  const totalDays = differenceInDays(halvingDate, now);

  // Breakdown for display
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = 0; // We don't track seconds precisely

  return {
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
    totalMinutes,
  };
}

/**
 * Calculate total BTC supply at a given block
 * @param blockHeight Current block height
 * @returns Total BTC in circulation
 */
export function calculateSupplyAtBlock(blockHeight: number): number {
  const { BLOCKS_PER_HALVING } = BITCOIN_CONSTANTS;
  let totalSupply = 0;

  // Calculate supply for each completed era
  const currentEra = Math.floor(blockHeight / BLOCKS_PER_HALVING);

  // Sum up rewards from all completed eras
  for (let era = 0; era < currentEra; era++) {
    const rewardForEra = 50 / Math.pow(2, era);
    totalSupply += BLOCKS_PER_HALVING * rewardForEra;
  }

  // Add rewards from current era
  const blocksInCurrentEra = blockHeight % BLOCKS_PER_HALVING;
  const currentReward = 50 / Math.pow(2, currentEra);
  totalSupply += blocksInCurrentEra * currentReward;

  return totalSupply;
}

/**
 * Calculate percentage of total supply mined
 * @param blockHeight Current block height
 * @returns Percentage of 21M supply mined
 */
export function calculateSupplyPercentage(blockHeight: number): number {
  const currentSupply = calculateSupplyAtBlock(blockHeight);
  return (currentSupply / BITCOIN_CONSTANTS.MAX_SUPPLY) * 100;
}

/**
 * Estimate block height at a future date
 * @param futureDate Target date
 * @param currentBlock Current block height
 * @returns Estimated block height
 */
export function estimateBlockAtDate(futureDate: Date, currentBlock: number): number {
  const now = new Date();
  const minutesDifference = differenceInMinutes(futureDate, now);

  if (minutesDifference < 0) {
    throw new Error('Future date must be in the future');
  }

  const blocksToAdd = Math.floor(minutesDifference / BITCOIN_CONSTANTS.AVERAGE_BLOCK_TIME_MINUTES);
  return currentBlock + blocksToAdd;
}

/**
 * Get all future halvings up to a certain era
 * @param currentBlock Current block height
 * @param maxEra Maximum era to calculate (default: 10)
 * @returns Array of future halvings
 */
export function getFutureHalvings(
  currentBlock: number,
  maxEra: number = 10
): HalvingInfo[] {
  const { BLOCKS_PER_HALVING } = BITCOIN_CONSTANTS;
  const currentEra = Math.floor(currentBlock / BLOCKS_PER_HALVING);
  const futureHalvings: HalvingInfo[] = [];

  for (let era = currentEra + 1; era <= maxEra; era++) {
    const halvingBlock = era * BLOCKS_PER_HALVING;
    const blocksRemaining = halvingBlock - currentBlock;

    if (blocksRemaining <= 0) continue;

    const minutesRemaining = blocksRemaining * BITCOIN_CONSTANTS.AVERAGE_BLOCK_TIME_MINUTES;
    const daysRemaining = Math.ceil(minutesRemaining / (60 * 24));
    const estimatedDate = addDays(new Date(), daysRemaining);

    const reward = 50 / Math.pow(2, era - 1);
    const nextReward = reward / 2;

    futureHalvings.push({
      currentBlock,
      nextHalvingBlock: halvingBlock,
      blocksRemaining,
      estimatedDate,
      daysRemaining,
      hoursRemaining: Math.ceil(minutesRemaining / 60),
      minutesRemaining: Math.ceil(minutesRemaining),
      currentReward: reward,
      nextReward,
      progressPercent: 0,
      currentEra: era - 1,
      completedHalvings: era - 1,
    });
  }

  return futureHalvings;
}

/**
 * Format halving date as readable string
 * @param date Date to format
 * @returns Formatted string
 */
export function formatHalvingDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Check if a date is close to a halving (within 30 days)
 * @param currentBlock Current block height
 * @returns True if halving is imminent
 */
export function isHalvingImminent(currentBlock: number): boolean {
  const halvingInfo = calculateNextHalving(currentBlock);
  return halvingInfo.daysRemaining <= 30;
}

/**
 * Calculate mining reward per day
 * @param currentBlock Current block height
 * @returns Daily mining reward in BTC
 */
export function calculateDailyMiningReward(currentBlock: number): number {
  const currentEra = Math.floor(currentBlock / BITCOIN_CONSTANTS.BLOCKS_PER_HALVING);
  const currentReward = 50 / Math.pow(2, currentEra);

  // Average blocks per day: 144 (1 block every 10 minutes)
  const blocksPerDay = (24 * 60) / BITCOIN_CONSTANTS.AVERAGE_BLOCK_TIME_MINUTES;

  return blocksPerDay * currentReward;
}

/**
 * Get halving milestone messages
 * @param blocksRemaining Blocks remaining
 * @returns Milestone message or null
 */
export function getHalvingMilestone(blocksRemaining: number): string | null {
  if (blocksRemaining === 100000) return '100,000 blocks until halving!';
  if (blocksRemaining === 50000) return '50,000 blocks until halving!';
  if (blocksRemaining === 10000) return '10,000 blocks until halving!';
  if (blocksRemaining === 1000) return '1,000 blocks until halving!';
  if (blocksRemaining === 100) return '100 blocks until halving!';
  if (blocksRemaining === 10) return '10 blocks until halving!';
  if (blocksRemaining === 1) return 'Next block is the halving!';
  return null;
}
