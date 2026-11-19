import { z } from "zod";

export const CAMPAIGN_PLACEMENTS = [
  "home_hero",
  "below_hero",
  "featured_category",
  "mid_page",
  "listing_page",
  "seasonal",
] as const;

/** Only internal paths or HTTPS URLs; reject protocol-relative and escaped paths. */
export function isSafeCampaignUrl(value: string): boolean {
  if (!value || value.length > 2048 || /[\s<>\\]/.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

const optionalImage = z
  .string()
  .max(2048)
  .refine((value) => !value || isSafeCampaignUrl(value));
const dateTime = z.string().refine((value) => Number.isFinite(Date.parse(value)));

export const campaignSchema = z
  .object({
    id: z.string().uuid().optional(),
    title_en: z.string().trim().min(1).max(100),
    title_ur: z.string().trim().min(1).max(150),
    subtitle_en: z.string().trim().max(120),
    subtitle_ur: z.string().trim().max(180),
    description_en: z.string().trim().max(400),
    description_ur: z.string().trim().max(600),
    desktop_image_url: optionalImage,
    mobile_image_url: optionalImage,
    cta_en: z.string().trim().min(1).max(60),
    cta_ur: z.string().trim().min(1).max(90),
    cta_url: z.string().refine(isSafeCampaignUrl),
    theme: z.enum(["dark", "light", "lime", "sand", "pearl"]),
    placement: z.enum(CAMPAIGN_PLACEMENTS),
    starts_at: dateTime,
    ends_at: dateTime,
    priority: z.number().int().min(-100).max(100),
    status: z.enum(["draft", "published", "archived"]),
    is_active: z.boolean(),
  })
  .strict()
  .refine((value) => Date.parse(value.ends_at) > Date.parse(value.starts_at));

export type CampaignInput = z.infer<typeof campaignSchema>;
