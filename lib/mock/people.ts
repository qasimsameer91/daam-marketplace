/**
 * Mock sellers, shops and reviews for Phase 3 (shaped like `public_profiles`, `shops`, `reviews`
 * in plan §17). No phone numbers or CNIC data: those never reach public pages.
 * Free-text fields (bio, comments) are user content, so they are not translated.
 */

export interface MockProfile {
  username: string;
  displayName: string;
  citySlug: string;
  memberSince: string;
  ratingAvg: number;
  ratingCount: number;
  /** Typical first-reply time in minutes. */
  responseMinutes: number;
  idVerified: boolean;
  accountType: "individual" | "shop";
  shopSlug?: string;
  bio?: string;
}

export type ShopDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface MockShop {
  slug: string;
  name: string;
  ownerUsername: string;
  marketName: string;
  address: string;
  citySlug: string;
  areaName: string;
  tier: "none" | "verified" | "trusted";
  isFounding: boolean;
  ratingAvg: number;
  ratingCount: number;
  memberSince: string;
  description: string;
  /** Opening hours; days missing from the list are closed. */
  hours: { days: ShopDay[]; open: string; close: string }[];
}

export type ReviewTag = "as_described" | "on_time" | "fair_price" | "friendly";

export interface MockReview {
  id: string;
  revieweeUsername: string;
  reviewerName: string;
  rating: number;
  tags: ReviewTag[];
  comment: string;
  createdAt: string;
  direction: "buyer_to_seller" | "seller_to_buyer";
}

export const profiles: MockProfile[] = [
  {
    username: "hafeez-mobile-hub",
    displayName: "Hafeez Mobile Hub",
    citySlug: "lahore",
    memberSince: "2026-03-02T00:00:00Z",
    ratingAvg: 4.8,
    ratingCount: 126,
    responseMinutes: 12,
    idVerified: true,
    accountType: "shop",
    shopSlug: "hafeez-mobile-hub",
  },
  {
    username: "ayesha.k",
    displayName: "Ayesha K.",
    citySlug: "karachi",
    memberSince: "2026-06-18T00:00:00Z",
    ratingAvg: 4.9,
    ratingCount: 7,
    responseMinutes: 45,
    idVerified: true,
    accountType: "individual",
    bio: "Upgrading every couple of years. Phones kept in a case from day one.",
  },
  {
    username: "bilal_r",
    displayName: "Bilal R.",
    citySlug: "rawalpindi",
    memberSince: "2026-09-30T00:00:00Z",
    ratingAvg: 0,
    ratingCount: 0,
    responseMinutes: 180,
    idVerified: false,
    accountType: "individual",
  },
  {
    username: "usman.tech",
    displayName: "Usman Tech",
    citySlug: "islamabad",
    memberSince: "2026-08-11T00:00:00Z",
    ratingAvg: 4.2,
    ratingCount: 3,
    responseMinutes: 60,
    idVerified: false,
    accountType: "individual",
  },
];

