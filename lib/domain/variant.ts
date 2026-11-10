/** Storage label: 1024 GB → "1TB", 256 → "256GB". */
export function storageLabel(storageGb: number): string {
  return storageGb >= 1024 && storageGb % 1024 === 0 ? `${storageGb / 1024}TB` : `${storageGb}GB`;
}

/** Variant label as shown on cards: "8/256GB" (Android) or "256GB" (iPhone, no RAM). */
export function variantLabel(ramGb: number | null, storageGb: number): string {
  return ramGb ? `${ramGb}/${storageLabel(storageGb)}` : storageLabel(storageGb);
}
