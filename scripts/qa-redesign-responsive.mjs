import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("playwright-report/redesign/responsive");
await mkdir(root, { recursive: true });
const browser = await chromium.launch();
const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const findings = [];
for (const width of process.argv.includes("--editor-only") ? [] : [320, 375, 768, 1024]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  await page.addInitScript(() => localStorage.setItem("daam-theme", "dark"));
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const locale of ["en", "ur"])
    for (const [name, route] of [
      ["home", ""],
      ["browse", "/phones"],
      ["sell", "/sell"],
      ["dashboard", "/dashboard"],
      ["thread", "/messages/hafeez"],
    ]) {
      errors.length = 0;
      await page.goto(`${base}/${locale}${route}`);
      await page.locator("h1").first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      await page.screenshot({
        path: path.join(root, `${name}-${locale}-${width}.png`),
        fullPage: false,
      });
      findings.push({
        name,
        locale,
        width,
        overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        theme: await page.locator("html").getAttribute("data-theme"),
        errors: [...errors],
      });
    }
  await page.close();
}
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${base}/en/dev/promotions`);
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Title · English", { exact: true }).fill("Good phones. Better deals.");
  await page.getByLabel("Title · Urdu", { exact: true }).fill("اچھے فون۔ بہتر دام۔");
  await page.getByLabel("Desktop image URL", { exact: true }).fill("/editorial/hero-pearl.webp");
  await page
    .getByLabel("Mobile image URL (optional)", { exact: true })
    .fill("/editorial/hero-cream-blue.webp");
  await page.getByLabel("Button text · English", { exact: true }).fill("Explore phones");
  if (width === 390)
    await page.getByRole("button", { name: "Mobile preview", exact: true }).click();
  await page.screenshot({ path: path.join(root, `campaign-editor-${width}.png`), fullPage: true });
  findings.push({
    name: "campaign-editor-development-only",
    width,
    overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  });
  await page.close();
}
await browser.close();
await writeFile(path.join(root, "findings.json"), JSON.stringify(findings, null, 2));
const failures = findings.filter((item) => item.overflow > 1 || item.errors?.length);
console.log(JSON.stringify({ checks: findings.length, failures }));
if (failures.length) process.exitCode = 1;
