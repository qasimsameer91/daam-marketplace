"use client";

import en from "@/messages/en.json";
import ur from "@/messages/ur.json";
import "./globals.css";

/**
 * Last-resort 500 when the root layout itself fails. next-intl isn't available here, so the
 * copy is read straight from the message files, choosing the locale from the URL.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  const isUrdu = typeof window !== "undefined" && window.location.pathname.startsWith("/ur");
  const m = isUrdu
    ? { title: ur.Empty.error.title, body: ur.Empty.error.body, retry: ur.Common.retry }
    : { title: en.Empty.error.title, body: en.Empty.error.body, retry: en.Common.retry };
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
