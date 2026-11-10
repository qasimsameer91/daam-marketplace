import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";
export default async function Loading() {
  const t = await getTranslations("Common");
  return (
    <main
      role="status"
      aria-label={t("loading")}
      className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8"
    >
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
    </main>
  );
}
