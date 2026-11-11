import { expect, test } from "@playwright/test";

// Run against a server configured with the seeded catalog; both routes below
// are absent from the six-model/six-city sample catalog.
test.skip(process.env.PHASE4_LIVE_CATALOG !== "1", "Requires the seeded PostgREST catalog");

for (const locale of ["en", "ur"] as const) {
  test(`${locale} serves seeded model and city routes`, async ({ page }) => {
    await page.goto(`/${locale}/phones/apple/iphone-x`);
    await expect(page.locator("main h1").first()).toHaveText("iPhone X");
    await page.goto(`/${locale}/gujranwala/phones`);
    await expect(page.locator("main h1").first()).toHaveText(
      locale === "ur" ? "گوجرانوالہ" : "Gujranwala",
    );
  });
}
