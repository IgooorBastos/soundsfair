# Chart Data Sources Documentation

**Version:** 1.0
**Last Updated:** December 2024
**Purpose:** Document the origin, methodology, and accuracy of all chart data

---

## Overview

All chart data in this directory has been compiled from reputable sources and calculated using standard financial formulas. This document provides full transparency for educational integrity and allows for data verification and updates.

---

## Inflation Data (`/inflation`)

### 1. purchasing-power-decline.csv

**Description:** Shows how $1 in 1950 loses 95%+ purchasing power by 2023

**Data Source:**
- US Bureau of Labor Statistics (BLS) - Consumer Price Index (CPI) data
- Historical CPI values from 1950-2023
- URL: https://www.bls.gov/cpi/

**Methodology:**
```
Purchasing Power = 1 / (CPI_current / CPI_1950)
Cumulative Inflation = (1 - Purchasing_Power) × 100
```

**Update Frequency:** Annually (BLS releases annual CPI data)

**Accuracy Notes:**
- Official CPI likely understates real inflation (Boskin Commission adjustments)
- Real-world inflation (food, housing, healthcare) higher than reported
- Data accurate to official government statistics

---

### 2. m2-money-supply.csv

**Description:** US M2 money supply growth from 2000-2023, showing dramatic 2020-2021 expansion

**Data Source:**
- Federal Reserve Economic Data (FRED)
- M2 Money Stock series (M2SL)
- URL: https://fred.stlouisfed.org/series/M2SL

**Methodology:**
```
Annual Change % = ((M2_current - M2_previous) / M2_previous) × 100
```

**Update Frequency:** Monthly (FRED updates monthly, we use annual snapshots)

**Accuracy Notes:**
- Official Federal Reserve data
- 2020-2021 shows 29.3% and 7.2% growth (COVID stimulus)
- M2 includes cash, checking, savings, money market accounts
- Does not include M3 (discontinued 2006)

---

### 3. compound-inflation-impact.csv

**Description:** Shows impact of different inflation rates (2%, 3%, 5%, 7%) on $100 over 35 years

**Data Source:**
- Calculated using compound interest formula
- Inflation rate assumptions based on historical averages

**Methodology:**
```
Value After N Years = Initial_Value × (1 - inflation_rate)^N
```

**Example:**
- $100 at 2% inflation for 35 years = $100 × (0.98)^35 = $50.00
- $100 at 7% inflation for 35 years = $100 × (0.93)^35 = $9.37

**Update Frequency:** Static (mathematical formula, no external data)

**Accuracy Notes:**
- Demonstrates mathematical certainty of compound inflation
- 2% = official CPI target
- 5-7% = real-world inflation estimates

---

## Blockchain Data (`/blockchain`)

### 4. issuance-schedule.csv

**Description:** Bitcoin issuance schedule showing halving events and declining block rewards

**Data Source:**
- Bitcoin Core protocol (hardcoded consensus rules)
- Block height calculations
- URL: https://github.com/bitcoin/bitcoin (source code)

**Methodology:**
```
Block Reward = 50 / (2 ^ number_of_halvings)
Halving occurs every 210,000 blocks (~4 years)
Daily Issuance = Block_Reward × 144 blocks/day
Annual Issuance = Daily_Issuance × 365
```

**Update Frequency:** Static (protocol-defined, unchangeable)

**Accuracy Notes:**
- Mathematically verifiable from Bitcoin source code
- Block times vary (~9-11 minutes) but average 10 minutes
- Halving dates approximate (depends on hash rate)
- Final satoshi mined ~2140

---

### 5. total-supply-curve.csv

**Description:** Total BTC mined over time, approaching 21M asymptotic limit

**Data Source:**
- Derived from issuance schedule (above)
- Blockchain.com and CoinMetrics for historical verification

**Methodology:**
```
Total Supply = Sum of all block rewards issued
Percent of Total = (Total_Supply / 21,000,000) × 100
Remaining = 21,000,000 - Total_Supply
```

**Update Frequency:** Static calculation based on protocol

**Accuracy Notes:**
- Current supply verifiable via blockchain explorers
- As of 2024: ~19.69M BTC mined (93.8% of total)
- Lost coins (~4M estimated) not deducted
- Curve is S-shaped, asymptotic to 21M

---

### 6. stock-to-flow.csv

**Description:** Stock-to-Flow ratios comparing Bitcoin to precious metals and commodities

