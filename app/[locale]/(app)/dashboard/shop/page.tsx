import { getTranslations } from "next-intl/server";
import { Store } from "lucide-react";
import { EmptyState } from "@/components/daam/empty-state";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
export default async function Page() {
  const t = await getTranslations("Dashboard.shop");
  const shell = await getTranslations("Shell");
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <EmptyState
        icon={Store}
        title={t("noShop")}
        description={t("noShopBody")}
        action={
          <Button asChild variant="outline">
            <Link href="/for-shops">{shell("shopInfo")}</Link>
          </Button>
        }
      />
      <p className="text-center text-sm text-muted-foreground">{t("createCta")}</p>
    </div>
  );
}
