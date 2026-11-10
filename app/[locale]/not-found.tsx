import { NotFoundView } from "@/components/marketplace/not-found-view";

/** Fallback 404 outside the marketing shell (e.g. /[locale]/dev/* in production). */
export default function NotFound() {
  return <NotFoundView />;
}
