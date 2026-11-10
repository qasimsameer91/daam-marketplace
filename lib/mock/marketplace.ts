import type { ListingCardData } from "@/components/daam/listing-card";
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
  { slug: "pixel-7-pro", brand: "google", name: "Pixel 7 Pro", aliases: ["7 pro"] },
  { slug: "galaxy-a54", brand: "samsung", name: "Galaxy A54", aliases: ["a54"] },
];

export interface MockListing extends ListingCardData {
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
}
const base = sampleListings.map((listing, i): MockListing => ({
  ...listing,
  brand: ["apple", "samsung", "apple", "redmi"][i]!,
  model: ["iphone-14-pro", "galaxy-s23-ultra", "iphone-13-pro-max", "redmi-note-13"][i]!,
  citySlug: listing.city.toLowerCase(),
  areaSlug: listing.area?.toLowerCase() ?? "",
  storage: i === 2 ? 128 : 256,
  ram: i === 1 ? 12 : i === 3 ? 8 : 6,
  color: i % 2 ? "black" : "silver",
  warranty: i === 0,
  box: i !== 2,
  imeiOnFile: true,
  checked: i === 0,
  imageUrl: "/phone-preview.svg",
  href: "/preview/listing",
}));
export const listings: MockListing[] = [
  ...base,
  ...Array.from({ length: 8 }, (_, i): MockListing => {
    const source = base[i % base.length]!;
    const google = i === 2 || i === 6;
    return {
      ...source,
      id: `mock-${i + 5}`,
      href: "/preview/listing",
      ...(google
        ? { brand: "google", model: "pixel-7-pro", modelName: "Pixel 7 Pro", ram: 12 }
        : {}),
      pricePkr: google ? 72000 + i * 1500 : source.pricePkr - 12000 + i * 1000,
      citySlug: cities[(i + 2) % cities.length]!,
      city: cities[(i + 2) % cities.length]!,
      area: null,
      areaSlug: "",
      ptaStatus: i % 3 === 0 ? "non_pta" : "pta_approved",
      networkLock: "factory_unlocked",
      condition: i % 2 ? "grade_8" : "like_new",
      daamBand: i % 3 === 0 ? "great" : "fair",
      isFeatured: false,
      isFavorited: false,
      checked: i % 2 === 0,
      warranty: i % 3 === 0,
      box: i % 2 === 0,
      publishedAt: new Date(mockNow.getTime() - (i + 1) * 86400000).toISOString(),
    };
  }),
];

export const areas = [...new Set(listings.map((l) => l.areaSlug).filter(Boolean))];
