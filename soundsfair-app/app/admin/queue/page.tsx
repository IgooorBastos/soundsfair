"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  user_email: string;
  user_name?: string;
  category: string;
  question_text: string;
  pricing_tier: string;
  amount_sats: number;
  status: string;
  created_at: string;
}

export default function AdminQueuePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/admin/questions?status=in_queue");
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error(data.error);
      }

      setQuestions(data.questions);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !responseText.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/questions/${selectedQuestion.id}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseText }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error);
      }

      alert("Answer submitted successfully!");
      setSelectedQuestion(null);
      setResponseText("");
      fetchQuestions();
    } catch (error) {
      alert(`Failed to submit answer: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-surface-charcoal border-b border-border-gold">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-gold">soundsfair Admin</h1>
          <button onClick={handleLogout} className="px-4 py-2 text-text-secondary hover:text-text-primary">
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Question Queue</h2>
          <p className="text-text-tertiary">{questions.length} paid questions waiting for response</p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-surface-charcoal border border-border-default rounded-card p-8 text-center">
            <p className="text-text-secondary">No questions in queue</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {questions.map((q) => (
              <div key={q.id} className="bg-surface-charcoal border border-border-default rounded-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-brand-gold/10 border border-brand-gold rounded-full text-brand-gold text-xs font-semibold mb-2">
                      {q.category}
                    </span>
                    <p className="text-sm text-text-tertiary">{q.user_email} • {q.amount_sats} sats</p>
                  </div>
                  <button
                    onClick={() => setSelectedQuestion(q)}
                    className="px-4 py-2 bg-brand-gold text-black font-semibold rounded-lg hover:bg-brand-gold-hover"
                  >
                    Answer
                  </button>
                </div>
                <p className="text-text-primary">{q.question_text}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-charcoal border border-border-gold rounded-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Answer Question</h3>

            <div className="mb-4 p-4 bg-surface-black border border-border-default rounded-lg">
              <p className="text-sm text-text-tertiary mb-2">{selectedQuestion.user_email}</p>
              <p className="text-text-primary">{selectedQuestion.question_text}</p>
            </div>

            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-surface-black border border-border-default rounded-lg text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold mb-4"
              placeholder="Write your detailed answer here..."
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmitAnswer}
                disabled={!responseText.trim() || submitting}
                className="flex-1 px-6 py-3 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold-hover disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Answer"}
              </button>
              <button
                onClick={() => {
                  setSelectedQuestion(null);
                  setResponseText("");
                }}
                className="px-6 py-3 bg-surface-black border border-border-default text-text-primary rounded-lg hover:border-border-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
