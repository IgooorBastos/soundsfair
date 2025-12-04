"use client";

import { useState } from 'react';
import type { DCAInput, DCAResult, Asset, Frequency } from '../types/tools';
import { formatCurrency, formatPercentage, formatNumber } from '../lib/dca-calculator';
import { exportDCAToCSV } from '../lib/csv-export';
import DCAChart from './DCAChart';

export default function DCACalculator() {
  const [formData, setFormData] = useState<DCAInput>({
    amount: 100,
    frequency: 'weekly',
    startDate: '2020-01-01',
    endDate: new Date().toISOString().split('T')[0],
    assets: ['BTC'] // Bitcoin only
  });

  const [results, setResults] = useState<DCAResult[] | null>(null);
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [earliestDate, setEarliestDate] = useState<string>('2013-04-28'); // CoinCap earliest BTC data
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (field: keyof DCAInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dca/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Calculation failed');
      }

      const data = await response.json();
      setResults(data.results);
      setChartData(data.chartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults(null);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      amount: 100,
      frequency: 'weekly',
      startDate: '2020-01-01',
      endDate: new Date().toISOString().split('T')[0],
      assets: ['BTC']
    });
    setResults(null);
    setChartData(null);
    setError(null);
  };

  const handleExportCSV = () => {
    if (!results || results.length === 0) return;

    try {
      exportDCAToCSV(formData, results);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setError('Failed to export CSV. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-brand-yellow">Bitcoin DCA</span> Calculator
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Simulate Dollar-Cost Averaging into Bitcoin with real historical price data
        </p>
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <p className="text-sm text-gray-400 italic">
            "The only truly scarce digital asset - 21 million forever"
          </p>
          <span className="hidden sm:inline text-gray-600">•</span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-xs">
            <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-green-400 font-medium">Real data since {earliestDate.split('-')[0]}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-dark-grey border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-brand-yellow">Settings</h2>

            {/* Investment Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Investment Amount (USD)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 focus:border-brand-yellow focus:outline-none"
                min="1"
              />
            </div>

            {/* Frequency */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['weekly', 'biweekly', 'monthly', 'daily'] as Frequency[]).map(freq => (
                  <button
                    key={freq}
                    onClick={() => handleInputChange('frequency', freq)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.frequency === freq
                        ? 'bg-brand-yellow text-black'
                        : 'bg-black border border-gray-800 text-gray-300 hover:border-brand-yellow'
                    }`}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 focus:border-brand-yellow focus:outline-none"
              />
            </div>

            {/* End Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 focus:border-brand-yellow focus:outline-none"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Bitcoin Info */}
            <div className="mb-6 p-4 bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">₿</span>
                <span className="font-semibold text-brand-yellow">Bitcoin Only</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-400">
                  Real historical price data from <span className="text-brand-yellow/80 font-medium">CoinCap API</span>
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-400">
                    Data available from <span className="text-white font-mono">{new Date(earliestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic">
                  That's over {Math.floor((new Date().getTime() - new Date(earliestDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years of real market data!
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full bg-brand-yellow text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : 'Calculate DCA'}
              </button>
              <button
                onClick={handleReset}
                className="w-full border border-gray-800 text-gray-300 font-medium py-3 rounded-lg hover:border-brand-yellow hover:text-brand-yellow transition-colors"
              >
                Reset
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {results && chartData ? (
            <>
              {/* Enhanced Chart */}
              <DCAChart
                chartData={chartData}
                results={results}
                startDate={formData.startDate}
              />

              {/* Summary Card */}
              {results[0] && (
                <div className="bg-dark-grey border-2 border-brand-yellow rounded-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">₿</span>
                      <h4 className="text-2xl font-semibold">Bitcoin Results</h4>
                    </div>
                    <span className="text-4xl font-bold text-brand-yellow">
                      {formatPercentage(results[0].roi)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 rounded-lg p-4">
                      <span className="text-sm text-gray-400 block mb-1">Total Invested</span>
                      <span className="text-xl font-semibold">{formatCurrency(results[0].totalInvested)}</span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <span className="text-sm text-gray-400 block mb-1">Current Value</span>
                      <span className="text-xl font-semibold text-green-400">{formatCurrency(results[0].currentValue)}</span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <span className="text-sm text-gray-400 block mb-1">Bitcoin Accumulated</span>
                      <span className="text-xl font-semibold">{formatNumber(results[0].units, 6)} BTC</span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <span className="text-sm text-gray-400 block mb-1">CAGR</span>
                      <span className="text-xl font-semibold">{formatPercentage(results[0].cagr)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Metrics Table */}
              <div className="bg-dark-grey border border-gray-800 rounded-lg p-6 overflow-x-auto">
                <h3 className="text-xl font-semibold mb-6">Detailed Metrics</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4">Asset</th>
                      <th className="text-right py-3 px-4">Invested</th>
                      <th className="text-right py-3 px-4">Units</th>
                      <th className="text-right py-3 px-4">Value</th>
                      <th className="text-right py-3 px-4">ROI</th>
                      <th className="text-right py-3 px-4">CAGR</th>
                      <th className="text-right py-3 px-4">Max Drawdown</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results[0] && (
                      <tr className="border-b border-gray-800/50">
                        <td className="py-3 px-4 font-medium">Bitcoin</td>
                        <td className="text-right py-3 px-4">{formatCurrency(results[0].totalInvested)}</td>
                        <td className="text-right py-3 px-4">{formatNumber(results[0].units, 6)}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(results[0].currentValue)}</td>
                        <td className="text-right py-3 px-4">
                          <span className={results[0].roi >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {formatPercentage(results[0].roi)}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">{formatPercentage(results[0].cagr)}</td>
                        <td className="text-right py-3 px-4 text-red-400">
                          {formatPercentage(results[0].drawdown)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleExportCSV}
                  disabled={!results || results.length === 0}
                  className="flex-1 border border-gray-800 text-gray-300 font-medium py-3 rounded-lg hover:border-brand-yellow hover:text-brand-yellow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export CSV
                </button>
                <button className="flex-1 border border-gray-800 text-gray-300 font-medium py-3 rounded-lg hover:border-brand-yellow hover:text-brand-yellow transition-colors">
                  Share Results
                </button>
              </div>
            </>
          ) : (
            <div className="bg-dark-grey border border-gray-800 rounded-lg p-12 text-center">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-lg font-medium">No Results Yet</p>
                <p className="text-sm mt-2">
                  Configure your DCA strategy on the left and click Calculate
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="font-medium">CSV exported successfully!</span>
        </div>
      )}
    </div>
  );
}
