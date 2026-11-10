/**
 * JSON-LD helpers (plan §16.4). Pure: builds schema.org objects and serializes them safely
 * for a `<script type="application/ld+json">` tag.
 */

/**
 * JSON.stringify, then escape characters that could close the script tag or break parsing
 * (`<`, `>`, `&`, U+2028, U+2029). Safe to inline even if a value contains user text.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replaceAll(LINE_SEPARATOR, "\\u" + "2028")
    .replaceAll(PARAGRAPH_SEPARATOR, "\\u" + "2029");
}

const CONDITION_SCHEMA: Record<string, string> = {
  brand_new: "https://schema.org/NewCondition",
  open_box: "https://schema.org/NewCondition",
  refurbished: "https://schema.org/RefurbishedCondition",
  for_parts: "https://schema.org/DamagedCondition",
};

/** Product + Offer for a listing page. Uses catalog fields only, never the free-text description. */
export function productOfferJsonLd(input: {
  name: string;
  brand: string;
  url: string;
  image: string | null;
  pricePkr: number;
  condition: string;
  sold: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    brand: { "@type": "Brand", name: input.brand },
    ...(input.image ? { image: [input.image] } : {}),
    offers: {
      "@type": "Offer",
      url: input.url,
      priceCurrency: "PKR",
      price: input.pricePkr,
      itemCondition: CONDITION_SCHEMA[input.condition] ?? "https://schema.org/UsedCondition",
      availability: input.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
  };
}

/** FAQPage for the PTA guide and Help centre. */
export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
