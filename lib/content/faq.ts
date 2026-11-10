import type { FaqItem } from "@/components/marketplace/faq-list";

/** FAQ keys in content_blocks (`faq.<key>.q` / `faq.<key>.a`). */
export const PTA_FAQ_KEYS = ["pta_time_limit", "pta_cpid", "pta_jv", "daam_checked"] as const;
export const HELP_FAQ_KEYS = [
  "selling_free",
  "listing_review",
  "imei_private",
  "contact_number",
  ...PTA_FAQ_KEYS,
] as const;

/** Build FAQ items from content_blocks copy, skipping any key that is missing. */
export function faqItems(copy: Map<string, string>, keys: readonly string[]): FaqItem[] {
  return keys.flatMap((key) => {
    const question = copy.get(`faq.${key}.q`);
    const answer = copy.get(`faq.${key}.a`);
    return question && answer ? [{ question, answer }] : [];
  });
}
