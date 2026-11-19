/** Pakistan has a fixed UTC+05:00 offset; inputs never depend on the admin's browser timezone. */
export function toPakistanInput(iso: string): string {
  const milliseconds = Date.parse(iso);
  return Number.isFinite(milliseconds)
    ? new Date(milliseconds + 5 * 3_600_000).toISOString().slice(0, 16)
    : "";
}

export function fromPakistanInput(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const milliseconds = Date.parse(`${value}:00+05:00`);
  if (!Number.isFinite(milliseconds)) return null;
  const iso = new Date(milliseconds).toISOString();
  return toPakistanInput(iso) === value ? iso : null;
}

export function campaignDisplayState(
  campaign: { status: string; is_active: boolean; starts_at: string; ends_at: string },
  now: number,
): "archived" | "draft" | "paused" | "scheduled" | "expired" | "live" {
  if (campaign.status === "archived") return "archived";
  if (campaign.status !== "published") return "draft";
  if (!campaign.is_active) return "paused";
  if (Date.parse(campaign.starts_at) > now) return "scheduled";
  if (Date.parse(campaign.ends_at) <= now) return "expired";
  return "live";
}
