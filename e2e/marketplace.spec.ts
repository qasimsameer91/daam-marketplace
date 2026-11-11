import { expect, test } from "@playwright/test";
import en from "../messages/en.json";
import ur from "../messages/ur.json";
for (const locale of ["en", "ur"] as const) {
  const t = locale === "en" ? en.Market : ur.Market;
  test(`${locale} home and catalog routes`, async ({ page, isMobile }) => {
    await page.setViewportSize({ width: isMobile ? 360 : 1440, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of [
      "",
      "/brands",
      "/phones/apple",
      "/phones/apple/iphone-14-pro",
      "/lahore/phones",
    ]) {
      const response = await page.goto(`/${locale}${route}`);
      expect(response?.status()).toBe(200);
      // `.first()`: a route transition can momentarily mount the entering + exiting heading
      // together. The SSR HTML and settled DOM both have exactly one <main> h1.
      await expect(page.locator("main h1").first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    expect(errors).toEqual([]);
  });
  test(`${locale} URL filters, aliases, sort and reset`, async ({ page, isMobile }) => {
    await page.goto(`/${locale}/phones?q=13%20pm`);
    await expect(page.locator('[data-slot="listing-card"]')).toHaveCount(1);
    await page.getByRole("textbox", { name: t.q, exact: true }).fill("");
    await expect(page.locator('[data-slot="listing-card"]')).toHaveCount(12);
    if (isMobile) await page.getByRole("button", { name: t.filters, exact: true }).click();
    const controls = isMobile ? page.getByRole("dialog") : page.locator("aside");
    await controls.getByRole("combobox", { name: t.pta, exact: true }).selectOption("pta_approved");
    if (isMobile)
      await page
        .getByRole("dialog")
        .getByRole("button", {
          name: locale === "en" ? en.Common.close : ur.Common.close,
          exact: true,
        })
        .click();
    await expect(page).toHaveURL(/pta=pta_approved/);
    await expect(
      page.locator(
        '[data-slot="listing-card"] [data-slot="pta-badge"]:not([data-status="pta_approved"])',
      ),
    ).toHaveCount(0);
    await page.reload();
    await expect(
      page.getByRole("button", { name: t.remove.replace("{filter}", t.pta), exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: t.clear, exact: true }).click();
    await expect(page.locator('[data-slot="listing-card"]')).toHaveCount(12);
    await page.getByRole("combobox", { name: t.sort, exact: true }).selectOption("low");
    await expect(page).toHaveURL(/sort=low/);
    await page.getByRole("textbox", { name: t.q, exact: true }).fill("not-a-phone");
    await expect(page.getByRole("heading", { name: t.noResults, exact: true })).toBeVisible();
  });
}
