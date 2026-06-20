import Image from "next/image";
import {
  HONOURABLE_MENTIONS,
  isHonourableMentionsComplete,
  type ContestantId,
  type DraftState,
  type HonourableMentionId,
  type HonourableMentions,
} from "@/lib/scoring";

interface HonourableMentionsStepProps {
  draft: DraftState;
  onChange: (honourableMentions: HonourableMentions) => void;
  onBack: () => void;
  onContinue: () => void;
}

function HonourableMentionCard({
  id,
  label,
  imageSrc,
  imageAlt,
  selected,
  onSelect,
}: {
  id: HonourableMentionId;
  label: string;
  imageSrc: string;
  imageAlt: string;
  selected: ContestantId | null;
  onSelect: (winner: ContestantId) => void;
}) {
  const groupName = `honourable-${id}`;

  return (
    <div className="rounded-2xl border border-zinc-300 bg-zinc-200 p-4 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-zinc-900">{label}</p>

      <div className="flex items-center gap-4">
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-3">
          {(["A", "B"] as const).map((contestant) => {
            const inputId = `${groupName}-${contestant}`;

            return (
              <label
                key={contestant}
                htmlFor={inputId}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  selected === contestant
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 bg-white text-zinc-900"
                }`}
              >
                <input
                  id={inputId}
                  type="radio"
                  name={groupName}
                  value={contestant}
                  checked={selected === contestant}
                  onChange={() => onSelect(contestant)}
                  className="sr-only"
                />
                Contestant {contestant}
              </label>
            );
          })}
        </div>

        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </div>
    </div>
  );
}

export function HonourableMentionsStep({
  draft,
  onChange,
  onBack,
  onContinue,
}: HonourableMentionsStepProps) {
  const canContinue = isHonourableMentionsComplete(draft);

  const updateMention = (id: HonourableMentionId, winner: ContestantId) => {
    onChange({
      ...draft.honourableMentions,
      [id]: winner,
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
          Honourable mentions
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          Pick your winners
        </h1>
        <p className="mt-2 text-sm text-muted">
          These categories do not affect the scores. Select Contestant A or
          Contestant B for each honourable mention.
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">
          Judge: {draft.judgeName.trim()}
        </p>
      </header>

      <div className="space-y-4">
        {HONOURABLE_MENTIONS.map((mention) => (
          <HonourableMentionCard
            key={mention.id}
            id={mention.id}
            label={mention.label}
            imageSrc={mention.imageSrc}
            imageAlt={mention.imageAlt}
            selected={draft.honourableMentions[mention.id]}
            onSelect={(winner) => updateMention(mention.id, winner)}
          />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="mx-auto block w-full max-w-lg rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-white shadow-lg shadow-amber-900/15 transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to review
        </button>
      </div>
    </section>
  );
}
