/**
 * Phase 3 mock marketplace data, shaped like the plan §17 schema (`listings` + joined catalog
 * and location names). Replaced by Supabase queries in Phases 4 and 6.
 *
 * Public shape only: no phone numbers and no full IMEI (just `imeiLast4`).
 */
import type { ListingCardData } from "@/components/daam/listing-card";
import type {
  Accessory,
  BodyCondition,
  BoxStatus,
  FunctionalIssue,
  Repair,
  ScreenCondition,
  WarrantyType,
} from "@/lib/domain/condition";
import type { PtaCheckSource, PtaRegType } from "@/lib/domain/pta";
import { DESIGN_NOW, sampleListings } from "./design-samples";

export const mockNow = DESIGN_NOW;
export const brands = [
  ["apple", "Apple"],
  ["samsung", "Samsung"],
  ["google", "Google Pixel"],
  ["oneplus", "OnePlus"],
  ["xiaomi", "Xiaomi"],
  ["redmi", "Redmi"],
  ["poco", "Poco"],
  ["oppo", "Oppo"],
  ["vivo", "Vivo"],
  ["realme", "Realme"],
  ["tecno", "Tecno"],
  ["infinix", "Infinix"],
  ["huawei", "Huawei"],
  ["motorola", "Motorola"],
  ["nokia", "Nokia"],
  ["sony", "Sony"],
  ["other", "Other"],
].map(([slug, name]) => ({ slug: slug!, name: name! }));
export const cities = [
  "lahore",
  "karachi",
  "islamabad",
  "rawalpindi",
  "faisalabad",
  "multan",
] as const;
export type MockCity = (typeof cities)[number];

export const models = [
  { slug: "iphone-14-pro", brand: "apple", name: "iPhone 14 Pro", aliases: ["14 pro"] },
  {
    slug: "iphone-13-pro-max",
    brand: "apple",
    name: "iPhone 13 Pro Max",
    aliases: ["13 pm", "13 pro max"],
  },
  {
    slug: "galaxy-s23-ultra",
    brand: "samsung",
    name: "Galaxy S23 Ultra",
    aliases: ["s23u", "s23 ultra"],
  },
  { slug: "redmi-note-13", brand: "redmi", name: "Redmi Note 13", aliases: ["note 13"] },
  { slug: "pixel-7-pro", brand: "google", name: "Pixel 7 Pro", aliases: ["p7p", "pixel 7p"] },
  { slug: "galaxy-a54", brand: "samsung", name: "Galaxy A54", aliases: ["a54"] },
];

/** Extra detail shown on the listing page (plan §7.2 specification fields). */
export interface MockListingDetail {
  description: string;
  colorName: string;
  screen: ScreenCondition;
  body: BodyCondition;
  boxStatus: BoxStatus;
  accessories: Accessory[];
  warranty: { type: WarrantyType; monthsLeft: number | null };
  repairs: Repair[];
  functionalIssues: FunctionalIssue[];
  purchaseMonth: string | null;
  imeiLast4: string;
  ptaRegType: PtaRegType | null;
  ptaCheckSource: PtaCheckSource;
  ptaCheckedAt: string | null;
  /** Daam Meter p25–p75; null when there aren't enough comparables. */
  daamRange: { low: number; high: number } | null;
  isNegotiable: boolean;
  contact: { chat: boolean; whatsapp: boolean; call: boolean };
  imageCount: number;
  viewCount: number;
}

export interface MockListing extends ListingCardData {
  slug: string;
  shortId: string;
  brand: string;
  model: string;
  citySlug: string;
  areaSlug: string;
  storage: number;
  ram: number;
  color: "black" | "silver" | "green";
  warranty: boolean;
  box: boolean;
  imeiOnFile: boolean;
  checked: boolean;
  /** Exactly one of these is set: individual seller or shop. */
  sellerUsername: string;
  shopSlug: string | null;
  detail: MockListingDetail;
}

const SELLERS = ["hafeez-mobile-hub", "ayesha.k", "bilal_r", "usman.tech"] as const;

