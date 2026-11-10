/** Sample data for the /dev/design kitchen sink. Shapes match the Section 17 schema. */
import type { ListingCardData } from "@/components/daam/listing-card";

/** Fixed reference time so relative dates ("2 hours ago") are deterministic on the design page. */
export const DESIGN_NOW = new Date("2026-11-10T12:00:00Z");

const hoursAgo = (h: number) => new Date(DESIGN_NOW.getTime() - h * 3_600_000).toISOString();

export const sampleListings: ListingCardData[] = [
  {
    id: "1",
    href: "/listing/iphone-14-pro-256gb-a1b2c3d4",
    modelName: "iPhone 14 Pro",
    variantLabel: "256GB",
    pricePkr: 189_000,
    daamBand: "great",
    ptaStatus: "pta_approved",
    networkLock: "factory_unlocked",
    condition: "grade_9",
    batteryHealth: 88,
    city: "Lahore",
    area: "Gulberg",
    publishedAt: hoursAgo(2),
    imageUrl: null,
    isFeatured: true,
    verification: "shop",
  },
  {
    id: "2",
    href: "/listing/galaxy-s23-ultra-256gb-e5f6g7h8",
    modelName: "Galaxy S23 Ultra",
    variantLabel: "12/256GB",
    pricePkr: 214_500,
    daamBand: "fair",
    ptaStatus: "non_pta",
    networkLock: "factory_unlocked",
    condition: "like_new",
    batteryHealth: null,
    city: "Karachi",
    area: "Clifton",
    publishedAt: hoursAgo(26),
    imageUrl: null,
    isFeatured: false,
    verification: "id",
    isFavorited: true,
  },
  {
    id: "3",
    href: "/listing/iphone-13-pro-max-128gb-i9j0k1l2",
    modelName: "iPhone 13 Pro Max",
    variantLabel: "128GB",
    pricePkr: 132_000,
    daamBand: "high",
    ptaStatus: "non_pta",
    networkLock: "jv",
    condition: "grade_8",
    batteryHealth: 79,
    city: "Rawalpindi",
    area: null,
    publishedAt: hoursAgo(72),
    imageUrl: null,
    isFeatured: false,
    verification: null,
  },
  {
    id: "4",
    href: "/listing/redmi-note-13-8-256gb-m3n4o5p6",
    modelName: "Redmi Note 13",
    variantLabel: "8/256GB",
    pricePkr: 48_500,
    daamBand: "unknown",
    ptaStatus: "cpid_patched",
    networkLock: "unknown",
    condition: "used",
    batteryHealth: null,
    city: "Islamabad",
    area: "G-9",
    publishedAt: hoursAgo(0.25),
    imageUrl: null,
    // Featured is requested but CPID can never be promoted: the card must not show the tag.
    isFeatured: true,
    verification: null,
  },
];

export const sampleBrands = [
  { name: "Apple", slug: "apple", count: 1240 },
  { name: "Samsung", slug: "samsung", count: 986 },
  { name: "Google Pixel", slug: "google", count: 312 },
  { name: "Infinix", slug: "infinix", count: 455 },
  { name: "Tecno", slug: "tecno", count: 402 },
  { name: "Redmi", slug: "redmi", count: 377 },
  { name: "Vivo", slug: "vivo", count: 0 },
  { name: "Oppo", slug: "oppo", count: 1 },
];

export const sampleCities = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
];

export const sampleModels = [
  "iPhone 13 Pro Max",
  "iPhone 15 Pro",
  "Galaxy S23 Ultra",
  "Pixel 7 Pro",
  "Redmi Note 13",
];
