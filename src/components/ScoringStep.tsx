import { CategoryInput } from "@/components/CategoryInput";
import { ContestantToggle } from "@/components/ContestantToggle";
import {
  CATEGORIES,
  isDraftReadyForReview,
  type CategoryId,
  type ContestantId,
  type DraftState,
  type Scores,
} from "@/lib/scoring";

interface ScoringStepProps {
  draft: DraftState;
  onContestantChange: (contestant: ContestantId) => void;
  onScoreChange: (contestant: ContestantId, scores: Scores) => void;
  onReview: () => void;
  onBack: () => void;
}

export function ScoringStep({
  draft,
  onContestantChange,
  onScoreChange,
  onReview,
  onBack,
}: ScoringStepProps) {
  const activeScores = draft.scores[draft.activeContestant];
  const technicalCategories = CATEGORIES.filter(
    (category) => category.group === "technical",
  );
  const experienceCategories = CATEGORIES.filter(
    (category) => category.group === "experience",
  );

  const updateCategory = (categoryId: CategoryId, value: number | null) => {
    const contestant = draft.activeContestant;
    onScoreChange(contestant, {
      ...draft.scores[contestant],
      [categoryId]: value,
    });
  };

  return (
    <section className="mx-auto min-h-dvh w-full max-w-lg px-6 py-8 pb-28">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 w-fit rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
      >
        ← Back
      </button>

      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Scoring
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          Judge: {draft.judgeName.trim()}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Score each category from 1.0 to 10.0. Switch
          between contestants at any time.
        </p>
      </header>

      <ContestantToggle
        active={draft.activeContestant}
        scoresA={draft.scores.A}
        scoresB={draft.scores.B}
        onChange={onContestantChange}
      />

      <div className="mt-6 space-y-4">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/80">
            Technical category (50%)
          </h2>
          <div className="space-y-3">
            {technicalCategories.map((category) => (
              <CategoryInput
                key={category.id}
                id={category.id}
                label={category.label}
                weight={category.weight}
                value={activeScores[category.id]}
                onChange={(value) => updateCategory(category.id, value)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/80">
            Overall eating experience (50%)
          </h2>
          <div className="space-y-3">
            {experienceCategories.map((category) => (
              <CategoryInput
                key={category.id}
                id={category.id}
                label={category.label}
                weight={category.weight}
                value={activeScores[category.id]}
                onChange={(value) => updateCategory(category.id, value)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
        <button
          type="button"
          onClick={onReview}
          disabled={!isDraftReadyForReview(draft)}
          className="mx-auto block w-full max-w-lg rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-white shadow-lg shadow-amber-900/15 transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review scores
        </button>
      </div>
    </section>
  );
}
