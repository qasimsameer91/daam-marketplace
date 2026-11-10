import { describe, expect, it } from "vitest";
import { faqPageJsonLd, productOfferJsonLd, serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  it("cannot close the script tag or inject HTML", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script> & co" });
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
    expect(out).not.toContain("&");
    expect(JSON.parse(out)).toEqual({ name: "</script><script>alert(1)</script> & co" });
  });

  it("escapes line and paragraph separators", () => {
    const tricky = `x${String.fromCharCode(0x2028)}y${String.fromCharCode(0x2029)}z`;
    const out = serializeJsonLd({ a: tricky });
    expect(out).not.toContain(String.fromCharCode(0x2028));
    expect(JSON.parse(out)).toEqual({ a: tricky });
  });
});

describe("schema builders", () => {
  it("builds a PKR offer with the right condition and availability", () => {
    const ld = productOfferJsonLd({
      name: "iPhone 14 Pro 256GB",
      brand: "Apple",
      url: "https://daam.pk/en/listing/iphone-14-pro-256gb-abc12345",
      image: null,
      pricePkr: 189000,
      condition: "grade_9",
      sold: false,
    });
    expect(ld.offers).toMatchObject({
      priceCurrency: "PKR",
      price: 189000,
      itemCondition: "https://schema.org/UsedCondition",
      availability: "https://schema.org/InStock",
    });
    expect(ld).not.toHaveProperty("image");
  });

  it("maps new and refurbished conditions", () => {
    const base = { name: "x", brand: "y", url: "u", image: "i", pricePkr: 1000, sold: true };
    expect(productOfferJsonLd({ ...base, condition: "brand_new" }).offers.itemCondition).toBe(
      "https://schema.org/NewCondition",
    );
    expect(productOfferJsonLd({ ...base, condition: "refurbished" }).offers.availability).toBe(
      "https://schema.org/SoldOut",
    );
  });

  it("builds an FAQPage", () => {
    const ld = faqPageJsonLd([{ question: "Q?", answer: "A." }]);
    expect(ld.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Q?",
      acceptedAnswer: { "@type": "Answer", text: "A." },
    });
  });
});
