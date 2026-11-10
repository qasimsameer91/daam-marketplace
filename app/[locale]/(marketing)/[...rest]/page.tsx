import { notFound } from "next/navigation";

/** Any unmatched path under /[locale] renders the localized 404 inside the site shell. */
export default function CatchAll() {
  notFound();
}
