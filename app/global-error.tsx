"use client";

import "./globals.css";

/**
 * Last-resort 500 when the root layout itself fails. next-intl isn't available here, and importing
 * the message catalogs would bundle them into this always-loaded chunk, so the few strings are
 * inlined. Keep them in sync with `Empty.error` / `Common.retry` in messages/{en,ur}.json.
 */
const COPY = {
  en: {
    title: "Something went wrong",
    body: "Check your connection and try again.",
    retry: "Try again",
  },
  ur: {
    title: "کچھ غلط ہو گیا",
    body: "اپنا انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں۔",
    retry: "دوبارہ کوشش کریں",
  },
} as const;

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  const isUrdu = typeof window !== "undefined" && window.location.pathname.startsWith("/ur");
  const m = isUrdu ? COPY.ur : COPY.en;
  return (
    <html lang={isUrdu ? "ur" : "en"} dir={isUrdu ? "rtl" : "ltr"}>
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
        <h1 className="text-2xl font-semibold">{m.title}</h1>
        <p className="text-muted-foreground">{m.body}</p>
        <button
          type="button"
          onClick={reset}
          className="h-11 rounded-button bg-primary px-4 font-semibold text-primary-foreground"
        >
          {m.retry}
        </button>
      </body>
    </html>
  );
}
