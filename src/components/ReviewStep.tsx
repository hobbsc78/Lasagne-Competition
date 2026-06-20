import {
  buildMailtoLink,
  calculateTotal,
  CATEGORIES,
  HONOURABLE_MENTIONS,
  formatWeight,
  isDraftReadyForReview,
  isValidScore,
  weightedContribution,
  type DraftState,
} from "@/lib/scoring";

interface ReviewStepProps {
  draft: DraftState;
  onBack: () => void;
  onSubmit: () => void;
}

function ContestantSummary({
  contestant,
  draft,
}: {
  contestant: "A" | "B";
  draft: DraftState;
}) {
  const scores = draft.scores[contestant];
  const total = calculateTotal(scores);

  if (total === null) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">Contestant {contestant}</h2>
        <p className="text-lg font-bold text-accent-dark">{total.toFixed(1)}/100</p>
      </div>

      <ul className="space-y-2">
        {CATEGORIES.map((category) => {
          const score = scores[category.id];
          if (!isValidScore(score)) return null;

          const contribution = weightedContribution(score, category.weight);

          return (
            <li
              key={category.id}
              className="flex items-start justify-between gap-3 border-t border-zinc-800 pt-2 text-sm first:border-t-0 first:pt-0"
            >
              <div>
                <p className="font-medium">{category.label}</p>
                <p className="text-xs text-muted">{formatWeight(category.weight)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{score.toFixed(1)}</p>
                <p className="text-xs text-muted">{contribution.toFixed(1)} pts</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ReviewStep({ draft, onBack, onSubmit }: ReviewStepProps) {
  const canSubmit = isDraftReadyForReview(draft);

  return (
    <section className="mx-auto min-h-dvh w-full max-w-lg px-6 py-8 pb-28">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Review
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Confirm your scores</h1>
        <p className="mt-2 text-sm text-muted">
          Check everything below. Submitting will open your email app with a
          pre-filled message to the organiser.
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">
          Judge: {draft.judgeName.trim()}
        </p>
      </header>

      <div className="space-y-4">
        <ContestantSummary contestant="A" draft={draft} />
        <ContestantSummary contestant="B" draft={draft} />

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-foreground">
            Honourable mentions
          </h2>
          <ul className="space-y-2">
            {HONOURABLE_MENTIONS.map((mention) => {
              const winner = draft.honourableMentions[mention.id];

              return (
                <li
                  key={mention.id}
                  className="flex items-start justify-between gap-3 border-t border-zinc-800 pt-2 text-sm first:border-t-0 first:pt-0"
                >
                  <p className="font-medium">{mention.label}</p>
                  <p className="font-semibold">
                    {winner ? `Contestant ${winner}` : "—"}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-lg gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-1/3 rounded-2xl border border-border bg-card px-4 py-4 text-sm font-semibold text-foreground"
          >
            Back
          </button>
          <a
            href={canSubmit ? buildMailtoLink(draft) : undefined}
            onClick={(event) => {
              if (!canSubmit) {
                event.preventDefault();
                return;
              }
              onSubmit();
            }}
            aria-disabled={!canSubmit}
            className="flex w-2/3 items-center justify-center rounded-2xl bg-accent px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-amber-900/15 transition hover:bg-accent-dark aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            Submit via email
          </a>
        </div>
      </div>
    </section>
  );
}
