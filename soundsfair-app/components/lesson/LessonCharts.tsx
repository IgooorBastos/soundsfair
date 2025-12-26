'use client';

import React from 'react';
import { MoneySupplyChart } from '@/components/charts/MoneySupplyChart';
import { PurchasingPowerChart } from '@/components/charts/PurchasingPowerChart';
import { BitcoinSupplyCurveChart } from '@/components/charts/BitcoinSupplyCurveChart';
import { IssuanceScheduleChart } from '@/components/charts/IssuanceScheduleChart';
import { DCAPerformanceChart } from '@/components/charts/DCAPerformanceChart';

interface LessonChartsProps {
  level: number;
}

/**
 * LessonCharts - Conditionally renders educational charts based on lesson level
 *
 * Level 1 (Fiat System): MoneySupplyChart + PurchasingPowerChart
 * Level 3 (Bitcoin Revolution): BitcoinSupplyCurveChart + IssuanceScheduleChart
 * Level 5 (Store of Value): DCAPerformanceChart + PurchasingPowerChart
 */
export default function LessonCharts({ level }: LessonChartsProps) {
  return (
    <div className="my-16 space-y-12">
      {/* Level 1: The Fiat Money System */}
      {level === 1 && (
        <>
          <div className="border-t-2 border-brand-gold/30 pt-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                📊 Interactive Data Visualizations
              </h2>
              <p className="text-text-secondary">
                Explore the data behind fiat money&apos;s failures
              </p>
            </div>

            {/* Money Supply Growth Chart */}
            <div className="mb-12">
              <MoneySupplyChart />
            </div>

            {/* Purchasing Power Decline Chart */}
            <div className="mb-12">
              <PurchasingPowerChart />
            </div>

            <div className="p-4 bg-surface-charcoal border-l-4 border-brand-gold rounded">
              <p className="text-text-secondary text-sm">
                <strong className="text-brand-gold">💡 Key Takeaway:</strong> These charts illustrate the core problems with fiat currency—unlimited money printing leads to inevitable purchasing power erosion. Your savings lose value while governments benefit from inflation.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Level 3: Bitcoin Revolution */}
      {level === 3 && (
        <>
          <div className="border-t-2 border-brand-gold/30 pt-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                📊 Bitcoin&apos;s Mathematical Certainty
              </h2>
              <p className="text-text-secondary">
                Visualize Bitcoin&apos;s predictable supply and absolute scarcity
              </p>
            </div>

            {/* Bitcoin Supply Curve */}
            <div className="mb-12">
              <BitcoinSupplyCurveChart />
            </div>

            {/* Issuance Schedule & Halvings */}
            <div className="mb-12">
              <IssuanceScheduleChart />
            </div>

            <div className="p-4 bg-surface-charcoal border-l-4 border-brand-gold rounded">
              <p className="text-text-secondary text-sm">
                <strong className="text-brand-gold">💡 Key Takeaway:</strong> Unlike fiat currency where supply is unlimited and unpredictable, Bitcoin&apos;s supply is mathematically fixed and transparent. Every 4 years, the issuance rate halves, creating absolute scarcity enforced by code, not policy.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Level 5: Store of Value */}
      {level === 5 && (
        <>
          <div className="border-t-2 border-brand-gold/30 pt-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                📊 Bitcoin as Wealth Protection
              </h2>
              <p className="text-text-secondary">
                Historical performance and inflation protection data
              </p>
            </div>

            {/* DCA Performance Chart */}
            <div className="mb-12">
              <DCAPerformanceChart />
            </div>

            {/* Purchasing Power Comparison */}
            <div className="mb-12">
              <PurchasingPowerChart />
            </div>

            <div className="p-4 bg-surface-charcoal border-l-4 border-brand-gold rounded">
              <p className="text-text-secondary text-sm">
                <strong className="text-brand-gold">💡 Key Takeaway:</strong> Dollar-Cost Averaging (DCA) into Bitcoin has historically outperformed almost every start date, even during market corrections. While fiat loses purchasing power, Bitcoin has preserved and grown wealth over time.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
