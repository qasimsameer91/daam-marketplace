import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

/** Browser emulation only; never substitutes for physical-device approval. */
export default defineConfig({
  ...base,
  testMatch: "mobile-review.spec.ts",
  testIgnore: [],
  workers: 1,
  // Each case captures five full-resolution touch screenshots; WebKit is slower on Windows.
  timeout: 60_000,
  projects: [
    { name: "android-360", use: { ...devices["Pixel 7"], viewport: { width: 360, height: 800 } } },
    { name: "iphone-webkit", use: { ...devices["iPhone 13"] } },
  ],
});
