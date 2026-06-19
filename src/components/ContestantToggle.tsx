import {
  countCompletedCategories,
  type ContestantId,
  type Scores,
} from "@/lib/scoring";

interface ContestantToggleProps {
  active: ContestantId;
  scoresA: Scores;
  scoresB: Scores;
  onChange: (contestant: ContestantId) => void;
}

export function ContestantToggle({
  active,
  scoresA,
  scoresB,
  onChange,
}: ContestantToggleProps) {
  const tabs: { id: ContestantId; scores: Scores }[] = [
      { id: "A", scores: scoresA },
      { id: "B", scores: scoresB },
    ];

  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-zinc-900 p-1.5">
      {tabs.map(({ id, scores }) => {
        const completed = countCompletedCategories(scores);
        const isActive = active === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isActive
                ? "bg-zinc-700 text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            <span className="block">Contestant {id}</span>
            <span className="mt-0.5 block text-xs font-normal text-muted">
              {completed}/6 scored
            </span>
          </button>
        );
      })}
    </div>
  );
}
