import type { Messages } from "next-intl";

/**
 * Namespaces that server components use exclusively. They are left out of the client provider
 * so long copy (legal pages, profiles, the dev kitchen sink) isn't serialized into every page.
 */
const SERVER_ONLY = ["Metadata", "Profile", "Shop", "DevDesign"] as const;
/** `Pages` is server-only except for the two client forms. */
const CLIENT_PAGES = ["contact", "reportStolen"] as const;
const APP_ONLY = [
  "Shell",
  "Sell",
  "Login",
  "Dashboard",
  "Messages",
  "Notifications",
  "AdminCampaigns",
  "Admin",
] as const;

export function pickClientMessages(
  messages: Messages,
  scope: "public" | "app" = "public",
): Partial<Messages> {
  const picked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(messages)) {
    if ((SERVER_ONLY as readonly string[]).includes(key)) continue;
    if (scope === "public" && (APP_ONLY as readonly string[]).includes(key)) continue;
    if (key === "Pages") {
      const pages = value as Messages["Pages"];
      picked.Pages = Object.fromEntries(CLIENT_PAGES.map((p) => [p, pages[p]]));
      continue;
    }
    picked[key] = value;
  }
  return picked as Partial<Messages>;
}
