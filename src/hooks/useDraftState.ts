"use client";

import { useEffect, useState } from "react";
import {
  createInitialDraft,
  normalizeDraftState,
  STORAGE_KEY,
  type DraftState,
} from "@/lib/scoring";

export function useDraftState() {
  const [draft, setDraft] = useState<DraftState>(createInitialDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        setDraft(normalizeDraftState(parsed));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  const updateDraft = (patch: Partial<DraftState>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const resetDraft = () => {
    const fresh = createInitialDraft();
    setDraft(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  return { draft, updateDraft, resetDraft, hydrated };
}
