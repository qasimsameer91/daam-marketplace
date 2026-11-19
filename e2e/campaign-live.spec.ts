import { expect, test } from "@playwright/test";

test.skip(process.env.DAAM_CAMPAIGN_FIXTURES !== "1", "Requires isolated campaign fixtures");

for (const locale of ["en", "ur"] as const) {
  test(`${locale} displays scheduled campaigns and a localized destination`, async ({ page }) => {
    await page.goto(`/${locale}`);
    const hero = page.locator('[data-slot="campaign"][data-placement="home_hero"]:visible');
    const below = page.locator('[data-slot="campaign"][data-placement="below_hero"]:visible');
    await expect(hero).toBeVisible();
    await expect(below).toBeVisible();
    await expect(below.getByRole("heading")).toHaveText(
      locale === "ur" ? "بہتر فون کا واضح انتخاب" : "A clearer way to upgrade",
    );
    await expect(below.getByRole("link")).toHaveAttribute(
      "href",
      `/${locale}/phones?pta=pta_approved`,
    );
  });
}
