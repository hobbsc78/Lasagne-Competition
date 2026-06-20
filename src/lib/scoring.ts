export const ORGANISER_EMAIL = "hobbsc78@gmail.com";
export const AUDIO_PATH = "/audio/thats-amore-1.mp3";
export const STORAGE_KEY = "lasagne-competition-draft";

export const CATEGORIES = [
  {
    id: "appearance",
    label: "Appearance",
    weight: 0.1,
    group: "technical" as const,
  },
  {
    id: "flavour",
    label: "Flavour",
    weight: 0.25,
    group: "technical" as const,
  },
  {
    id: "texture",
    label: "Texture",
    weight: 0.05,
    group: "technical" as const,
  },
  {
    id: "balance",
    label: "Balance & Ratios",
    weight: 0.05,
    group: "technical" as const,
  },
  {
    id: "structural",
    label: "Structural Integrity",
    weight: 0.05,
    group: "technical" as const,
  },
  {
    id: "experience",
    label: "Overall Eating Experience",
    weight: 0.5,
    group: "experience" as const,
  },
] as const;

export const HONOURABLE_MENTIONS = [
  {
    id: "cheesePull",
    label: "Best cheese pull",
  },
  {
    id: "instaWorthy",
    label: "Most Insta worthy",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export type HonourableMentionId = (typeof HONOURABLE_MENTIONS)[number]["id"];
export type ContestantId = "A" | "B";

export type Scores = Record<CategoryId, number | null>;

export type ContestantScores = Record<ContestantId, Scores>;

export type HonourableMentions = Record<HonourableMentionId, ContestantId | null>;

export type AppStep =
  | "landing"
  | "judge"
  | "scoring"
  | "honourable"
  | "review"
  | "thanks";

export interface DraftState {
  step: AppStep;
  judgeName: string;
  activeContestant: ContestantId;
  scores: ContestantScores;
  honourableMentions: HonourableMentions;
}

export function createEmptyScores(): Scores {
  return {
    appearance: null,
    flavour: null,
    texture: null,
    balance: null,
    structural: null,
    experience: null,
  };
}

export function createEmptyHonourableMentions(): HonourableMentions {
  return {
    cheesePull: null,
    instaWorthy: null,
  };
}

export function createInitialDraft(): DraftState {
  return {
    step: "landing",
    judgeName: "",
    activeContestant: "A",
    scores: {
      A: createEmptyScores(),
      B: createEmptyScores(),
    },
    honourableMentions: createEmptyHonourableMentions(),
  };
}

export function formatWeight(weight: number): string {
  return `${Math.round(weight * 100)}%`;
}

export function weightedContribution(score: number, weight: number): number {
  return score * weight * 10;
}

export function calculateTotal(scores: Scores): number | null {
  if (!isContestantComplete(scores)) return null;

  const total = CATEGORIES.reduce((sum, category) => {
    const score = scores[category.id];
    return sum + weightedContribution(score!, category.weight);
  }, 0);

  return Math.round(total * 10) / 10;
}

export function isContestantComplete(scores: Scores): boolean {
  return CATEGORIES.every((category) => isValidScore(scores[category.id]));
}

export function countCompletedCategories(scores: Scores): number {
  return CATEGORIES.filter((category) => isValidScore(scores[category.id]))
    .length;
}

export function isValidScore(value: number | null): value is number {
  if (value === null || Number.isNaN(value)) return false;
  if (value < 1 || value > 10) return false;
  return Math.round(value * 10) === value * 10;
}

export function clampScore(value: number): number {
  const clamped = Math.min(10, Math.max(1, value));
  return Math.round(clamped * 10) / 10;
}

export function parseScoreInput(raw: string): number | null {
  if (raw.trim() === "") return null;
  const value = Number(raw);
  if (Number.isNaN(value)) return null;
  if (value < 1 || value > 10) return null;
  if (Math.round(value * 10) !== value * 10) return null;
  return value;
}

export function isDraftScoringComplete(draft: DraftState): boolean {
  return (
    draft.judgeName.trim().length > 0 &&
    isContestantComplete(draft.scores.A) &&
    isContestantComplete(draft.scores.B)
  );
}

export function isHonourableMentionsComplete(draft: DraftState): boolean {
  return HONOURABLE_MENTIONS.every(
    (mention) => draft.honourableMentions[mention.id] !== null,
  );
}

export function isDraftReadyForReview(draft: DraftState): boolean {
  return isDraftScoringComplete(draft) && isHonourableMentionsComplete(draft);
}

function isValidHonourableWinner(
  value: unknown,
): value is ContestantId {
  return value === "A" || value === "B";
}

function isAppStep(value: unknown): value is AppStep {
  return (
    value === "landing" ||
    value === "judge" ||
    value === "scoring" ||
    value === "honourable" ||
    value === "review" ||
    value === "thanks"
  );
}

function sanitizeScores(raw: unknown): Scores {
  const scores = createEmptyScores();
  if (!raw || typeof raw !== "object") return scores;

  for (const category of CATEGORIES) {
    const value = (raw as Scores)[category.id];
    scores[category.id] = isValidScore(value) ? value : null;
  }

  return scores;
}

function sanitizeHonourableMentions(raw: unknown): HonourableMentions {
  const mentions = createEmptyHonourableMentions();
  if (!raw || typeof raw !== "object") return mentions;

  for (const mention of HONOURABLE_MENTIONS) {
    const value = (raw as HonourableMentions)[mention.id];
    mentions[mention.id] = isValidHonourableWinner(value) ? value : null;
  }

  return mentions;
}

function resolveDraftStep(
  step: AppStep,
  draft: Omit<DraftState, "step">,
): AppStep {
  const scoringComplete = isDraftScoringComplete({
    ...draft,
    step,
  });
  const honourableComplete = isHonourableMentionsComplete({
    ...draft,
    step,
  });

  if (step === "thanks" || step === "review") {
    if (!scoringComplete) {
      return draft.judgeName.trim() ? "scoring" : "judge";
    }
    if (!honourableComplete) {
      return "honourable";
    }
  }

  if (step === "honourable" && !scoringComplete) {
    return draft.judgeName.trim() ? "scoring" : "judge";
  }

  return step;
}

export function normalizeDraftState(raw: unknown): DraftState {
  const initial = createInitialDraft();
  if (!raw || typeof raw !== "object") return initial;

  const data = raw as Partial<DraftState>;
  const judgeName = typeof data.judgeName === "string" ? data.judgeName : "";
  const activeContestant = data.activeContestant === "B" ? "B" : "A";
  const scores: ContestantScores = {
    A: sanitizeScores(data.scores?.A),
    B: sanitizeScores(data.scores?.B),
  };
  const honourableMentions = sanitizeHonourableMentions(data.honourableMentions);

  let step = isAppStep(data.step) ? data.step : initial.step;

  const draftWithoutStep: Omit<DraftState, "step"> = {
    judgeName,
    activeContestant,
    scores,
    honourableMentions,
  };

  step = resolveDraftStep(step, draftWithoutStep);

  return {
    step,
    ...draftWithoutStep,
  };
}

export function buildMailtoLink(draft: DraftState): string {
  if (!isDraftReadyForReview(draft)) {
    return `mailto:${ORGANISER_EMAIL}`;
  }

  const judgeName = draft.judgeName.trim();
  const timestamp = new Date().toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const lines: string[] = [
    "Lasagne Competition Scores",
    "",
    `Judge: ${judgeName}`,
    `Submitted: ${timestamp}`,
    "",
  ];

  for (const contestant of ["A", "B"] as const) {
    const scores = draft.scores[contestant];
    const total = calculateTotal(scores);
    if (total === null) continue;

    lines.push(`CONTESTANT ${contestant} — Total: ${total.toFixed(1)}/100`);
    lines.push("");

    for (const category of CATEGORIES) {
      const score = scores[category.id];
      if (!isValidScore(score)) continue;

      const contribution = weightedContribution(score, category.weight);
      lines.push(
        `${category.label}: ${score.toFixed(1)} (${formatWeight(category.weight)} → ${contribution.toFixed(1)} pts)`,
      );
    }

    lines.push("");
  }

  lines.push("HONOURABLE MENTIONS");
  lines.push("");

  for (const mention of HONOURABLE_MENTIONS) {
    const winner = draft.honourableMentions[mention.id];
    if (!isValidHonourableWinner(winner)) continue;

    lines.push(`${mention.label}: Contestant ${winner}`);
  }

  lines.push("");

  const subject = encodeURIComponent(`Lasagne Competition — ${judgeName}`);
  const body = encodeURIComponent(lines.join("\n"));

  return `mailto:${ORGANISER_EMAIL}?subject=${subject}&body=${body}`;
}
