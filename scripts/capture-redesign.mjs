import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const stage = process.argv[2] ?? "after";
const root = path.resolve("playwright-report/redesign", stage);
await mkdir(root, { recursive: true });
const browser = await chromium.launch();
const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const findings = [];
for (const width of [1440, 390]) {
  const page = await browser.newPage({
    viewport: { width, height: width === 390 ? 844 : 900 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/en`);
  const listing = await page.locator('[data-slot="listing-card"] a').first().getAttribute("href");
  const routes = [
    ["home", "/en"],
    ["browse", "/en/phones"],
    ["detail", listing],
    ["sell", "/en/sell"],
    ["login", "/en/login"],
    ["favorites", "/en/dashboard/favorites"],
    ["messages", "/en/messages"],
    ["dashboard", "/en/dashboard"],
    ["admin", "/en/admin/promotions"],
    ["guide", "/en/pta-guide"],
  ];
  for (const [name, route] of routes) {
    if (!route) continue;
    errors.length = 0;
    await page.goto(`${base}${route}`);
    await page.locator("h1").first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(root, `${name}-${width}.png`), fullPage: true });
    findings.push({
      name,
      width,
      route,
      overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      errors: [...errors],
    });
  }
  await page.close();
}
await browser.close();
await writeFile(path.join(root, "findings.json"), JSON.stringify(findings, null, 2));
console.log(JSON.stringify(findings));
