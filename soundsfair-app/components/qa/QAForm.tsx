"use client";

import { useState } from "react";
import SatsSlider from "@/components/qa/SatsSlider";
import PaymentInvoice from "@/components/qa/PaymentInvoice";
import type { SubmitQuestionResponse } from "@/app/types/qa";

export default function QAForm() {
  const [formData, setFormData] = useState({
    userEmail: "",
    userName: "",
    questionText: "",
    amountSats: 5000, // Default to middle tier
    publishToArchive: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [paymentData, setPaymentData] = useState<SubmitQuestionResponse | null>(null);

  const handleInputChange = (
    field: string,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.userEmail) {
      newErrors.userEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email address";
    }

    // Question validation
    if (!formData.questionText) {
      newErrors.questionText = "Please enter your question";
    } else if (formData.questionText.length < 20) {
      newErrors.questionText = "Question must be at least 20 characters";
    } else if (formData.questionText.length > 5000) {
      newErrors.questionText = "Question must be less than 5000 characters";
    }

    // Amount validation
    if (formData.amountSats < 1000) {
      newErrors.amountSats = "Minimum amount is 1,000 sats";
    } else if (formData.amountSats > 1000000) {
      // Soft maximum suggestion (1M sats = ~$1,000 at $100k BTC)
      newErrors.amountSats = "For amounts above 1M sats, please contact us directly for custom service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/qa/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: formData.userEmail,
          userName: formData.userName || undefined,
          questionText: formData.questionText,
          amountSats: formData.amountSats,
          publishToArchive: formData.publishToArchive,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit question");
      }

      // Store payment data to show invoice
      setPaymentData(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit question. Please try again or contact support."
      );
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = formData.questionText.length;
  const maxCharacters = 5000;
  const minCharacters = 20;

  // Show payment invoice if submission was successful
  if (paymentData) {
    return (
      <PaymentInvoice
        invoiceId={paymentData.payment.invoiceId}
        invoiceUrl={paymentData.payment.invoiceUrl}
        lightningInvoice={paymentData.payment.lightningInvoice}
        qrCodeData={paymentData.payment.qrCodeData}
        amountSats={paymentData.payment.amountSats}
        expiresAt={paymentData.payment.expiresAt}
        questionId={paymentData.questionId}
        onPaymentComplete={() => {
          // Reset form or redirect to success page
          setPaymentData(null);
          setFormData({
            userEmail: "",
            userName: "",
            questionText: "",
            amountSats: 5000,
            publishToArchive: false,
          });
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-charcoal border border-border-default rounded-card p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold mb-6">Submit Your Question</h2>

      {/* Email */}
      <div className="mb-6">
        <label
          htmlFor="userEmail"
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          Email Address <span className="text-semantic-error">*</span>
        </label>
        <input
          type="email"
          id="userEmail"
          value={formData.userEmail}
          onChange={(e) => handleInputChange("userEmail", e.target.value)}
          className={`
            w-full px-4 py-3 bg-surface-black border rounded-lg
            text-text-primary placeholder-text-disabled
            focus:outline-none focus:ring-2 focus:ring-brand-gold
            ${errors.userEmail ? "border-semantic-error" : "border-border-default"}
          `}
          placeholder="your@email.com"
          disabled={isSubmitting}
        />
        {errors.userEmail && (
          <p className="text-semantic-error text-sm mt-1">{errors.userEmail}</p>
        )}
        <p className="text-xs text-text-muted mt-1">
          We&apos;ll send your answer here. No spam, ever.
        </p>
      </div>

      {/* Name (Optional) */}
      <div className="mb-6">
        <label
          htmlFor="userName"
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          Name <span className="text-text-muted">(optional)</span>
        </label>
        <input
          type="text"
          id="userName"
          value={formData.userName}
          onChange={(e) => handleInputChange("userName", e.target.value)}
          className="
            w-full px-4 py-3 bg-surface-black border border-border-default rounded-lg
            text-text-primary placeholder-text-disabled
            focus:outline-none focus:ring-2 focus:ring-brand-gold
          "
          placeholder="John Doe"
          maxLength={100}
          disabled={isSubmitting}
        />
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <label
          htmlFor="questionText"
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          Your Question <span className="text-semantic-error">*</span>
        </label>
        <textarea
          id="questionText"
          value={formData.questionText}
          onChange={(e) => handleInputChange("questionText", e.target.value)}
          rows={8}
          className={`
            w-full px-4 py-3 bg-surface-black border rounded-lg
            text-text-primary placeholder-text-disabled resize-none
            focus:outline-none focus:ring-2 focus:ring-brand-gold
            ${
              errors.questionText
                ? "border-semantic-error"
                : "border-border-default"
            }
          `}
          placeholder="Describe your Bitcoin question in detail. The more context you provide, the better the answer will be..."
          maxLength={maxCharacters}
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-between mt-1">
          <div>
            {errors.questionText && (
              <p className="text-semantic-error text-sm">
                {errors.questionText}
              </p>
            )}
          </div>
          <p
            className={`text-xs ${
              characterCount < minCharacters
                ? "text-text-muted"
                : characterCount > maxCharacters - 100
                ? "text-semantic-warning"
                : "text-text-muted"
            }`}
          >
            {characterCount} / {maxCharacters} characters
            {characterCount < minCharacters &&
              ` (min ${minCharacters} required)`}
          </p>
        </div>
      </div>

      {/* Sats Amount Slider */}
      <div className="mb-6">
        <SatsSlider
          value={formData.amountSats}
          onChange={(value) => handleInputChange("amountSats", value)}
        />
        {errors.amountSats && (
          <p className="text-semantic-error text-sm mt-2">
            {errors.amountSats}
          </p>
        )}
      </div>

      {/* Publish to Archive */}
      <div className="mb-8">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.publishToArchive}
            onChange={(e) =>
              handleInputChange("publishToArchive", e.target.checked)
            }
            className="
              mt-1 w-5 h-5 rounded border-border-default
              text-brand-gold focus:ring-brand-gold focus:ring-2
              bg-surface-black cursor-pointer
            "
            disabled={isSubmitting}
          />
          <div>
            <span className="text-sm font-medium text-text-secondary">
              Allow answer to be published in public archive (anonymously)
            </span>
            <p className="text-xs text-text-muted mt-1">
              Help other learners by allowing your question and answer to be shared
              publicly. Your name and email will never be published.
            </p>
          </div>
        </label>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="mb-6 p-4 bg-semantic-error/10 border border-semantic-error rounded-lg">
          <p className="text-semantic-error text-sm">{submitError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full px-6 py-4 bg-brand-gold text-black font-bold rounded-lg
          hover:bg-brand-gold-hover transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
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
            Processing...
          </>
        ) : (
          <>
            <span>Submit Question & Generate Invoice</span>
            <span>⚡</span>
          </>
        )}
      </button>

      <p className="text-xs text-text-muted text-center mt-4">
        After submitting, you&apos;ll receive a Lightning invoice to complete payment.
        Your question will be processed once payment is confirmed.
      </p>
    </form>
  );
}
