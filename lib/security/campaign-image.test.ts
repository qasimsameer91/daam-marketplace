// @vitest-environment node
import { it, expect } from "vitest";
import sharp from "sharp";
import { encodeCampaignImage } from "./campaign-image";

it("re-encodes campaign images, removes metadata and bounds dimensions", async () => {
  const original = await sharp({
    create: { width: 3000, height: 600, channels: 3, background: "white" },
  })
    .jpeg()
    .withMetadata({ exif: { IFD0: { Copyright: "Private test metadata" } } })
    .toBuffer();
  const result = await encodeCampaignImage(original, "image/jpeg");
  const metadata = await sharp(result.bytes).metadata();
  expect(metadata.format).toBe("webp");
  expect(metadata.exif).toBeUndefined();
  expect(result.width).toBe(2400);
});
it("rejects SVG, mislabeled bytes and invalid images", async () => {
  const png = await sharp({ create: { width: 400, height: 200, channels: 3, background: "white" } })
    .png()
    .toBuffer();
  await expect(encodeCampaignImage(png, "image/jpeg")).rejects.toThrow();
  await expect(encodeCampaignImage(Buffer.from("<svg/>"), "image/svg+xml")).rejects.toThrow();
  await expect(encodeCampaignImage(Buffer.from("bad"), "image/png")).rejects.toThrow();
});
