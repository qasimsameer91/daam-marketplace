import { expect, test } from "@playwright/test";
import en from "../messages/en.json";
import ur from "../messages/ur.json";

test("the editorial hero respects reduced motion", async ({ page }) => {
  await page.goto("/en");
  await page.waitForLoadState("networkidle");
  const image = page.locator(".editorial-art-float");
  await expect(image).toBeVisible();
  await expect(image).toHaveCSS("animation-name", "editorial-float");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(image).toHaveCSS("animation-name", "none");
});

for (const locale of ["en", "ur"] as const) {
  test(`${locale} campaign administration requires a real admin session`, async ({ page }) => {
    const copy = locale === "en" ? en.AdminCampaigns : ur.AdminCampaigns;
    await page.goto(`/${locale}/admin/promotions`);
    await expect(page.getByRole("heading", { name: copy.title })).toBeVisible();
    await expect(page.getByText(copy.unavailable, { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: copy.save, exact: true })).toHaveCount(0);
  });
}

test("discovery links open their intended browse filters", async ({ page }) => {
  const links = [
    [en.Market.discoverApproved, "pta=pta_approved"],
    [en.Market.discoverNonPta, "pta=non_pta"],
    [en.Market.discoverJv, "lock=jv"],
    [en.Market.discoverCarrier, "lock=carrier_locked"],
    [en.Market.discoverBudget, "max=50000"],
    [en.Market.discoverFlagship, "min=150000"],
    [en.Market.discoverRefurbished, "condition=refurbished"],
  ] as const;
  for (const [label, query] of links) {
    await page.goto("/en");
    await page.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(query));
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  }
});