**Data Source:**
- **Gold/Silver/Commodities:** US Geological Survey (USGS), World Gold Council
- **Bitcoin:** Protocol-derived from issuance schedule
- URL: https://www.usgs.gov/centers/national-minerals-information-center

**Methodology:**
```
Stock-to-Flow = Existing_Supply / Annual_New_Supply

Example (Gold):
Stock = ~200,000 tonnes
Flow = ~3,200 tonnes/year
S2F = 200,000 / 3,200 = 62.5
```

**Update Frequency:** Annually for commodities; calculated for Bitcoin by year

**Accuracy Notes:**
- Bitcoin S2F increases with each halving
- Gold S2F relatively stable (~60-65)
- Copper/Oil have low S2F (easily produced)
- Bitcoin becomes "harder" than gold post-2024 halving

---

## Portfolio Data (`/portfolio`)

### 7. dca-performance-by-start.csv

**Description:** Dollar-Cost Averaging results starting in different years (2015, 2017, 2018, 2021)

**Data Source:**
- Historical Bitcoin price data from CoinGecko API
- Assumes $100/month investment
- URL: https://www.coingecko.com/

**Methodology:**
```
For each month:
- Invest $100
- Calculate BTC purchased = $100 / BTC_price_that_month
- Accumulate total BTC
- Portfolio value = Total_BTC × Current_BTC_Price
```

**Update Frequency:** Monthly (as BTC price updates)

**Accuracy Notes:**
- Assumes zero fees (add 1-2% for realism)
- Uses monthly average price (not specific day)
- 2015 start = best performer (early accumulation)
- 2021 start = bear market entry (lower current value)
- All periods profitable over 4+ years

---

### 8. allocation-by-risk-profile.csv

**Description:** Recommended portfolio allocations for different risk profiles

**Data Source:**
- Financial planning best practices
- Modern Portfolio Theory (MPT)
- Fidelity Digital Assets recommendations (5% BTC for moderate)
- Lyn Alden research (5-15% BTC)

**Methodology:**
- Conservative: Capital preservation, near retirement
- Moderate: Balanced growth/preservation
- Aggressive: Maximum growth, long horizon
- Ultra-Aggressive: Asymmetric upside focus

**Update Frequency:** Static guidance (not market-dependent)

**Accuracy Notes:**
- These are guidelines, not financial advice
- Individual circumstances vary
- Bitcoin allocation controversial (ranges from 0-100% among advisors)
- Our recommendations conservative vs. Bitcoin maximalists

---

### 9. inflation-adjusted-comparison.csv

**Description:** Real returns of different asset classes 2014-2024 adjusted for inflation

**Data Source:**
- **Bitcoin:** CoinGecko historical prices
- **Stocks:** S&P 500 index (Yahoo Finance)
- **Gold:** LBMA gold price
- **Bonds:** AGG bond index
- **Cash:** 0% nominal return, -3% real
- **Inflation:** CPI data (BLS)

**Methodology:**
```
Real Return = ((Nominal_Return - Inflation_Rate) / (1 + Inflation_Rate)) × 100

Example:
Nominal Return: +10%
Inflation: +3%
Real Return: (10 - 3) / 1.03 = 6.8%
```

**Update Frequency:** Annually

**Accuracy Notes:**
- Bitcoin volatility high but long-term trend strong
- Cash guaranteed real loss (negative real return)
- Stocks provide positive real return historically
- Gold preserves value but limited growth

---

### 10. real-vs-nominal-returns.csv

**Description:** Comparison of nominal returns vs. real returns after 3% inflation

**Data Source:**
- Historical average returns (1980-2023)
- Standard financial datasets (S&P 500, bond yields, etc.)

**Methodology:**
```
Real Return = Nominal_Return - Inflation_Rate

(Simplified; precise calculation uses compound formula)
```

**Update Frequency:** Static (uses long-term historical averages)

**Accuracy Notes:**
- Savings account: 1% nominal = -2% real (loss)
- Bitcoin: 45% average annual = 42% real (massive outperformance)
- Most assets barely beat inflation

---

## Geopolitics Data (`/geopolitics`)

### 11. dollar-reserve-decline.csv

**Description:** USD share of global foreign exchange reserves 1970-2023

**Data Source:**
- International Monetary Fund (IMF) - COFER database
- Currency Composition of Official Foreign Exchange Reserves
- URL: https://data.imf.org/regular.aspx?key=41175

