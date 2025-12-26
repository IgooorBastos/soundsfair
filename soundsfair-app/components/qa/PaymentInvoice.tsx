"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PaymentInvoiceProps {
  invoiceId: string;
  invoiceUrl: string;
  lightningInvoice: string;
  qrCodeData: string;
  amountSats: number;
  expiresAt: string;
  questionId: string;
  onPaymentComplete?: () => void;
}

export default function PaymentInvoice({
  invoiceUrl,
  lightningInvoice,
  qrCodeData,
  amountSats,
  expiresAt,
  questionId,
  onPaymentComplete,
}: PaymentInvoiceProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "paid" | "expired" | "checking"
  >("pending");

  // Calculate time left
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        setIsExpired(true);
        setPaymentStatus("expired");
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Poll payment status
  useEffect(() => {
    if (paymentStatus === "paid" || paymentStatus === "expired") {
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(
          `/api/qa/payment-status?questionId=${questionId}`
        );
        const data = await response.json();

        if (data.paymentStatus === "paid") {
          setPaymentStatus("paid");
          if (onPaymentComplete) {
            onPaymentComplete();
          }
        } else if (data.paymentStatus === "expired") {
          setPaymentStatus("expired");
        }
      } catch (error) {
        console.error("Failed to check payment status:", error);
      }
    };

    // Check immediately
    checkPaymentStatus();

    // Then poll every 5 seconds
    const interval = setInterval(checkPaymentStatus, 5000);

    return () => clearInterval(interval);
  }, [questionId, paymentStatus, onPaymentComplete]);

  const handleCopyInvoice = async () => {
    try {
      await navigator.clipboard.writeText(lightningInvoice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy invoice:", error);
    }
  };

  if (paymentStatus === "paid") {
    return (
      <div className="bg-surface-charcoal border border-semantic-success rounded-card p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-semantic-success/20 rounded-full mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-2xl font-bold text-semantic-success mb-3">
          Payment Confirmed!
        </h3>
        <p className="text-text-secondary mb-4">
          Your question has been added to the queue. You&apos;ll receive an answer
          via email according to your chosen tier.
        </p>
        <p className="text-sm text-text-muted">Question ID: {questionId}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-charcoal border border-border-gold rounded-card p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-semantic-lightning/10 border border-semantic-lightning rounded-full mb-4">
          <span className="text-semantic-lightning text-sm font-semibold">
            ⚡ AWAITING PAYMENT
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Lightning Invoice</h2>
        <p className="text-text-secondary">
          Scan the QR code or copy the invoice to pay with your Lightning wallet
        </p>
      </div>

      {/* Amount */}
      <div className="bg-surface-black border border-border-default rounded-lg p-6 mb-6 text-center">
        <p className="text-sm text-text-tertiary mb-2">Amount</p>
        <p className="text-4xl font-bold text-brand-gold">
          {amountSats.toLocaleString()}
          <span className="text-xl ml-2">sats</span>
        </p>
        <p className="text-sm text-text-muted mt-2">
          ≈ ${((amountSats / 100000000) * 100000).toFixed(2)} USD
        </p>
      </div>

      {/* QR Code */}
      <div className="bg-white p-6 rounded-lg mb-6 flex items-center justify-center">
        <Image
          src={qrCodeData}
          alt="Lightning Invoice QR Code"
          width={300}
          height={300}
          className="max-w-full h-auto"
        />
      </div>

      {/* Invoice String */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Lightning Invoice (BOLT11)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={lightningInvoice}
            readOnly
            className="
              flex-1 px-4 py-3 bg-surface-black border border-border-default rounded-lg
              text-text-primary text-sm font-mono
              focus:outline-none focus:ring-2 focus:ring-brand-gold
            "
          />
          <button
            onClick={handleCopyInvoice}
            className="
              px-4 py-3 bg-brand-gold text-black font-semibold rounded-lg
              hover:bg-brand-gold-hover transition-colors
              whitespace-nowrap
            "
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6 text-center">
        <p className="text-sm text-text-tertiary mb-1">Time remaining</p>
        <p
          className={`text-2xl font-bold ${
            isExpired
              ? "text-semantic-error"
              : parseInt(timeLeft.split(":")[0]) < 5
              ? "text-semantic-warning"
              : "text-text-primary"
          }`}
        >
          {timeLeft}
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <a
          href={invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block w-full px-6 py-3 bg-brand-gold text-black font-bold rounded-lg
            hover:bg-brand-gold-hover transition-colors text-center
          "
        >
          Open in Wallet
        </a>

        <button
          onClick={() => window.location.reload()}
          className="
            block w-full px-6 py-3 bg-surface-black border border-border-default
            text-text-primary font-semibold rounded-lg
            hover:border-border-muted transition-colors
          "
        >
          I&apos;ve Already Paid
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-surface-black border border-border-default rounded-lg">
        <p className="text-sm text-text-secondary mb-2">
          <strong>How to pay:</strong>
        </p>
        <ol className="text-sm text-text-tertiary space-y-1 list-decimal list-inside">
          <li>Open your Lightning wallet (Phoenix, Breez, Wallet of Satoshi, etc.)</li>
          <li>Scan the QR code or paste the invoice</li>
          <li>Confirm the payment</li>
          <li>Wait for confirmation (usually instant)</li>
        </ol>
      </div>

      {/* Status Indicator */}
      {paymentStatus === "checking" && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-text-muted">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Checking payment status...
          </div>
        </div>
      )}

      {isExpired && (
        <div className="mt-4 p-4 bg-semantic-error/10 border border-semantic-error rounded-lg">
          <p className="text-semantic-error text-sm text-center">
            This invoice has expired. Please submit your question again to
            generate a new invoice.
          </p>
        </div>
      )}
    </div>
  );
}
