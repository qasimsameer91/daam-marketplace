import { serializeJsonLd } from "@/lib/seo/json-ld";

/**
 * Inline JSON-LD. `serializeJsonLd` escapes `<`, `>` and `&`, so even user-supplied strings
 * cannot break out of the script tag. Never pass raw HTML here.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- escaped JSON only (see serializeJsonLd)
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