**Methodology:**
- Direct reporting from IMF COFER dataset
- Quarterly data aggregated to annual

**Update Frequency:** Quarterly (IMF releases COFER data)

**Accuracy Notes:**
- 1970: USD = 86% (Bretton Woods era)
- 2023: USD = 58% (declining but still dominant)
- EUR introduced 1999 (~20% share)
- CNY = 2.8% (growing but small)
- Dedollarization trend clear but slow

---

### 12. hash-rate-migration.csv

**Description:** Bitcoin hash rate distribution by country Q1 2021 - Q4 2023 (China ban impact)

**Data Source:**
- Cambridge Centre for Alternative Finance (CCAF)
- Cambridge Bitcoin Electricity Consumption Index (CBECI)
- URL: https://ccaf.io/cbnsi/cbeci

**Methodology:**
- IP address geolocation of mining pools
- Self-reported data from mining farms
- Academic estimates

**Update Frequency:** Quarterly

**Accuracy Notes:**
- China ban (May 2021) caused dramatic shift
- China: 65% → 20% (many went underground)
- USA: 7% → 38% (now largest)
- Kazakhstan surged then declined (grid issues)
- Data estimates only (some miners use VPNs)

---

### 13. bitcoin-adoption-curve.csv

**Description:** Projected Bitcoin adoption following technology diffusion S-curve

**Data Source:**
- Actual: Blockchain.com wallet users, exchange accounts
- Projected: Diffusion of Innovation theory (Rogers, 1962)
- Historical comparisons: Internet adoption curve (1990-2020)

**Methodology:**
```
Adoption follows S-curve (logistic function):
Adoption(t) = L / (1 + e^(-k(t - t0)))

Where:
L = maximum adoption (100%)
k = growth rate
t0 = midpoint year
```

**Update Frequency:** Annually (adjust projections as data evolves)

**Accuracy Notes:**
- 2024: ~5-6% global population has owned Bitcoin
- Early Majority phase currently
- Projections speculative (could be faster or slower)
- Based on technology adoption patterns (internet, mobile)

---

## Data Verification Process

### How to Verify Data Accuracy

**1. Check Primary Sources:**
- All data sources include URLs for verification
- Cross-reference with official government/institutional data

**2. Recalculate Formulas:**
- All calculations documented with formulas
- Use provided methodology to independently verify

**3. Compare with Multiple Sources:**
- Inflation: BLS, TruFlation, Shadow Stats
- Bitcoin: Multiple blockchain explorers (Blockchain.com, Mempool.space)
- Financial: Yahoo Finance, FRED, Bloomberg

**4. Update Schedule:**
- Inflation: Annually (January, after BLS release)
- Bitcoin: As needed (halvings, significant events)
- Portfolio: Annually (update returns)
- Geopolitics: Quarterly (IMF COFER releases)

### Data Integrity Standards

✅ **Transparent Sourcing:** All sources documented
✅ **Verifiable:** Users can check primary sources
✅ **Conservative:** When uncertain, understate claims
✅ **Updated:** Schedule for regular data refreshes
✅ **Reproducible:** Formulas provided for calculations

---

## Usage Guidelines

### For Educators

- Cite primary sources when presenting data
- Acknowledge uncertainty ranges
- Update data before each lesson iteration
- Encourage students to verify independently

### For Developers

- Use CSV files directly for chart components
- Don't modify raw data files (create new if needed)
- Document any transformations applied
- Add unit tests for calculation functions

### For Researchers

- Cross-reference with primary sources
- Note limitations and assumptions
- Contribute corrections via pull requests
- Suggest additional data sources

---

## Changelog

**v1.0 (December 2024):**
- Initial data compilation
- 13 datasets across 4 categories
- Sources documented with URLs
- Methodologies explained

**Future Updates:**
- Add real-time API integration for dynamic data
- Expand geopolitics datasets (BRICS, El Salvador metrics)
- Add remittance cost data (Level 6)
- Include energy consumption data (mining efficiency)

---

## Contact

**Data Accuracy Issues:** Please open GitHub issue with evidence
**Source Updates:** Submit pull request with updated CSV and documentation
**Methodology Questions:** Reference this document first, then contact maintainers

---

**Status:** 13 datasets documented
**Total Data Points:** 500+ individual measurements
**Sources:** 10+ authoritative institutions (BLS, FRED, IMF, USGS, CCAF, etc.)
**Last Verified:** December 2024
