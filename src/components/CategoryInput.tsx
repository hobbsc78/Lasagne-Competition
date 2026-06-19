import {
  clampScore,
  formatWeight,
  type CategoryId,
} from "@/lib/scoring";

interface CategoryInputProps {
  id: CategoryId;
  label: string;
  weight: number;
  value: number | null;
  onChange: (value: number | null) => void;
}

export function CategoryInput({
  id,
  label,
  weight,
  value,
  onChange,
}: CategoryInputProps) {
  const displayValue = value ?? 5;

  return (
    <div className="rounded-2xl border border-zinc-300 bg-zinc-200 p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <label htmlFor={id} className="block text-sm font-semibold text-zinc-900">
            {label}
          </label>
          <p className="mt-0.5 text-xs text-zinc-600">{formatWeight(weight)} of final score</p>
        </div>
        <div className="min-w-12 rounded-lg bg-zinc-900 px-2 py-1 text-center text-lg font-bold">
          <span
            className="score-value-badge"
            style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
          >
            {value !== null ? value.toFixed(1) : "—"}
          </span>
        </div>
      </div>

      <input
        id={id}
        type="range"
        min={1}
        max={10}
        step={0.1}
        value={displayValue}
        onChange={(event) => onChange(clampScore(Number(event.target.value)))}
        className="score-slider h-2 w-full cursor-pointer"
      />

      <div className="mt-2 flex justify-between text-xs text-zinc-600">
        <span>1.0</span>
        <span>10.0</span>
      </div>

      <input
        type="number"
        min={1}
        max={10}
        step={0.1}
        inputMode="decimal"
        placeholder="1.0 – 10.0"
        value={value ?? ""}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === "") {
            onChange(null);
            return;
          }
          const parsed = Number(raw);
          if (Number.isNaN(parsed)) return;
          if (parsed >= 1 && parsed <= 10) {
            onChange(clampScore(parsed));
          }
        }}
        className="mt-3 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-accent focus:ring-2 focus:ring-amber-900/50"
      />
    </div>
  );
}
