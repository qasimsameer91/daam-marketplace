import { expect, test } from "@playwright/test";
import en from "../messages/en.json";
import ur from "../messages/ur.json";

for (const locale of ["en", "ur"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`${locale} ${theme}: touch layout and overlays`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const copy = locale === "ur" ? ur : en;
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/${locale}/dev/design`);
      await page.getByRole("radio", { name: copy.Theme[theme], exact: true }).check();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "ur" ? "rtl" : "ltr");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if (locale === "ur") {
        expect(
          await page.locator("body").evaluate((el) => getComputedStyle(el).fontFamily),
        ).toContain("Noto");
      }
      await page.screenshot({ path: testInfo.outputPath("header.png"), animations: "disabled" });
      const card = page.locator('[data-slot="listing-card"]').first();
      await card.scrollIntoViewIfNeeded();
      const save = card.getByRole("button");
      const box = await save.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
      await save.tap();
      await expect(save).toHaveAttribute("aria-pressed", "true");
      await page.screenshot({ path: testInfo.outputPath("listing.png"), animations: "disabled" });
      for (const key of ["openSheet", "openDrawer", "openDialog"] as const) {
        await page.getByRole("button", { name: copy.DevDesign.overlays[key], exact: true }).tap();
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAccessibleName(/\S/);
        await expect(dialog).toHaveCSS("opacity", "1");
        const bounds = await dialog.boundingBox();
        expect(bounds?.width).toBeLessThanOrEqual(page.viewportSize()!.width);
        await page.screenshot({ path: testInfo.outputPath(`${key}.png`), animations: "disabled" });
        await dialog.getByRole("button", { name: copy.Common.close, exact: true }).first().tap();
        await expect(dialog).toBeHidden();
      }
      expect(errors).toEqual([]);
    });
  }
}
