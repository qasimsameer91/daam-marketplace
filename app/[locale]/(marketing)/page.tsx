import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { listings } from "@/lib/mock/marketplace";
import { formatPKR } from "@/lib/domain/pricing";
import { HeroCarousel } from "@/components/marketplace/hero-carousel";
import { MarketListingCard, type MarketCard } from "@/components/daam/market-listing-card";

const CITY_LABEL: Record<string, string> = {
  lahore: "Lahore",
  karachi: "Karachi",
  islamabad: "Islamabad",
  faisalabad: "Faisalabad",
  rawalpindi: "Rawalpindi",
};

export default async function HomePage() {
  const t = await getTranslations("DaamHome");

  const tabs: { label: string; href: string }[] = [
    { label: t("tabAll"), href: "/phones" },
    { label: t("tabUsed"), href: "/phones" },
    { label: t("tabNew"), href: "/phones/box-packed" },
  ];

  const cards: MarketCard[] = listings.slice(0, 8).map((l) => {
    const approved = l.ptaStatus === "pta_approved";
    const isNew = l.box && l.condition === "like_new";
    return {
      id: l.id,
      href: l.href,
      name: `${l.modelName}`,
      storage: `${l.storage} GB`,
      price: formatPKR(l.pricePkr),
      city: CITY_LABEL[l.citySlug] ?? l.city,
      condition: isNew
        ? t("condNew")
        : l.condition === "like_new"
          ? t("condVeryGood")
          : t("condGood"),
      badge: isNew ? t("badgeNew") : t("badgeUsed"),
      pta: approved ? t("ptaApproved") : t("nonPta"),
      ptaApproved: approved,
      battery: l.batteryHealth ? `${l.batteryHealth}%` : "100%",
    };
  });

  return (
    <main className="mx-auto w-full max-w-[1440px]">
      {/* HERO CAROUSEL */}
      <section className="border-b-2 border-ink">
        <HeroCarousel />
        <div className="flex flex-wrap items-center gap-4 border-t-2 border-ink px-5 py-5 md:px-10">
          <h1 className="font-display text-[clamp(22px,2.4vw,30px)] font-extrabold tracking-[-0.8px] md:me-auto">
            {t("heroHeading")}
          </h1>
          <form className="flex min-w-full flex-1 gap-3 md:max-w-[620px] md:min-w-[320px]">
            <div className="flex flex-1 items-center gap-[10px] border-2 border-ink bg-white px-4">
              <span className="text-[17px] opacity-60">⌕</span>
              <input
                placeholder={t("searchPlaceholder")}
                className="w-full border-none bg-transparent py-[13px] text-[15px] text-ink outline-none"
              />
            </div>
            <Link
              href="/phones"
              className="flex items-center border-2 border-ink bg-lime px-6 font-display text-base font-bold whitespace-nowrap text-ink"
            >
              {t("findPhones")}
            </Link>
          </form>
        </div>
      </section>

      {/* FILTER BAR — stacks on mobile, horizontal .dc.html bar on md+ */}
      <section className="flex flex-col border-b-2 border-ink md:flex-row md:flex-wrap md:items-stretch">
        <div className="flex items-stretch border-b-2 border-ink md:border-b-0">
          {tabs.map((tab, i) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex-1 py-[14px] text-center font-display text-[15px] font-bold md:flex-none md:px-[26px] ${i > 0 ? "border-s-2 border-ink" : ""} ${i === 0 ? "bg-lime" : "bg-transparent"} text-ink`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3 px-5 py-4 md:min-w-[280px] md:flex-1 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-[22px] md:border-s-2 md:border-ink md:px-10 md:py-3">
          <label className="flex items-center justify-between gap-[10px] text-sm font-semibold md:justify-start">
            {t("budget")}:
            <select className="min-w-0 flex-1 border-2 border-ink bg-white px-3 py-[9px] text-sm font-semibold md:flex-none">
              <option>{t("budgetAny")}</option>
              <option>{t("budgetU50")}</option>
              <option>{t("budget50to100")}</option>
              <option>{t("budgetOver100")}</option>
            </select>
          </label>
          <label className="flex items-center justify-between gap-[10px] text-sm font-semibold md:justify-start">
            {t("cityLabel")}:
            <select className="min-w-0 flex-1 border-2 border-ink bg-white px-3 py-[9px] text-sm font-semibold md:flex-none">
              <option>Lahore</option>
              <option>Karachi</option>
              <option>Islamabad</option>
              <option>Faisalabad</option>
            </select>
          </label>
          <label className="flex items-center justify-between gap-[10px] text-sm font-semibold md:justify-start">
            {t("sort")}:
            <select className="min-w-0 flex-1 border-2 border-ink bg-white px-3 py-[9px] text-sm font-semibold md:flex-none">
              <option>{t("sortNewest")}</option>
              <option>{t("sortLow")}</option>
              <option>{t("sortHigh")}</option>
            </select>
          </label>
        </div>
      </section>

      {/* FRESH LISTINGS */}
      <section className="px-5 pt-[34px] pb-12 md:px-10">
        <div className="mb-[22px] flex items-end justify-between">
          <h2 className="font-display text-[clamp(30px,3.6vw,46px)] font-extrabold tracking-[-1.5px]">
            {t("fresh")}
          </h2>
          <Link
            href="/phones"
            className="flex items-center gap-[7px] border-b-2 border-ink pb-[3px] text-[15px] font-bold"
          >
            {t("viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6">
          {cards.map((card) => (
            <MarketListingCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      {/* CAMPAIGN STRIP */}
      <section className="mb-[54px] px-5 md:px-10">
        <div className="grid min-h-[300px] grid-cols-1 overflow-hidden border-2 border-ink md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col justify-center gap-4 bg-ink px-11 py-[46px] text-paper">
            <div className="text-[13px] font-bold tracking-[2px] text-lime">{t("forSellers")}</div>
            <h3 className="font-display text-[clamp(28px,3.4vw,42px)] leading-none font-extrabold tracking-[-1px]">
              {t("sellerTitle")}
            </h3>
            <p className="max-w-[360px] text-[15px] font-medium text-paper/80">{t("sellerBody")}</p>
            <Link
              href="/sell"
              prefetch={false}
              className="self-start border-2 border-lime bg-lime px-[22px] py-3 font-display text-[15px] font-bold text-ink"
            >
              {t("startSelling")}
            </Link>
          </div>
          <div className="relative min-h-[220px] overflow-hidden">
            <Image
              src="/campaigns/seller-titanium.png"
              alt=""
              fill
              sizes="(min-width:768px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
