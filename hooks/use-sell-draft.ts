"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { UseFormReturn } from "react-hook-form";
import { emptyListingDraft, restoreDraftValues, type ListingInput } from "@/lib/validation/listing";

const KEY = "daam-sell-draft-v1";
/** Never written to localStorage: blob URLs die on reload, and IMEIs stay out of browser storage. */
const NOT_SAVED = ["photos", "imei1", "imei2"] as const;

interface SavedDraft {
  values: Partial<ListingInput>;
  step: number;
  savedAt: string;
}

/**
 * The draft as it was when the wizard opened. Read once per visit so our own autosaves don't
 * look like a new draft to restore; reset when the wizard closes or the draft is cleared.
 */
let openingDraft: string | null | undefined;
const noSubscribe = () => () => {};
function readOpeningDraft(): string | null {
  if (openingDraft === undefined) {
    try {
      openingDraft = localStorage.getItem(KEY);
    } catch {
      openingDraft = null;
    }
  }
  return openingDraft;
}

function parse(raw: string | null): SavedDraft | null {
  if (!raw) return null;
  try {
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return null;
    const record = saved as Record<string, unknown>;
    const values = restoreDraftValues(record.values);
    if (
      !values ||
      !Object.keys(values).length ||
      typeof record.step !== "number" ||
      !Number.isInteger(record.step) ||
      record.step < 0 ||
      record.step > 5 ||
      typeof record.savedAt !== "string" ||
      !Number.isFinite(Date.parse(record.savedAt))
    )
      return null;
    return { values, step: record.step, savedAt: record.savedAt };
  } catch {
    return null;
  }
}

function strip(values: Record<string, unknown>) {
  const copy = { ...values };
  for (const k of NOT_SAVED) delete copy[k];
  return copy;
}

/**
 * Temporary local autosave for the sell wizard (Phase 3). Phase 6 replaces it with a server-side
 * draft row saved by a server action after every screen.
 */
export function useSellDraft(
  form: UseFormReturn<ListingInput>,
  step: number,
  setStep: (n: number) => void,
) {
  // Server snapshot is null: the server always renders a fresh first screen.
  const opening = useSyncExternalStore(noSubscribe, readOpeningDraft, () => null);
  const [cleared, setCleared] = useState(false);
  const stepRef = useRef(step);
  const restoredOnce = useRef(false);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Restore once, after hydration.
  useEffect(() => {
    const saved = parse(opening);
    if (!saved || restoredOnce.current) return;
    restoredOnce.current = true;
    form.reset({ ...emptyListingDraft(), ...saved.values, photos: [], imei1: "", imei2: "" });
    if (typeof saved.step === "number" && saved.step > 0) setStep(Math.min(saved.step, 5));
  }, [opening, form, setStep]);

  useEffect(
    () => () => {
      openingDraft = undefined;
    },
    [],
  );

  const write = useCallback(() => {
    const values = strip(form.getValues() as Record<string, unknown>);
    // Don't create a "draft" the seller never started.
    const empty = strip(emptyListingDraft() as Record<string, unknown>);
    const untouched = Object.entries(values).every(
      ([k, v]) => v === undefined || JSON.stringify(v) === JSON.stringify(empty[k]),
    );
    if (untouched && stepRef.current === 0) return;
    const entry: SavedDraft = {
      values: values as Partial<ListingInput>,
      step: stepRef.current,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(entry));
    } catch {
      // Storage full or blocked: autosave is best-effort.
    }
  }, [form]);

  // Debounced save on every change, and on every step change.
  useEffect(() => {
    let timer: number | undefined;
    const sub = form.watch(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(write, 400);
    });
    return () => {
      window.clearTimeout(timer);
      sub.unsubscribe();
    };
  }, [form, write]);
  useEffect(() => {
    // Skip the very first render so an untouched restore doesn't overwrite the saved step.
    if (opening && !restoredOnce.current) return;
    write();
  }, [step, write, opening]);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    openingDraft = null;
    setCleared(true);
  }, []);

  return { restored: !!parse(opening) && !cleared, clear };
}
