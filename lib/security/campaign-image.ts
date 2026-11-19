import sharp from "sharp";

export const MAX_CAMPAIGN_IMAGE_BYTES = 4 * 1024 * 1024;
export async function encodeCampaignImage(bytes: Uint8Array, declaredType: string) {
  if (
    !bytes.byteLength ||
    bytes.byteLength > MAX_CAMPAIGN_IMAGE_BYTES ||
    !["image/jpeg", "image/png", "image/webp"].includes(declaredType)
  )
    throw new Error("Invalid image");
  const image = sharp(bytes, { limitInputPixels: 24_000_000, failOn: "warning" });
  const metadata = await image.metadata();
  const expected = { "image/jpeg": "jpeg", "image/png": "png", "image/webp": "webp" }[declaredType];
  if (
    metadata.format !== expected ||
    !metadata.width ||
    !metadata.height ||
    metadata.width < 320 ||
    metadata.height < 180 ||
    metadata.width > 8192 ||
    metadata.height > 8192 ||
    (metadata.pages ?? 1) > 1
  )
    throw new Error("Invalid image");
  // Sharp removes EXIF/GPS by default; never call withMetadata on the result.
  const result = await image
    .rotate()
    .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });
  if (result.data.byteLength > MAX_CAMPAIGN_IMAGE_BYTES) throw new Error("Image too large");
  return { bytes: result.data, width: result.info.width, height: result.info.height };
}