const DETAILS: MockListingDetail[] = [
  {
    description:
      "PTA approved, official box with matching IMEI. Always used with a case and screen protector. Battery 88%, no repairs. IMEI can be checked at the shop before payment.",
    colorName: "Space Black",
    screen: "flawless",
    body: "minor_marks",
    boxStatus: "box_matching_imei",
    accessories: ["cable", "case", "original_receipt"],
    warranty: { type: "shop", monthsLeft: 1 },
    repairs: ["none"],
    functionalIssues: ["none"],
    purchaseMonth: "2023-01-01",
    imeiLast4: "4821",
    ptaRegType: "individual_tax_paid",
    ptaCheckSource: "daam_checked",
    ptaCheckedAt: "2026-11-02T09:00:00Z",
    daamRange: { low: 192_000, high: 210_000 },
    isNegotiable: true,
    contact: { chat: true, whatsapp: true, call: true },
    imageCount: 5,
    viewCount: 412,
  },
  {
    description:
      "Non-PTA, factory unlocked, bought from Dubai. Like new, no scratches. Comes with box and original cable. Works on Wi-Fi; SIM time limit applies.",
    colorName: "Phantom Black",
    screen: "flawless",
    body: "flawless",
    boxStatus: "box_matching_imei",
    accessories: ["cable"],
    warranty: { type: "none", monthsLeft: null },
    repairs: ["none"],
    functionalIssues: ["none"],
    purchaseMonth: "2024-02-01",
    imeiLast4: "0937",
    ptaRegType: null,
    ptaCheckSource: "seller_declared",
    ptaCheckedAt: null,
    daamRange: { low: 205_000, high: 225_000 },
    isNegotiable: true,
    contact: { chat: true, whatsapp: true, call: false },
    imageCount: 4,
    viewCount: 188,
  },
  {
    description:
      "JV iPhone, not PTA approved. Battery 79%, screen replaced last year. Face ID works. Selling because I bought a PTA phone.",
    colorName: "Sierra Blue",
    screen: "replaced",
    body: "visible_marks",
    boxStatus: "no_box",
    accessories: [],
    warranty: { type: "none", monthsLeft: null },
    repairs: ["screen"],
    functionalIssues: ["none"],
    purchaseMonth: null,
    imeiLast4: "5512",
    ptaRegType: null,
    ptaCheckSource: "seller_declared",
    ptaCheckedAt: null,
    daamRange: { low: 112_000, high: 124_000 },
    isNegotiable: false,
    contact: { chat: true, whatsapp: false, call: false },
    imageCount: 3,
    viewCount: 96,
  },
  {
    description:
      "Patched (CPID) phone. Heavy use, back has scratches. Speaker is a little low. Selling as is.",
    colorName: "Midnight Black",
    screen: "visible_scratches",
    body: "visible_marks",
    boxStatus: "no_box",
    accessories: ["charger"],
    warranty: { type: "none", monthsLeft: null },
    repairs: ["battery"],
    functionalIssues: ["speaker"],
    purchaseMonth: "2024-05-01",
    imeiLast4: "7710",
    ptaRegType: null,
    ptaCheckSource: "seller_declared",
    ptaCheckedAt: null,
    daamRange: null,
    isNegotiable: true,
    contact: { chat: true, whatsapp: true, call: true },
    imageCount: 2,
    viewCount: 31,
  },
];

