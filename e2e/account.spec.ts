import { expect, test } from "@playwright/test";
import en from "../messages/en.json";
import ur from "../messages/ur.json";

for (const locale of ["en", "ur"] as const) {
  const copy = locale === "en" ? en : ur;
  test(`${locale} account routes render at mobile and desktop widths`, async ({
    page,
    isMobile,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: isMobile ? 360 : 1440, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of [
      "/dashboard",
      "/dashboard/listings",
      "/dashboard/favorites",
      "/dashboard/settings",
      "/dashboard/verify",
      "/dashboard/shop",
      "/messages",
      "/messages/hafeez",
      "/notifications",
      "/login",
    ]) {
      const response = await page.goto(`/${locale}${path}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        path,
      ).toBe(true);
      if (isMobile && (path.startsWith("/dashboard") || path.startsWith("/messages"))) {
        const navLabel = path.startsWith("/dashboard") ? copy.Market.account : copy.Market.messages;
        await expect(
          page
            .getByRole("navigation", { name: copy.Market.mobileNav })
            .getByRole("link", { name: navLabel, exact: true }),
        ).toHaveAttribute("aria-current", "page");
      }
    }
    expect(errors).toEqual([]);
  });
  test(`${locale} sample listing and favourite actions`, async ({ page }) => {
    await page.goto(`/${locale}/dashboard/listings`);
    await page.getByRole("button", { name: copy.Dashboard.listings.markSold, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: copy.Dashboard.listings.empty.active, exact: true }),
    ).toBeVisible();
    await page
      .getByRole("tab", { name: new RegExp(`^${copy.Dashboard.listings.tabs.sold}`) })
      .click();
    await expect(page.getByRole("tabpanel").locator("article")).toHaveCount(2);
    await page
      .getByRole("tab", { name: new RegExp(`^${copy.Dashboard.listings.tabs.expired}`) })
      .click();
    await page.getByRole("button", { name: copy.Dashboard.listings.renew, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: copy.Dashboard.listings.empty.expired, exact: true }),
    ).toBeVisible();
    await page.goto(`/${locale}/dashboard/favorites`);
    await page
      .getByRole("button", { name: copy.Shell.removeFavorite, exact: true })
      .first()
      .click();
    await page.getByRole("button", { name: copy.Shell.removeFavorite, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: copy.Empty.favorites.title, exact: true }),
    ).toBeVisible();
  });
  test(`${locale} settings and mock OTP never authenticate or upload`, async ({ page }) => {
    await page.goto(`/${locale}/dashboard/settings`);
    await page
      .getByRole("textbox", { name: copy.Dashboard.settings.displayName, exact: true })
      .fill("Preview Name");
    await page.getByRole("button", { name: copy.Shell.savePreview, exact: true }).click();
    await expect(page.getByRole("status")).toHaveText(copy.Shell.localChange);
    await page
      .getByRole("navigation", { name: copy.Dashboard.nav.label, exact: true })
      .getByRole("link", { name: copy.Dashboard.nav.overview, exact: true })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Preview Name");
    await page.goto(`/${locale}/dashboard/verify`);
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    await page.getByRole("button", { name: copy.Shell.sampleVerification, exact: true }).click();
    await expect(page.getByRole("status")).toHaveText(copy.Shell.verificationPreview);
    await page.goto(`/${locale}/login`);
    const writes: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST") writes.push(r.url());
    });
    await page.getByRole("textbox", { name: copy.Login.phone, exact: true }).fill("123");
    await page.getByRole("button", { name: copy.Shell.showDemoCode, exact: true }).click();
    await expect(page.locator("main").getByRole("alert")).toHaveText(copy.Login.phoneInvalid);
    await page.getByRole("textbox", { name: copy.Login.phone, exact: true }).fill("03001234567");
    await page.getByRole("button", { name: copy.Shell.showDemoCode, exact: true }).click();
    await expect(page.getByText(copy.Shell.demoCode, { exact: true })).toBeVisible();
    await page.getByRole("textbox", { name: copy.Login.otpLabel, exact: true }).fill("123456");
    await page.getByRole("button", { name: copy.Shell.tryPreviewLogin, exact: true }).click();
    await expect(page.getByRole("status")).toHaveText(copy.Shell.loginPreviewComplete);
    expect(writes).toEqual([]);
  });
  test(`${locale} local messages, offer validation and notifications`, async ({ page }) => {
    await page.goto(`/${locale}/messages/hafeez`);
    const writes: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST") writes.push(r.url());
    });
    await page
      .getByRole("textbox", { name: copy.Messages.composer, exact: true })
      .fill("Please send token money");
    await expect(page.locator("main").getByRole("alert")).toHaveText(copy.Messages.scamBody);
    await page.getByRole("button", { name: copy.Messages.send, exact: true }).click();
    await expect(page.getByRole("log")).toContainText("Please send token money");
    await expect(page.getByText(copy.Shell.messageLocal, { exact: true })).toBeVisible();
    await page.getByRole("button", { name: copy.Messages.makeOffer, exact: true }).click();
    await page.getByRole("textbox", { name: copy.Shell.offerAmount, exact: true }).fill("bad");
    await page.getByRole("button", { name: copy.Shell.addOffer, exact: true }).click();
    await expect(page.locator("main").getByRole("alert")).toHaveText(copy.Shell.offerInvalid);
    await page.getByRole("textbox", { name: copy.Shell.offerAmount, exact: true }).fill("180000");
    await page.getByRole("button", { name: copy.Shell.addOffer, exact: true }).click();
    await expect(page.getByRole("log")).toContainText("Rs 180,000");
    await page.getByRole("button", { name: copy.Messages.block, exact: true }).click();
    await expect(
      page.getByRole("textbox", { name: copy.Messages.composer, exact: true }),
    ).toHaveCount(0);
    await page.goto(`/${locale}/notifications`);
    await page.getByRole("button", { name: copy.Notifications.markAll, exact: true }).click();
    await expect(page.getByRole("status")).toContainText(copy.Notifications.empty);
    expect(writes).toEqual([]);
  });
}
