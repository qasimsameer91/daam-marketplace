import { expect, test, type Page } from "@playwright/test";
import { listings } from "../lib/mock/marketplace";
import en from "../messages/en.json";
import ur from "../messages/ur.json";

const approved = listings.find(
  (l) => l.ptaStatus === "pta_approved" && l.detail.ptaCheckSource === "daam_checked",
)!;
const cpid = listings.find((l) => l.ptaStatus === "cpid_patched")!;

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

for (const locale of ["en", "ur"] as const) {
  test(`${locale} browse renders query results before JavaScript`, async ({ browser, baseURL }) => {
    const page = await browser.newPage({ javaScriptEnabled: false });
    try {
      await page.goto(
        new URL(`/${locale}/phones?q=${encodeURIComponent(cpid.modelName)}`, baseURL).href,
      );
      const cards = page.locator('[data-slot="listing-card"]');
      await expect(cards.first()).toContainText(cpid.modelName);
      await expect(cards.first().locator("img")).toHaveAttribute("loading", "eager");
      await expect(cards.first().locator('[data-slot="pta-badge"]')).toHaveAttribute(
        "data-status",
        "cpid_patched",
      );
    } finally {
      await page.close();
    }
  });

  test(`${locale} contact preview validates locally without sending a message`, async ({
    page,
  }) => {
    const copy = (locale === "en" ? en : ur).Pages.contact;
    const writes: string[] = [];
    page.on("request", (request) => {
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) writes.push(request.url());
    });
    await page.goto(`/${locale}/contact`);
    await expect(page.getByText(copy.previewNote, { exact: true })).toBeVisible();
    await page.getByRole("button", { name: copy.send, exact: true }).click();
    await expect(page.getByText(copy.required, { exact: true }).first()).toBeVisible();
    await page.getByLabel(copy.name, { exact: true }).fill("Preview visitor");
    await page.getByRole("combobox", { name: copy.topic, exact: true }).click();
    await page.getByRole("option", { name: copy.topics.other, exact: true }).click();
    await page.getByLabel(copy.message, { exact: true }).fill("Local preview message");
    await page.getByRole("button", { name: copy.send, exact: true }).click();
    await expect(page.getByText(copy.sent, { exact: true })).toBeVisible();
    expect(writes).toEqual([]);
  });

  test(`${locale} listing detail shows facts, masked IMEI and no phone number`, async ({
    page,
  }) => {
    await page.goto(`/${locale}${approved.href}`);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ur" ? "rtl" : "ltr");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(approved.modelName);
    await expect(page.locator('[data-slot="pta-badge"]').first()).toBeVisible();
    await expect(
      page.locator('[data-slot="pta-check-label"][data-kind="daam_checked"]'),
    ).toBeVisible();
    await expect(page.getByText(`••••${approved.detail.imeiLast4}`)).toBeVisible();
    const html = await page.content();
    expect(html).not.toMatch(/(\+92|\b0)3\d{2}[ -]?\d{7}/);
    await expectNoHorizontalOverflow(page);
  });

  test(`${locale} static pages render with a heading`, async ({ page }) => {
    for (const path of [
      "/pta-guide",
      "/safety",
      "/about",
      "/contact",
      "/help",
      "/terms",
      "/privacy",
      "/policies/listings",
      "/for-shops",
      "/report-stolen",
      "/u/ayesha.k",
      "/shop/hafeez-mobile-hub",
    ]) {
      await page.goto(`/${locale}${path}`);
      await expect(page.getByRole("heading", { level: 1 }), path).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  });
}

test("contact buttons ask a logged-out visitor to log in", async ({ page, isMobile }) => {
  await page.goto(`/en${approved.href}`);
  const scope = isMobile
    ? page.locator(".fixed").filter({ has: page.getByRole("button", { name: "Chat" }) })
    : page;
  await scope.getByRole("button", { name: "Chat" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Log in to contact the seller" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Log in with your phone" })).toHaveAttribute(
    "href",
    "/en/login",
  );
});

test("report dialog requires a reason, then confirms", async ({ page }) => {
  await page.goto(`/en${approved.href}`);
  await page.getByRole("button", { name: "Report listing" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: en.Listing.reportSubmit, exact: true }).click();
  await expect(dialog.getByText("Choose a reason")).toBeVisible();
  await dialog.getByRole("radio", { name: "Wrong PTA status" }).click();
  await dialog.getByRole("button", { name: en.Listing.reportSubmit, exact: true }).click();
  await expect(page.getByText(en.Listing.reportSent, { exact: true })).toBeVisible();
});

test("CPID listing shows the red banner and is never featured", async ({ page }) => {
  await page.goto(`/en${cpid.href}`);
  await expect(page.locator('[data-slot="cpid-banner"]')).toBeVisible();
  await expect(page.locator('[data-slot="pta-badge"]').first()).toContainText("NOT PTA approved");
  // The CPID sample asks to be featured; its card must still never show the tag.
  await page.goto(`/en/phones?q=${encodeURIComponent(cpid.modelName)}`);
  const card = page
    .locator('[data-slot="listing-card"]')
    .filter({ hasText: cpid.modelName })
    .first();
  await expect(card.locator('[data-slot="pta-badge"]')).toHaveAttribute(
    "data-status",
    "cpid_patched",
  );
  await expect(card.locator('[data-slot="featured-tag"]')).toHaveCount(0);
});

test("gallery opens full screen on desktop", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop thumbnails + viewer");
  await page.goto(`/en${approved.href}`);
  await page.getByRole("button", { name: "Open photo 1 full screen" }).last().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Next photo" }).click();
  await expect(dialog.getByText(`2/${approved.detail.imageCount}`)).toBeVisible();
});

test("report-stolen validates the IMEI with Luhn", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) writes.push(request.url());
  });
  await page.goto("/en/report-stolen");
  const imei = page.getByLabel("IMEI");
  await imei.fill("490154203237519");
  await page.getByRole("button", { name: en.Pages.reportStolen.submit, exact: true }).click();
  await expect(page.getByText("Enter a valid 15-digit IMEI")).toBeVisible();
  await imei.fill("490154203237518");
  await page.getByRole("button", { name: en.Pages.reportStolen.submit, exact: true }).click();
  await expect(page.getByText(en.Pages.reportStolen.sent, { exact: true })).toBeVisible();
  await expect(imei).toHaveValue("");
  expect(writes).toEqual([]);
  const storage = await page.evaluate(() =>
    JSON.stringify([Object.entries(localStorage), Object.entries(sessionStorage)]),
  );
  expect(storage).not.toContain("490154203237518");
});

test("unknown pages show the localized 404 inside the site shell", async ({ page }) => {
  await page.goto("/ur/this/does/not/exist");
  await expect(page.getByText("404", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "یہ صفحہ موجود نہیں" })).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
});
