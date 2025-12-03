# Chart System Documentation

**Version:** 1.0 (Phase 2 Complete)
**Last Updated:** December 2024
**Status:** 5 Charts Live, 10+ Planned

---

## Overview

The chart system provides interactive, accessible, and visually consistent data visualizations for the Bitcoin education platform. Built with Recharts, TypeScript, and our visual identity system.

---

## Architecture

```
soundsfair-app/
├── components/charts/           # Chart components
│   ├── PurchasingPowerChart.tsx
│   ├── MoneySupplyChart.tsx
│   ├── IssuanceScheduleChart.tsx
│   ├── BitcoinSupplyCurveChart.tsx
│   ├── DCAPerformanceChart.tsx
│   └── index.ts                 # Centralized exports
├── lib/charts/                  # Utilities
│   ├── dataLoader.ts            # CSV parsing & loading
│   ├── formatters.ts            # Number/date formatting
│   ├── chartConfig.ts           # Shared configuration
│   └── calculations.ts          # Financial calculations
└── public/data/charts/          # CSV data files
    ├── inflation/
    ├── blockchain/
    ├── portfolio/
    └── geopolitics/
```

---

## Quick Start

### 1. Import a Chart

```tsx
import { PurchasingPowerChart } from '@/components/charts';

export default function LessonPage() {
  return (
    <div>
      <h1>Level 1: The Fiat System</h1>
      <PurchasingPowerChart />
    </div>
  );
}
```

### 2. Chart Auto-loads Data

Charts automatically:
- Load CSV data from `/public/data/charts/`
- Parse and format data
- Render with visual identity styling
- Handle loading and error states

### 3. Fully Responsive

All charts are mobile-responsive and accessible by default.

---

## Available Charts

### Level 1: Inflation

**PurchasingPowerChart**
- **Purpose:** Show how $1 in 1950 becomes $0.05 in 2023
- **Chart Type:** Area chart with gradient
- **Data:** `inflation/purchasing-power-decline.csv`
- **Usage:** Section 4 "The Inflation Machine"

**MoneySupplyChart**
- **Purpose:** M2 money supply explosion (2000-2023)
- **Chart Type:** Line chart with reference line at 2020
- **Data:** `inflation/m2-money-supply.csv`
- **Usage:** Section 3 "How Central Banks Create Money"

### Level 3: Blockchain

**IssuanceScheduleChart**
- **Purpose:** Bitcoin halving schedule and declining rewards
- **Chart Type:** Step-down line chart (logarithmic scale)
- **Data:** `blockchain/issuance-schedule.csv`
- **Usage:** Section 5 "The 21 Million Hard Cap"

**BitcoinSupplyCurveChart**
- **Purpose:** Total supply approaching 21M limit
- **Chart Type:** Area chart with 21M reference line
- **Data:** `blockchain/total-supply-curve.csv`
- **Usage:** Section 5 "The 21 Million Hard Cap"

### Level 5, 8: Portfolio

**DCAPerformanceChart**
- **Purpose:** Dollar-cost averaging results by start year
- **Chart Type:** Multi-line chart (logarithmic scale)
- **Data:** `portfolio/dca-performance-by-start.csv`
- **Usage:** Level 5 Section 5 "DCA Strategy", Level 8 Section 2

---

## Utility Libraries

### dataLoader.ts

```tsx
import { loadDataset } from '@/lib/charts/dataLoader';

// Load data by category and filename
const data = await loadDataset('inflation', 'purchasing-power-decline');

// Filter by date range
const filtered = filterByYearRange(data, 2000, 2023);

// Calculate year-over-year change
const withYoY = calculateYoYChange(data, 'M2_Money_Supply_Trillion_USD');
```

### formatters.ts

```tsx
import {
  formatCurrency,
  formatPercent,
  formatBTC,
  formatCompact,
} from '@/lib/charts/formatters';

formatCurrency(1234.56, 2);    // "$1,234.56"
formatPercent(0.05, 1);         // "5.0%"
formatBTC(0.05, 4);             // "0.0500 BTC"
formatCompact(1500000, 1);      // "1.5M"
```

### chartConfig.ts

```tsx
import {
  CHART_COLORS,
  XAXIS_CONFIG,
  YAXIS_CONFIG,
  TOOLTIP_CONFIG,
} from '@/lib/charts/chartConfig';

// Use in Recharts components
<XAxis {...XAXIS_CONFIG} />
<YAxis {...YAXIS_CONFIG} />
<Tooltip {...TOOLTIP_CONFIG} />
```

### calculations.ts

```tsx
import {
  compoundInterest,
  calculateDCA,
  stockToFlowRatio,
  realReturn,
} from '@/lib/charts/calculations';

// Calculate future value with 3% inflation over 35 years
const futureValue = compoundInterest(100, -0.03, 35); // $34.45

// Calculate stock-to-flow
const s2f = stockToFlowRatio(200000, 3200); // 62.5 (gold)
```

---

## Data Sources

All chart data is documented in `/public/data/charts/data-sources.md` with:
- Primary source URLs
- Methodology explanations
- Update frequencies
- Accuracy notes

**Key Sources:**
- US Bureau of Labor Statistics (CPI data)
- Federal Reserve (M2 money supply)
- Bitcoin Core protocol (issuance schedule)
- IMF COFER (dollar reserve data)
- Cambridge CCAF (hash rate distribution)

---

## Styling & Visual Identity

Charts follow the visual identity system defined in `/app/styles/visual-identity.css`:

