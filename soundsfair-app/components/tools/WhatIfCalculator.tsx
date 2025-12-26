'use client';

import { useState } from 'react';

interface CalculationResult {
  investmentAmount: number;
  investmentDate: string;
  bitcoinPriceAtPurchase: number;
  bitcoinAmountPurchased: number;
  currentBitcoinPrice: number;
  currentValue: number;
  totalGain: number;
  percentageGain: number;
  daysHeld: number;
  yearsHeld: number;
  annualizedReturn: number;
}

export default function WhatIfCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState<string>('1000');
  const [selectedDate, setSelectedDate] = useState<string>('2015-01-01');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get min and max dates
  const minDate = '2010-07-18'; // Bitcoin's first price data
  const maxDate = new Date().toISOString().split('T')[0]; // Today

  const calculateInvestment = async () => {
    if (!investmentAmount || !selectedDate) {
      setError('Please enter an investment amount and select a date');
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }

    setCalculating(true);
    setError(null);

    try {
      // Fetch historical price for the selected date
      const historicalResponse = await fetch(
        `/api/bitcoin/historical?date=${selectedDate}`
      );

      if (!historicalResponse.ok) {
        throw new Error('Failed to fetch historical Bitcoin price');
      }

      const historicalData = await historicalResponse.json();

      if (!historicalData.success || !historicalData.data) {
        throw new Error('Invalid historical price data');
      }

      const historicalPrice = historicalData.data.price;

      // Fetch current Bitcoin price
      const currentResponse = await fetch('/api/bitcoin/price');

      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current Bitcoin price');
      }

      const currentData = await currentResponse.json();

      if (!currentData.success || !currentData.data) {
        throw new Error('Invalid current price data');
      }

      const currentPrice = currentData.data.usd;

      // Calculate results
      const bitcoinAmount = amount / historicalPrice;
      const currentValue = bitcoinAmount * currentPrice;
      const totalGain = currentValue - amount;
      const percentageGain = ((currentValue - amount) / amount) * 100;

      // Calculate days and years held
      const purchaseDate = new Date(selectedDate);
      const today = new Date();
      const daysHeld = Math.floor(
        (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const yearsHeld = daysHeld / 365.25;

      // Calculate annualized return
      const annualizedReturn = yearsHeld > 0
        ? (Math.pow(currentValue / amount, 1 / yearsHeld) - 1) * 100
        : percentageGain;

      setResult({
        investmentAmount: amount,
        investmentDate: selectedDate,
        bitcoinPriceAtPurchase: historicalPrice,
        bitcoinAmountPurchased: bitcoinAmount,
        currentBitcoinPrice: currentPrice,
        currentValue,
        totalGain,
        percentageGain,
        daysHeld,
        yearsHeld,
        annualizedReturn,
      });
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate investment');
    } finally {
      setCalculating(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatBTC = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="bg-gradient-to-br from-brand-yellow/10 via-surface-charcoal to-surface-charcoal border-2 border-brand-yellow rounded-lg p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          What if you had bought Bitcoin?
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Investment Amount */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Investment Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                $
              </span>
              <input
                type="number"
                min="0"
                step="100"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                className="w-full bg-black border-2 border-gray-700 rounded-lg px-10 py-3 text-white text-lg focus:border-brand-yellow focus:outline-none transition-colors"
                placeholder="1000"
              />
            </div>
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white text-lg focus:border-brand-yellow focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateInvestment}
          disabled={calculating}
          className="w-full bg-brand-yellow text-black font-bold text-lg py-4 rounded-lg hover:bg-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {calculating ? 'Calculating...' : 'Calculate Returns'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && !error && (
        <>
          {/* Main Result Card */}
          <div className="bg-gradient-to-br from-green-500/20 to-surface-charcoal border-2 border-green-500 rounded-lg p-8">
            <div className="text-center mb-6">
              <p className="text-gray-400 mb-2">
                {formatCurrency(result.investmentAmount)} invested on {formatDate(result.investmentDate)}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Would be worth today:
              </p>
              <div className="text-5xl md:text-6xl font-bold text-green-400 mb-4">
                {formatCurrency(result.currentValue)}
              </div>
              <div className="flex items-center justify-center gap-4 text-xl">
                <div className="text-green-400 font-semibold">
                  +{formatCurrency(result.totalGain)}
                </div>
                <div className="text-gray-500">•</div>
                <div className="text-brand-yellow font-bold">
                  {result.percentageGain > 0 ? '+' : ''}{result.percentageGain.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4 pt-6 border-t border-gray-700">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">BTC Acquired</div>
                <div className="text-lg font-bold text-white">
                  {formatBTC(result.bitcoinAmountPurchased)} BTC
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Purchase Price</div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(result.bitcoinPriceAtPurchase)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Current Price</div>
                <div className="text-lg font-bold text-brand-yellow">
                  {formatCurrency(result.currentBitcoinPrice)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Price Increase</div>
                <div className="text-lg font-bold text-green-400">
                  {((result.currentBitcoinPrice / result.bitcoinPriceAtPurchase - 1) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Time Held */}
            <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
              <div className="text-sm text-gray-400 mb-2">Time Held</div>
              <div className="text-3xl font-bold text-white mb-1">
                {result.yearsHeld.toFixed(1)} years
              </div>
              <div className="text-sm text-gray-500">
                {result.daysHeld.toLocaleString()} days
              </div>
            </div>

            {/* Annualized Return */}
            <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
              <div className="text-sm text-gray-400 mb-2">Annualized Return</div>
              <div className="text-3xl font-bold text-brand-yellow mb-1">
                {result.annualizedReturn > 0 ? '+' : ''}{result.annualizedReturn.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-500">
                Per year
              </div>
            </div>

            {/* ROI Multiple */}
            <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
              <div className="text-sm text-gray-400 mb-2">Return Multiple</div>
              <div className="text-3xl font-bold text-green-400 mb-1">
                {(result.currentValue / result.investmentAmount).toFixed(2)}x
              </div>
              <div className="text-sm text-gray-500">
                Original investment
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3 text-brand-yellow">
              📚 Understanding These Returns
            </h3>
            <div className="space-y-3 text-gray-300">
              <p>
                This calculator shows the historical performance of Bitcoin as an investment.
                A <strong className="text-white">{formatCurrency(result.investmentAmount)}</strong> investment
                on <strong className="text-white">{formatDate(result.investmentDate)}</strong> would have purchased{' '}
                <strong className="text-brand-yellow">{formatBTC(result.bitcoinAmountPurchased)} BTC</strong>{' '}
                at a price of <strong className="text-white">{formatCurrency(result.bitcoinPriceAtPurchase)}</strong> per Bitcoin.
              </p>
              <p>
                Today, that same amount of Bitcoin is worth{' '}
                <strong className="text-green-400">{formatCurrency(result.currentValue)}</strong>, representing
                a gain of <strong className="text-green-400">{result.percentageGain.toFixed(2)}%</strong> over{' '}
                <strong className="text-white">{result.yearsHeld.toFixed(1)} years</strong>.
              </p>
              <p className="text-sm text-gray-400 mt-4">
                ⚠️ <strong>Important:</strong> Past performance does not guarantee future results. This tool is for
                educational purposes only and should not be considered financial advice. Bitcoin is a volatile asset,
                and investments can lose value.
              </p>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-gradient-to-r from-brand-yellow/10 to-transparent border-2 border-brand-yellow rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Share Your Results</h3>
            <p className="text-gray-400 mb-4">
              Show others how Bitcoin has performed as a long-term investment
            </p>
            <button
              onClick={() => {
                const url = `${window.location.origin}/tools/what-if-calculator?amount=${result.investmentAmount}&date=${result.investmentDate}`;
                navigator.clipboard.writeText(url);
                alert('URL copied to clipboard!');
              }}
              className="px-6 py-3 bg-brand-yellow text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Copy Share Link
            </button>
          </div>
        </>
      )}

      {/* How It Works Section */}
      <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-brand-yellow">How This Calculator Works</h3>
        <div className="space-y-4 text-gray-300">
          <div>
            <h4 className="font-semibold text-white mb-2">📅 Historical Price Data</h4>
            <p className="text-sm">
              We use actual Bitcoin price data from major exchanges to calculate how much Bitcoin
              you could have purchased on any given date since July 2010.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">💰 Real-Time Current Price</h4>
            <p className="text-sm">
              The current value is calculated using live Bitcoin price data, updated every minute,
              to show you what your investment would be worth today.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">📊 Performance Metrics</h4>
            <p className="text-sm">
              We calculate total return, percentage gain, annualized return, and return multiple
              to give you a comprehensive view of the investment&apos;s performance over time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">🎯 Educational Purpose</h4>
            <p className="text-sm">
              This tool helps you understand Bitcoin&apos;s historical performance and the power of
              long-term holding. It&apos;s designed to educate, not to predict future returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
