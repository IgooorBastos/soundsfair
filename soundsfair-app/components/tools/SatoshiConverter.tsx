'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBitcoinPrice } from '@/lib/hooks/useBitcoinPrice';
import {
  btcToSats,
  satsToBtc,
  btcToFiat,
  fiatToBtc,
  satsToFiat,
  fiatToSats,
  formatBitcoinAmount,
  formatFiatAmount,
} from '@/lib/bitcoin/converter';
import type { Currency } from '@/app/types/tools';

interface ConversionValues {
  btc: string;
  sats: string;
  usd: string;
  eur: string;
  gbp: string;
  brl: string;
}

const PRESET_AMOUNTS = [
  { label: '0.001 BTC', btc: 0.001 },
  { label: '0.01 BTC', btc: 0.01 },
  { label: '0.1 BTC', btc: 0.1 },
  { label: '1 BTC', btc: 1 },
  { label: '100k sats', sats: 100_000 },
  { label: '1M sats', sats: 1_000_000 },
];

export default function SatoshiConverter() {
  const { price, loading, error } = useBitcoinPrice({
    currencies: ['usd', 'eur', 'gbp', 'brl'],
    refreshInterval: 60000,
  });

  const [values, setValues] = useState<ConversionValues>({
    btc: '1',
    sats: '100000000',
    usd: '0',
    eur: '0',
    gbp: '0',
    brl: '0',
  });

  const [activeField, setActiveField] = useState<keyof ConversionValues | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Update fiat values when price changes
  useEffect(() => {
    if (price && activeField !== 'usd' && activeField !== 'eur' && activeField !== 'gbp' && activeField !== 'brl') {
      const btcValue = parseFloat(values.btc) || 0;
      setValues(prev => ({
        ...prev,
        usd: btcToFiat(btcValue, price.usd || 0).toFixed(2),
        eur: btcToFiat(btcValue, price.eur || 0).toFixed(2),
        gbp: btcToFiat(btcValue, price.gbp || 0).toFixed(2),
        brl: btcToFiat(btcValue, price.brl || 0).toFixed(2),
      }));
    }
  }, [price]);

  const updateFromBtc = useCallback((btcValue: string) => {
    const btc = parseFloat(btcValue) || 0;
    const sats = btcToSats(btc);

    setValues({
      btc: btcValue,
      sats: sats.toString(),
      usd: btcToFiat(btc, price?.usd || 0).toFixed(2),
      eur: btcToFiat(btc, price?.eur || 0).toFixed(2),
      gbp: btcToFiat(btc, price?.gbp || 0).toFixed(2),
      brl: btcToFiat(btc, price?.brl || 0).toFixed(2),
    });
  }, [price]);

  const updateFromSats = useCallback((satsValue: string) => {
    const sats = parseFloat(satsValue) || 0;
    const btc = satsToBtc(sats);

    setValues({
      btc: btc.toFixed(8),
      sats: satsValue,
      usd: satsToFiat(sats, price?.usd || 0).toFixed(2),
      eur: satsToFiat(sats, price?.eur || 0).toFixed(2),
      gbp: satsToFiat(sats, price?.gbp || 0).toFixed(2),
      brl: satsToFiat(sats, price?.brl || 0).toFixed(2),
    });
  }, [price]);

  const updateFromFiat = useCallback((fiatValue: string, currency: Currency) => {
    const fiat = parseFloat(fiatValue) || 0;
    const priceInCurrency = price?.[currency] || 0;
    const btc = fiatToBtc(fiat, priceInCurrency);
    const sats = btcToSats(btc);

    setValues(prev => ({
      btc: btc.toFixed(8),
      sats: sats.toString(),
      usd: currency === 'usd' ? fiatValue : btcToFiat(btc, price?.usd || 0).toFixed(2),
      eur: currency === 'eur' ? fiatValue : btcToFiat(btc, price?.eur || 0).toFixed(2),
      gbp: currency === 'gbp' ? fiatValue : btcToFiat(btc, price?.gbp || 0).toFixed(2),
      brl: currency === 'brl' ? fiatValue : btcToFiat(btc, price?.brl || 0).toFixed(2),
    }));
  }, [price]);

  const handleInputChange = (field: keyof ConversionValues, value: string) => {
    setActiveField(field);

    // Allow empty string and numbers with decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (field === 'btc') updateFromBtc(value);
      else if (field === 'sats') updateFromSats(value);
      else if (field === 'usd') updateFromFiat(value, 'usd');
      else if (field === 'eur') updateFromFiat(value, 'eur');
      else if (field === 'gbp') updateFromFiat(value, 'gbp');
      else if (field === 'brl') updateFromFiat(value, 'brl');
    }
  };

  const handlePresetClick = (preset: typeof PRESET_AMOUNTS[0]) => {
    if (preset.btc) {
      updateFromBtc(preset.btc.toString());
    } else if (preset.sats) {
      updateFromSats(preset.sats.toString());
    }
  };

  const copyToClipboard = async (field: keyof ConversionValues, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400">
          <p className="font-semibold">Failed to load Bitcoin price</p>
          <p className="text-sm mt-1">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Price Ticker */}
      <div className="bg-surface-charcoal border border-border-default rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Bitcoin Price (USD)</p>
            <div className="flex items-baseline gap-3">
              {loading ? (
                <div className="h-8 w-32 bg-gray-800 animate-pulse rounded"></div>
              ) : (
                <>
                  <span className="text-3xl font-bold text-brand-yellow">
                    ${price?.usd.toLocaleString() || '...'}
                  </span>
                  {price?.change24h !== undefined && (
                    <span className={`text-sm font-medium ${price.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {price.change24h >= 0 ? '+' : ''}{price.change24h.toFixed(2)}%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            {price?.eur && (
              <div>
                <p className="text-gray-400">EUR</p>
                <p className="font-semibold">€{price.eur.toLocaleString()}</p>
              </div>
            )}
            {price?.gbp && (
              <div>
                <p className="text-gray-400">GBP</p>
                <p className="font-semibold">£{price.gbp.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Converter Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* BTC Input */}
        <div className="bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-colors">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Bitcoin (BTC)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={values.btc}
              onChange={(e) => handleInputChange('btc', e.target.value)}
              className="flex-1 bg-black border border-gray-800 rounded-lg px-4 py-3 text-lg font-mono focus:outline-none focus:border-brand-gold"
              placeholder="0.00000000"
            />
            <button
              onClick={() => copyToClipboard('btc', values.btc)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy"
            >
              {copiedField === 'btc' ? '✓' : '📋'}
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <span className="text-brand-yellow">₿</span>
            <span>1 BTC = 100,000,000 sats</span>
          </div>
        </div>

        {/* Sats Input */}
        <div className="bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-colors">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Satoshis (sats)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={values.sats}
              onChange={(e) => handleInputChange('sats', e.target.value)}
              className="flex-1 bg-black border border-gray-800 rounded-lg px-4 py-3 text-lg font-mono focus:outline-none focus:border-brand-gold"
              placeholder="0"
            />
            <button
              onClick={() => copyToClipboard('sats', values.sats)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy"
            >
              {copiedField === 'sats' ? '✓' : '📋'}
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Smallest unit of Bitcoin
          </div>
        </div>

        {/* USD Input */}
        <div className="bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-colors">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            US Dollar (USD)
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-black border border-gray-800 rounded-lg px-4 py-3 focus-within:border-brand-gold">
              <span className="text-gray-500 mr-2">$</span>
              <input
                type="text"
                value={values.usd}
                onChange={(e) => handleInputChange('usd', e.target.value)}
                className="flex-1 bg-transparent text-lg font-mono focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <button
              onClick={() => copyToClipboard('usd', values.usd)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy"
            >
              {copiedField === 'usd' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* EUR Input */}
        <div className="bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-colors">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Euro (EUR)
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-black border border-gray-800 rounded-lg px-4 py-3 focus-within:border-brand-gold">
              <span className="text-gray-500 mr-2">€</span>
              <input
                type="text"
                value={values.eur}
                onChange={(e) => handleInputChange('eur', e.target.value)}
                className="flex-1 bg-transparent text-lg font-mono focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <button
              onClick={() => copyToClipboard('eur', values.eur)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy"
            >
              {copiedField === 'eur' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* GBP Input */}
        <div className="bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-colors">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            British Pound (GBP)
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-black border border-gray-800 rounded-lg px-4 py-3 focus-within:border-brand-gold">
              <span className="text-gray-500 mr-2">£</span>
              <input
                type="text"
                value={values.gbp}
                onChange={(e) => handleInputChange('gbp', e.target.value)}
                className="flex-1 bg-transparent text-lg font-mono focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <button
              onClick={() => copyToClipboard('gbp', values.gbp)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy"
            >
              {copiedField === 'gbp' ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* BRL Input */}
        <div className="bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-colors">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Brazilian Real (BRL)
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-black border border-gray-800 rounded-lg px-4 py-3 focus-within:border-brand-gold">
              <span className="text-gray-500 mr-2">R$</span>
              <input
                type="text"
                value={values.brl}
                onChange={(e) => handleInputChange('brl', e.target.value)}
                className="flex-1 bg-transparent text-lg font-mono focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <button
              onClick={() => copyToClipboard('brl', values.brl)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy"
            >
              {copiedField === 'brl' ? '✓' : '📋'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mb-12">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Amounts</h3>
        <div className="flex flex-wrap gap-3">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset)}
              className="px-4 py-2 bg-surface-charcoal border border-border-default rounded-lg hover:border-brand-gold hover:bg-gray-900 transition-colors text-sm font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Educational Content */}
      <div className="space-y-8">
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">What is a Satoshi?</h2>
          <p className="text-gray-300 mb-4">
            A <strong className="text-brand-yellow">satoshi</strong> (sat) is the smallest unit of Bitcoin, named after Bitcoin's creator, Satoshi Nakamoto. One Bitcoin equals 100 million satoshis.
          </p>
          <p className="text-gray-300">
            Just like a dollar can be divided into 100 cents, one Bitcoin can be divided into 100,000,000 satoshis. This divisibility makes Bitcoin practical for transactions of any size, from micro-payments to large transfers.
          </p>
        </div>

        <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Why Denominate in Sats?</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Many Bitcoiners prefer thinking in satoshis rather than Bitcoin for several reasons:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-brand-yellow">Psychological advantage:</strong> Whole numbers are easier to understand than decimals (100,000 sats vs 0.001 BTC)</li>
              <li><strong className="text-brand-yellow">Future-proof:</strong> As Bitcoin's price increases, sats become the practical unit for everyday transactions</li>
              <li><strong className="text-brand-yellow">Precision:</strong> No need for long decimal places when pricing goods and services</li>
              <li><strong className="text-brand-yellow">Lightning Network:</strong> The Lightning Network naturally operates in satoshis</li>
            </ul>
          </div>
        </div>

        <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Bitcoin Unit Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400">Unit</th>
                  <th className="text-left py-3 px-4 text-gray-400">Symbol</th>
                  <th className="text-right py-3 px-4 text-gray-400">Value in BTC</th>
                  <th className="text-right py-3 px-4 text-gray-400">Value in Sats</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Bitcoin</td>
                  <td className="py-3 px-4 text-brand-yellow">₿</td>
                  <td className="text-right py-3 px-4 font-mono">1</td>
                  <td className="text-right py-3 px-4 font-mono">100,000,000</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">MilliBitcoin</td>
                  <td className="py-3 px-4">mBTC</td>
                  <td className="text-right py-3 px-4 font-mono">0.001</td>
                  <td className="text-right py-3 px-4 font-mono">100,000</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Bits (Microbitcoin)</td>
                  <td className="py-3 px-4">bits</td>
                  <td className="text-right py-3 px-4 font-mono">0.000001</td>
                  <td className="text-right py-3 px-4 font-mono">100</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Satoshi</td>
                  <td className="py-3 px-4">sats</td>
                  <td className="text-right py-3 px-4 font-mono">0.00000001</td>
                  <td className="text-right py-3 px-4 font-mono">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