**Colors:**
- Gold (#FFD000): Bitcoin, positive, hard money
- Red (#FF4444): Fiat, inflation, warnings
- Blue (#4477FF): Data, comparisons, traditional finance
- Gray (#808080): Context, neutral
- Green (#10B981): Success, positive outcomes

**Typography:**
- Font: Inter (sans-serif)
- Axis labels: 12px
- Titles: 24px bold
- Monospace for numbers (IBM Plex Mono)

**Accessibility:**
- WCAG AA compliant color contrast
- ARIA labels on all charts
- Keyboard navigation support
- Screen reader compatible tooltips

---

## Adding New Charts

### 1. Create CSV Data

Add to `/public/data/charts/{category}/{dataset-name}.csv`:

```csv
Year,Value,Change_Percent
2020,100,0
2021,105,5.0
2022,110,4.8
```

### 2. Document Data Source

Update `/public/data/charts/data-sources.md` with:
- Data source and URL
- Methodology
- Update frequency

### 3. Create Chart Component

```tsx
// components/charts/MyNewChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { loadDataset } from '@/lib/charts/dataLoader';
import { CHART_COLORS, XAXIS_CONFIG, YAXIS_CONFIG } from '@/lib/charts/chartConfig';

export const MyNewChart: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const chartData = await loadDataset('category', 'dataset-name');
      setData(chartData);
    };
    fetchData();
  }, []);

  return (
    <div className="vi-chart-container">
      <h3 className="vi-chart-title">Chart Title</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis {...XAXIS_CONFIG} dataKey="Year" />
          <YAxis {...YAXIS_CONFIG} />
          <Line dataKey="Value" stroke={CHART_COLORS.gold} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```

### 4. Export from Index

Add to `components/charts/index.ts`:

```tsx
export { MyNewChart } from './MyNewChart';
```

---

## Testing Charts

### 1. Visual Testing

Create a test page: `/app/test-charts/page.tsx`

```tsx
import { PurchasingPowerChart, MoneySupplyChart } from '@/components/charts';

export default function TestChartsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <PurchasingPowerChart />
      <MoneySupplyChart />
    </div>
  );
}
```

Visit: `http://localhost:3000/test-charts`

### 2. Data Validation

Verify CSV files load correctly:

```tsx
import { loadDataset } from '@/lib/charts/dataLoader';

const data = await loadDataset('inflation', 'purchasing-power-decline');
console.log(data); // Should show array of objects
```

### 3. Accessibility Testing

- Use axe DevTools browser extension
- Test keyboard navigation (Tab, Arrow keys)
- Verify ARIA labels with screen reader
- Check color contrast (4.5:1 minimum)

---

## Performance Optimization

### Current Optimizations

✅ **Lazy loading:** Charts load data asynchronously
✅ **Memoization:** React components prevent unnecessary re-renders
✅ **Responsive:** Charts adapt to screen size
✅ **CSV format:** Lightweight data format
✅ **Code splitting:** Charts can be dynamically imported

### Future Optimizations

- ⏳ Preload critical chart data
- ⏳ Cache CSV files with service worker
- ⏳ Virtualize large datasets
- ⏳ Progressive enhancement (static fallback images)

---

## Planned Charts (Phase 2 Expansion)

### High Priority (Next Batch)

1. **StockToFlowChart** (Level 5)
   - Compare Bitcoin S2F to gold, silver, commodities
   - Bar chart horizontal

2. **PortfolioAllocationChart** (Level 8)
   - Pie/donut charts for risk profiles
   - Interactive allocation calculator

3. **DollarReserveDeclineChart** (Level 7)
   - Stacked area showing USD, EUR, CNY shares
   - Dedollarization visualization

4. **HashRateMigrationChart** (Level 7)
   - Stacked area showing country distribution
   - China ban impact (Q1 2021 → Q4 2023)

5. **AdoptionCurveChart** (Level 9)
   - S-curve with adoption phases labeled
   - "We are here" marker

### Medium Priority

6. RealVsNominalReturnsChart
7. InflationAdjustedComparisonChart
8. CompoundInflationImpactChart
9. PrincipalVsInterestChart (mortgages)
10. BitcoinPriceHistoryChart (optional)

---

## Troubleshooting

**Issue:** Chart not loading
- Check CSV file exists in `/public/data/charts/`
- Verify category and filename match exactly
- Check browser console for errors

**Issue:** Data not displaying
- Verify CSV column names match component expectations
- Check data types (numbers vs strings)
- Ensure no empty rows in CSV

**Issue:** Styling looks wrong
- Import visual-identity.css in layout
- Check Tailwind classes are processing
- Verify chart container has proper dimensions

**Issue:** Performance is slow
- Reduce data points (sample large datasets)
- Use code splitting: `const Chart = dynamic(() => import('@/components/charts/Chart'))`
- Enable React.memo for chart components

---

## Maintenance

### Monthly Tasks

- [ ] Update CSV data with latest figures
- [ ] Verify external data sources still accessible
- [ ] Test all charts render correctly
- [ ] Check accessibility compliance

### Quarterly Tasks

- [ ] Review and update data-sources.md
- [ ] Add new charts as needed
- [ ] Optimize performance
- [ ] Gather user feedback on chart clarity

---

## Resources

- **Recharts Documentation:** https://recharts.org/
- **Visual Identity System:** `/docs/VISUAL_IDENTITY.md`
- **Data Sources:** `/public/data/charts/data-sources.md`
- **Tailwind Config:** `/tailwind.config.ts` (vi-* colors)

---

**Phase 2 Status:** ✅ Complete (5 charts, utilities, documentation)
**Next Phase:** Phase 3 - Image Generation (User Action Required)
**Updated:** December 2024
