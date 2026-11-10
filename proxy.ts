import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on everything except API routes, Next internals, Vercel internals and files with an extension.
  matcher: "/((?!api|trpc|_next|_vercel|.*\..*).*)",
};
