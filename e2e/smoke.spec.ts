import { expect, test } from "@playwright/test";

test("redirects / to the default locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test("English home renders left-to-right", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Sahi phone.");
});

test("Urdu home renders right-to-left", async ({ page }) => {
  await page.goto("/ur");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "ur");
});

for (const locale of ["en", "ur"]) {
  test(`${locale} restores saved dark theme before page interaction`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("daam-theme", "dark"));
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(errors).toEqual([]);
  });
}
