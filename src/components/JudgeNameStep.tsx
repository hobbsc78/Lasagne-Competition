interface JudgeNameStepProps {
  judgeName: string;
  onJudgeNameChange: (name: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function JudgeNameStep({
  judgeName,
  onJudgeNameChange,
  onContinue,
  onBack,
}: JudgeNameStepProps) {
  const trimmed = judgeName.trim();
  const canContinue = trimmed.length > 0;

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 py-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 w-fit rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
      >
        ← Back
      </button>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Welcome, Judge
        </p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Enter your name</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Your name will appear on the score summary sent to the organiser.
        </p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold">Judge name</span>
        <input
          type="text"
          value={judgeName}
          onChange={(event) => onJudgeNameChange(event.target.value)}
          placeholder="e.g. Sarah"
          autoComplete="name"
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-amber-900/50"
        />
      </label>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="mt-8 w-full rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-white shadow-lg shadow-amber-900/15 transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue to scoring
      </button>
    </section>
  );
}