const slugFor = (modelName: string, variantLabel: string) =>
  `${modelName} ${variantLabel}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Short ids are 8 lowercase alphanumerics (nanoid(8) in production). */
const shortIdFor = (n: number) => `d${(n * 7919 + 104729).toString(36).padStart(7, "0").slice(-7)}`;

export function listingHref(slug: string, shortId: string): string {
  return `/listing/${slug}-${shortId}`;
}

const base = sampleListings.map((listing, i): MockListing => {
  const sellerUsername = SELLERS[i % SELLERS.length]!;
  const slug = slugFor(listing.modelName, listing.variantLabel);
  const shortId = shortIdFor(i + 1);
  return {
    ...listing,
    slug,
    shortId,
    href: listingHref(slug, shortId),
    brand: ["apple", "samsung", "apple", "redmi"][i]!,
    model: ["iphone-14-pro", "galaxy-s23-ultra", "iphone-13-pro-max", "redmi-note-13"][i]!,
    citySlug: listing.city.toLowerCase(),
    areaSlug: listing.area?.toLowerCase() ?? "",
    storage: i === 2 ? 128 : 256,
    ram: i === 1 ? 12 : i === 3 ? 8 : 6,
    color: i % 2 ? "black" : "silver",
    warranty: i === 0,
    box: i < 2,
    imeiOnFile: true,
    checked: i === 0,
    imageUrl: "/phone-preview.svg",
    sellerUsername,
    shopSlug: sellerUsername === "hafeez-mobile-hub" ? "hafeez-mobile-hub" : null,
    detail: DETAILS[i]!,
  };
});

export const listings: MockListing[] = [
  ...base,
  ...Array.from({ length: 8 }, (_, i): MockListing => {
    const source = base[i % base.length]!;
    const google = i === 2 || i === 6;
    const modelName = google ? "Pixel 7 Pro" : source.modelName;
    const variantLabel = google ? "12/128GB" : source.variantLabel;
    const ptaStatus = i % 3 === 0 ? "non_pta" : "pta_approved";
    const slug = slugFor(modelName, variantLabel);
    const shortId = shortIdFor(i + 5);
    const sellerUsername = SELLERS[(i + 1) % SELLERS.length]!;
    return {
      ...source,
      id: `mock-${i + 5}`,
      slug,
      shortId,
      href: listingHref(slug, shortId),
      modelName,
      variantLabel,
      ...(google ? { brand: "google", model: "pixel-7-pro", ram: 12, storage: 128 } : {}),
      pricePkr: google ? 72000 + i * 1500 : source.pricePkr - 12000 + i * 1000,
      citySlug: cities[(i + 2) % cities.length]!,
      city: cities[(i + 2) % cities.length]!,
      area: null,
      areaSlug: "",
      ptaStatus,
      networkLock: "factory_unlocked",
      condition: i % 2 ? "grade_8" : "like_new",
      batteryHealth: source.brand === "apple" ? 84 + (i % 3) * 4 : null,
      daamBand: i % 3 === 0 ? "great" : "fair",
      isFeatured: false,
      isFavorited: false,
      checked: false,
      warranty: i % 3 === 0,
      box: i % 2 === 0,
      verification:
        sellerUsername === "hafeez-mobile-hub"
          ? "shop"
          : sellerUsername === "ayesha.k"
            ? "id"
            : null,
      sellerUsername,
      shopSlug: sellerUsername === "hafeez-mobile-hub" ? "hafeez-mobile-hub" : null,
      publishedAt: new Date(mockNow.getTime() - (i + 1) * 86400000).toISOString(),
      detail: {
        ...DETAILS[i % 2]!,
        ptaCheckSource: "seller_declared",
        ptaCheckedAt: null,
        ptaRegType: ptaStatus === "pta_approved" ? "official_import" : null,
      },
    };
  }),
];

export const areas = [...new Set(listings.map((l) => l.areaSlug).filter(Boolean))];

/** Resolve `/listing/[slug]-[shortId]`: the short id is the last dash-separated segment. */
export function findListingBySlugId(slugId: string): MockListing | undefined {
  const shortId = slugId.slice(slugId.lastIndexOf("-") + 1);
  return listings.find((l) => l.shortId === shortId);
}

/** Same model first, then same brand; never the listing itself. */
export function similarListings(listing: MockListing, limit = 4): MockListing[] {
  return listings
    .filter((l) => l.id !== listing.id)
    .sort(
      (a, b) =>
        Number(b.model === listing.model) - Number(a.model === listing.model) ||
        Number(b.brand === listing.brand) - Number(a.brand === listing.brand),
    )
    .slice(0, limit);
}

export function listingsBySeller(username: string): MockListing[] {
  return listings.filter((l) => l.sellerUsername === username);
}

export function listingsByShop(slug: string): MockListing[] {
  return listings.filter((l) => l.shopSlug === slug);
}

/**
 * Mock Daam Meter ranges by model slug for the sell wizard's live meter. Phase 7 computes real
 * p25–p75 ranges from comparables + price_references.
 */
export function mockDaamRanges(): Record<string, { low: number; high: number }> {
  const ranges: Record<string, { low: number; high: number }> = {};
  for (const l of listings) {
    if (l.detail.daamRange && !ranges[l.model]) ranges[l.model] = l.detail.daamRange;
  }
  return ranges;
}
