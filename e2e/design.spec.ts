import { expect, test } from "@playwright/test";
import en from "../messages/en.json";
import ur from "../messages/ur.json";

for (const locale of ["en", "ur"] as const) {
  const messages = locale === "en" ? en : ur;
  test(`keyboard controls, focus and accessible names (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/dev/design`);
    const light = page.getByRole("radio", { name: messages.Theme.light, exact: true });
    await light.check();
    await light.focus();
    await page.keyboard.press(locale === "ur" ? "ArrowLeft" : "ArrowRight");
    await expect(page.getByRole("radio", { name: messages.Theme.dark, exact: true })).toBeChecked();
    await expect(
      page
        .getByRole("slider", { name: messages.DevDesign.forms.battery.replace("{value}", "85") })
        .first(),
    ).toHaveAttribute("aria-valuenow", "85");
    await expect(page.getByRole("progressbar", { name: messages.Wizard.progress })).toBeVisible();

    for (const key of ["openDialog", "openSheet", "openDrawer", "openCommand"] as const) {
      const trigger = page.getByRole("button", {
        name: messages.DevDesign.overlays[key],
        exact: true,
      });
      await trigger.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleName(/\S/);
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press("Tab");
        await expect
          .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
          .toBe(true);
      }
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    }
  });

  test(`system reduced motion is respected (${locale})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}/dev/design`);
    await expect(
      page.getByText(messages.DevDesign.motion.reducedOn, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByTestId("motion-demo").locator('[data-slot="daam-meter"]'),
    ).toHaveAttribute("data-band", "great");
  });
  test(`form, menu, model search and wizard interactions (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/dev/design`);
    const forms = messages.DevDesign.forms;
    const overlays = messages.DevDesign.overlays;
    const city = page.getByRole("combobox", { name: forms.city, exact: true }).first();
    await city.click();
    await page.getByRole("option", { name: "Karachi", exact: true }).click();
    await expect(city).toContainText("Karachi");
    const negotiable = page.getByRole("checkbox", { name: forms.negotiable, exact: true }).first();
    await negotiable.focus();
    await page.keyboard.press("Space");
    await expect(negotiable).not.toBeChecked();
    const slider = page.getByRole("slider").first();
    await slider.focus();
    await page.keyboard.press("End");
    await expect(slider).toHaveAttribute("aria-valuenow", "100");
    await page.getByRole("tab", { name: overlays.tabPending, exact: true }).click();
    await expect(page.getByRole("tabpanel")).toHaveText(overlays.tabPendingBody);
    const menu = page.getByRole("button", { name: overlays.menu, exact: true });
    await menu.click();
    await expect(page.getByRole("menuitem")).toHaveCount(4);
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await page.getByRole("button", { name: overlays.openCommand, exact: true }).click();
    const command = page.getByRole("dialog");
    await command.getByRole("combobox").fill("Galaxy");
    await expect(command.getByRole("option")).toHaveCount(1);
    await expect(command.getByRole("option")).toContainText("Galaxy S23 Ultra");
    await command.getByRole("combobox").fill("no-such-model");
    await expect(command.getByText(overlays.commandEmpty, { exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    const progress = page.getByRole("progressbar", { name: messages.Wizard.progress });
    await page.getByRole("button", { name: messages.Common.next, exact: true }).click();
    await expect(progress).toHaveAttribute("aria-valuenow", "3");
    const heart = page.locator('[data-slot="listing-card"]').first().getByRole("button");
    await heart.click();
    await expect(heart).toHaveAttribute("aria-pressed", "true");
    const states = page.getByTestId("component-states");
    await expect(states.locator('button[aria-busy="true"]')).toHaveCount(6);
    for (const control of await states
      .locator("fieldset input, fieldset textarea, fieldset button")
      .all()) {
      await expect(control).toBeDisabled();
    }
    await expect(
      states.getByRole("checkbox", { name: messages.DevDesign.states.indeterminate }),
    ).toHaveAttribute("aria-checked", "mixed");
    await expect(states.locator('[data-slot="pta-check-label"]')).toHaveAttribute(
      "data-kind",
      "seller_says",
    );
  });
  test(`design system renders and switches theme (${locale})`, async ({ page, isMobile }) => {
    await page.setViewportSize({ width: isMobile ? 360 : 1440, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${locale}/dev/design`);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ur" ? "rtl" : "ltr");
    await expect(page.locator('[data-slot="listing-card"]')).toHaveCount(4);
    await expect(
      page.locator('[data-slot="listing-card"]').last().locator('[data-slot="featured-tag"]'),
    ).toHaveCount(0);
    await page.getByRole("radio").nth(1).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("radio").first().click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("switch").first().click();
    await expect(page.locator('[data-reduced-motion="true"]').first()).toBeAttached();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
