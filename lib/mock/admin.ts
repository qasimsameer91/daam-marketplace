/**
 * Phase 3 mock data for the admin console preview. Derived from the public marketplace,
 * people and campaign mocks plus a few synthetic moderation/report rows so the admin
 * screens render without a backend. No real moderation, users or settings are affected.
 *
 * Contains no phone numbers and no full IMEI — admin rows show only public-safe fields.
 */
import { listings } from "./marketplace";
import { profiles, shops } from "./people";

export type ModerationStatus = "pending" | "approved" | "rejected" | "flagged";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type ReportReason =
  "stolen" | "counterfeit" | "wrong_pta" | "spam" | "offensive" | "price_scam";
export type UserRole = "member" | "shop" | "moderator" | "admin";
export type UserStatus = "active" | "suspended" | "banned";

export interface AdminModerationRow {
  id: string;
  href: string;
  title: string;
  variant: string;
  pricePkr: number;
  city: string;
  seller: string;
  isShop: boolean;
  ptaStatus: string;
  status: ModerationStatus;
  submittedAt: string;
  flagReason: ReportReason | null;
}

export interface AdminUserRow {
  username: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  citySlug: string;
  idVerified: boolean;
  listingsCount: number;
  ratingCount: number;
  joinedAt: string;
}

export interface AdminReportRow {
  id: string;
  reason: ReportReason;
  status: ReportStatus;
  targetTitle: string;
  targetHref: string;
  reporter: string;
  note: string;
  createdAt: string;
}

const STATUS_CYCLE: ModerationStatus[] = ["approved", "pending", "flagged", "rejected"];

export const moderationQueue: AdminModerationRow[] = listings.slice(0, 8).map((l, i) => ({
  id: l.id,
  href: l.href,
  title: l.modelName,
  variant: l.variantLabel,
  pricePkr: l.pricePkr,
  city: l.citySlug,
  seller: l.shopSlug ?? l.sellerUsername,
  isShop: Boolean(l.shopSlug),
  ptaStatus: l.ptaStatus,
  status: STATUS_CYCLE[i % STATUS_CYCLE.length]!,
  submittedAt: l.publishedAt,
  flagReason:
    STATUS_CYCLE[i % STATUS_CYCLE.length] === "flagged"
      ? l.ptaStatus === "cpid_patched"
        ? "wrong_pta"
        : "price_scam"
      : null,
}));

const ROLE_FOR = (accountType: string, i: number): UserRole =>
  i === 0 ? "admin" : i === 1 ? "moderator" : accountType === "shop" ? "shop" : "member";

export const adminUsers: AdminUserRow[] = profiles.map((p, i) => ({
  username: p.username,
  displayName: p.displayName,
  role: ROLE_FOR(p.accountType, i),
  status: i === 3 ? "suspended" : "active",
  citySlug: p.citySlug,
  idVerified: p.idVerified,
  listingsCount: listings.filter(
    (l) => l.sellerUsername === p.username || l.shopSlug === p.shopSlug,
  ).length,
  ratingCount: p.ratingCount,
  joinedAt: p.memberSince,
}));

export const adminReports: AdminReportRow[] = [
  {
    id: "rep_1",
    reason: "wrong_pta",
    status: "open",
    targetTitle: moderationQueue[3]?.title ?? "Redmi Note 13",
    targetHref: moderationQueue[3]?.href ?? "/phones",
    reporter: "member",
    note: "Listed as PTA approved but the IMEI looks patched (CPID).",
    createdAt: "2026-11-11T08:20:00Z",
  },
  {
    id: "rep_2",
    reason: "stolen",
    status: "reviewing",
    targetTitle: moderationQueue[1]?.title ?? "Galaxy S23 Ultra",
    targetHref: moderationQueue[1]?.href ?? "/phones",
    reporter: "member",
    note: "I think this is my stolen phone — IMEI last 4 match my FIR.",
    createdAt: "2026-11-10T19:05:00Z",
  },
  {
    id: "rep_3",
    reason: "price_scam",
    status: "open",
    targetTitle: moderationQueue[6]?.title ?? "iPhone 13 Pro Max",
    targetHref: moderationQueue[6]?.href ?? "/phones",
    reporter: "member",
    note: "Seller asked for advance payment before meeting.",
    createdAt: "2026-11-09T12:40:00Z",
  },
  {
    id: "rep_4",
    reason: "counterfeit",
    status: "resolved",
    targetTitle: moderationQueue[2]?.title ?? "iPhone 14 Pro",
    targetHref: moderationQueue[2]?.href ?? "/phones",
    reporter: "member",
    note: "Suspected fake. Reviewed and removed.",
    createdAt: "2026-11-05T09:15:00Z",
  },
];

/** Mirrors the `app_settings` row (plan §16). Toggles here change the preview only. */
export const adminSettings = {
  maxFreeListingsIndividual: 3,
  allowCpidListings: false,
  requireImeiForShops: true,
  autoApproveTrustedShops: true,
  maintenanceMode: false,
} as const;

export const adminOverview = {
  liveListings: listings.length,
  pendingReview: moderationQueue.filter((m) => m.status === "pending").length,
  openReports: adminReports.filter((r) => r.status === "open" || r.status === "reviewing").length,
  verifiedShops: shops.filter((s) => s.tier !== "none").length,
  totalUsers: adminUsers.length,
  flagged: moderationQueue.filter((m) => m.status === "flagged").length,
};
