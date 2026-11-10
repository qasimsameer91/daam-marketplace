import { expect, test, type Page } from "@playwright/test";

// A tiny valid PNG (1×1). The wizard compresses it to WebP in the browser.
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
const VALID_IMEI = "490154203237518";

async function next(page: Page) {
  await page.getByRole("button", { name: /^(Next|Preview listing)$/ }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/en");
  await page.evaluate(() => localStorage.clear());
});

test("a seller can complete the wizard end to end", async ({ page }) => {
  await page.goto("/en/sell");

  // 1. Your phone: alias search
  await page.getByLabel("Search for your model").fill("13 pm");
  await page.getByRole("button", { name: /iPhone 13 Pro Max/ }).click();
  await page.getByRole("radio", { name: "256GB" }).check();
  await next(page);

  // 2. PTA & network
  await expect(page.getByRole("heading", { name: "PTA & network" })).toBeVisible();
  await page.getByRole("radio", { name: /PTA Approved/ }).check();
  await page.getByRole("radio", { name: /Factory Unlocked/ }).check();
  await page.getByLabel("IMEI 1").fill("490154203237519");
  await next(page);
  await expect(page.getByText("Enter a valid 15-digit IMEI")).toBeVisible();
  await page.getByLabel("IMEI 1").fill(VALID_IMEI);
  await next(page);

  // 3. Condition: battery is required for a used iPhone
  await page.getByRole("radio", { name: /9\/10/ }).check();
  await page.getByRole("radio", { name: "Flawless" }).first().check();
  await page.getByRole("radio", { name: "Minor marks" }).check();
  await next(page);
  await expect(page.getByText("Battery health is required for used iPhones")).toBeVisible();
  await page.getByLabel(/Battery health/).fill("88");
  await next(page);

  // 4. Box & extras
  await page.getByRole("radio", { name: "Box with matching IMEI" }).check();
  await next(page);

  // 5. Photos: 3 minimum, compressed locally
  await next(page);
  await expect(page.getByText("Add at least 3 photos").first()).toBeVisible();
  await page
    .locator('input[type="file"]')
    .setInputFiles(
      [1, 2, 3].map((n) => ({ name: `phone-${n}.png`, mimeType: "image/png", buffer: PNG })),
    );
  await expect(page.getByText("3 of 10 photos")).toBeVisible();
  await expect(page.getByText("Cover", { exact: true })).toBeVisible();
  await next(page);

  // 6. Price & location with a live Daam Meter
  await page.getByLabel("Price (Rs)").fill("1.85 lac");
  await expect(page.getByText("Rs 185,000").first()).toBeVisible();
  await expect(page.locator('[data-slot="daam-meter"]')).toBeVisible();
  await page.getByRole("combobox", { name: "City" }).click();
  await page.getByRole("option", { name: "Lahore" }).click();
  await next(page);

  // Preview → publish
  await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();
  await expect(page.locator('[data-slot="listing-card"]')).toContainText(
    "iPhone 13 Pro Max · 256GB",
  );
  await page.getByRole("button", { name: "Finish preview" }).click();
  await expect(page.getByRole("heading", { name: "Preview complete" })).toBeVisible();
  await expect(page.getByText("PREVIEW", { exact: true })).toBeVisible();
});

test("validation errors are translated in Urdu", async ({ page }) => {
  await page.goto("/ur/sell");
  await page.getByRole("button", { name: "آگے" }).click();
  await expect(page.getByText("برانڈ منتخب کریں")).toBeVisible();
});

test("JV is offered only for non-approved iPhones", async ({ page }) => {
  await page.goto("/en/sell");
  await page.getByLabel("Search for your model").fill("s23u");
  await page.getByRole("button", { name: /Galaxy S23 Ultra/ }).click();
  await page.getByRole("radio", { name: /12\/256GB/ }).check();
  await next(page);
  await page.getByRole("radio", { name: /Non-PTA/ }).check();
  await expect(page.getByRole("radio", { name: /JV/ })).toHaveCount(0);
});

test("the draft is restored after a reload (without IMEI)", async ({ page }) => {
  await page.goto("/en/sell");
  await page.getByLabel("Search for your model").fill("note 13");
  await page
    .getByRole("button", { name: /Redmi Note 13/ })
    .first()
    .click();
  await page.getByRole("radio", { name: "6/128GB" }).check();
  await next(page);
  await page.getByLabel("IMEI 1").fill(VALID_IMEI);
  await page.waitForTimeout(600);
  await page.reload();
  await expect(page.getByText("We restored your draft from this device.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "PTA & network" })).toBeVisible();
  await expect(page.getByLabel("IMEI 1")).toHaveValue("");
  const stored = await page.evaluate(() => localStorage.getItem("daam-sell-draft-v1") ?? "");
  expect(stored).not.toContain(VALID_IMEI);
  const saved = JSON.parse(stored);
  expect(saved.values).not.toHaveProperty("imei1");
  expect(saved.values).not.toHaveProperty("imei2");
  expect(saved.values).not.toHaveProperty("photos");
});

test("an untouched wizard does not create a draft", async ({ page }) => {
  await page.goto("/en/sell");
  await expect(page.getByRole("heading", { name: "Your phone", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("We restored your draft from this device.")).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("daam-sell-draft-v1"))).toBeNull();
});

test("malformed stored draft fields cannot break the wizard", async ({ page }) => {
  await page.evaluate(() =>
    localStorage.setItem(
      "daam-sell-draft-v1",
      JSON.stringify({
        values: {
          brandSlug: "apple",
          modelSlug: "iphone-13-pro-max",
          repairs: "broken",
          imei1: "490154203237518",
          photos: [{ id: "old", url: "blob:expired" }],
        },
        step: 0,
        savedAt: "2026-11-10T12:00:00Z",
      }),
    ),
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/en/sell");
  await expect(page.getByText("We restored your draft from this device.")).toBeVisible();
  await expect(page.getByText("iPhone 13 Pro Max", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Start over", exact: true }).click();
  await expect(page.getByLabel("Search for your model")).toBeVisible();
  expect(errors).toEqual([]);
});