export const shops: MockShop[] = [
  {
    slug: "hafeez-mobile-hub",
    name: "Hafeez Mobile Hub",
    ownerUsername: "hafeez-mobile-hub",
    marketName: "Hafeez Centre",
    address: "Shop 214, 2nd Floor, Hafeez Centre, Main Boulevard Gulberg",
    citySlug: "lahore",
    areaName: "Gulberg",
    tier: "verified",
    isFounding: true,
    ratingAvg: 4.8,
    ratingCount: 126,
    memberSince: "2026-03-02T00:00:00Z",
    description:
      "Used and box-pack iPhones and Samsungs since 2014. Every phone is IMEI-checked on 8484 in front of you before you pay.",
    hours: [
      { days: ["mon", "tue", "wed", "thu", "sat"], open: "11:00", close: "21:00" },
      { days: ["fri"], open: "15:00", close: "21:00" },
    ],
  },
  {
    slug: "gadget-point-karachi",
    name: "Gadget Point",
    ownerUsername: "gadget-point-karachi",
    marketName: "Saddar Mobile Market",
    address: "Shop 48, Electronics Plaza, Saddar",
    citySlug: "karachi",
    areaName: "Saddar",
    tier: "trusted",
    isFounding: true,
    ratingAvg: 4.9,
    ratingCount: 203,
    memberSince: "2026-02-14T00:00:00Z",
    description:
      "Trusted since 2011 for box-pack and certified pre-owned iPhones and Samsungs. Every device IMEI-checked and battery-tested in front of you.",
    hours: [{ days: ["mon", "tue", "wed", "thu", "fri", "sat"], open: "12:00", close: "22:00" }],
  },
  {
    slug: "smart-cell-islamabad",
    name: "Smart Cell",
    ownerUsername: "smart-cell-islamabad",
    marketName: "Blue Area",
    address: "Office 7, Ground Floor, Jinnah Super",
    citySlug: "islamabad",
    areaName: "F-7",
    tier: "verified",
    isFounding: false,
    ratingAvg: 4.6,
    ratingCount: 58,
    memberSince: "2026-05-20T00:00:00Z",
    description: "PTA-approved phones with shop warranty. We only list what we can verify on 8484.",
    hours: [{ days: ["mon", "tue", "wed", "thu", "fri", "sat"], open: "11:00", close: "20:00" }],
  },
  {
    slug: "mobile-world-rawalpindi",
    name: "Mobile World",
    ownerUsername: "mobile-world-rawalpindi",
    marketName: "Saddar",
    address: "Shop 12, Bank Road",
    citySlug: "rawalpindi",
    areaName: "Saddar",
    tier: "verified",
    isFounding: false,
    ratingAvg: 4.3,
    ratingCount: 31,
    memberSince: "2026-07-09T00:00:00Z",
    description: "Used and new phones at fair daam. Clear condition grading on every listing.",
    hours: [
      { days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], open: "11:00", close: "21:00" },
    ],
  },
  {
    slug: "digital-hub-faisalabad",
    name: "Digital Hub",
    ownerUsername: "digital-hub-faisalabad",
    marketName: "Kotwali Road",
    address: "Shop 5, Rex Centre",
    citySlug: "faisalabad",
    areaName: "Kotwali Road",
    tier: "none",
    isFounding: false,
    ratingAvg: 0,
    ratingCount: 0,
    memberSince: "2026-10-25T00:00:00Z",
    description: "New shop on Daam. Budget and mid-range phones for everyday use.",
    hours: [{ days: ["mon", "tue", "wed", "thu", "fri", "sat"], open: "12:00", close: "21:00" }],
  },
];

export const reviews: MockReview[] = [
  {
    id: "r1",
    revieweeUsername: "hafeez-mobile-hub",
    reviewerName: "Hamza S.",
    rating: 5,
    tags: ["as_described", "fair_price"],
    comment: "Checked the IMEI with me on 8484 before I paid. Battery was exactly as listed.",
    createdAt: "2026-10-28T10:00:00Z",
    direction: "buyer_to_seller",
  },
  {
    id: "r2",
    revieweeUsername: "hafeez-mobile-hub",
    reviewerName: "Sana M.",
    rating: 4,
    tags: ["on_time"],
    comment: "Good phone, shop was busy so I waited a bit.",
    createdAt: "2026-10-12T15:30:00Z",
    direction: "buyer_to_seller",
  },
  {
    id: "r3",
    revieweeUsername: "ayesha.k",
    reviewerName: "Faraz A.",
    rating: 5,
    tags: ["as_described", "friendly", "on_time"],
    comment: "Met at Dolmen Mall as agreed. Phone looked brand new.",
    createdAt: "2026-09-02T18:00:00Z",
    direction: "buyer_to_seller",
  },
];

export function findProfile(username: string): MockProfile | undefined {
  return profiles.find((p) => p.username === username);
}

export function findShop(slug: string): MockShop | undefined {
  return shops.find((s) => s.slug === slug);
}

export function reviewsFor(username: string): MockReview[] {
  return reviews.filter((r) => r.revieweeUsername === username);
}
