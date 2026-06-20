"use client";

import { useEffect, useState } from "react";
import { createInitialDraft, type DraftState } from "@/lib/scoring";

const LEGACY_STORAGE_KEY = "lasagne-competition-draft";

export function useDraftState() {
  const [draft, setDraft] = useState<DraftState>(createInitialDraft);

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore if storage is unavailable.
    }
  }, []);

  const updateDraft = (patch: Partial<DraftState>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const resetDraft = () => {
    setDraft(createInitialDraft());
  };

  return { draft, updateDraft, resetDraft };
}
