"use client";
import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  ShieldCheck,
  Store,
  Package,
  Heart,
  LifeBuoy,
  LogOut,
  Monitor,
  ChevronRight,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { usePreviewAccount } from "./preview-provider";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { cities } from "@/lib/mock/marketplace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function Settings() {
  const t = useTranslations("Dashboard.settings");
  const shell = useTranslations("Shell");
  const market = useTranslations("Market");
  const locale = useLocale();
  const router = useRouter();
  const { profile, setProfile, setPreviewLogin, ready } = usePreviewAccount();
  const [notice, setNotice] = useState(false);

  const verify = (field: "phoneVerified" | "emailVerified") => {
    setProfile((p) => ({ ...p, [field]: true }));
    toast.success(t("verifySent"));
  };

  const verifyBadge = (ok: boolean) =>
    ok ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
        <BadgeCheck className="size-4" aria-hidden />
        {t("verified")}
      </span>
    ) : (
      <span className="text-xs font-semibold text-muted-foreground">{t("unverified")}</span>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>

      {/* PROFILE + CONTACT + NOTIFICATIONS + PRIVACY — one Save persists all */}
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setProfile((p) => ({
            ...p,
            name: String(data.get("name")).trim(),
            username: String(data.get("username")).trim(),
            city: String(data.get("city")),
            bio: String(data.get("bio")).trim(),
            whatsapp: data.has("whatsapp"),
            phone: String(data.get("phone")).trim(),
            email: String(data.get("email")).trim(),
            showPhone: data.get("showPhone") === "all" ? "all" : "onRequest",
            showOnline: data.has("showOnline"),
            autoReply: String(data.get("autoReply")).trim(),
            notifPush: data.has("notifPush"),
            notifEmail: data.has("notifEmail"),
            notifChat: data.has("notifChat"),
          }));
          setNotice(true);
          const language = data.get("language");
          if (language !== locale && (language === "en" || language === "ur"))
            router.replace("/dashboard/settings", { locale: language });
        }}
      >
        {/* PROFILE */}
        <section className="space-y-5 rounded-card border border-border p-5">
          <h2 className="text-xl font-semibold">{t("profile")}</h2>
          <label className="block space-y-2">
            <span className="text-sm">{t("displayName")}</span>
            <Input name="name" defaultValue={profile.name} minLength={2} maxLength={40} required />
          </label>
          <label className="block space-y-2">
            <span className="text-sm">{t("username")}</span>
            <Input
              disabled={!ready}
              name="username"
              defaultValue={profile.username}
              pattern="[a-z0-9_.]{3,30}"
              minLength={3}
              maxLength={30}
              required
              dir="ltr"
            />
            <span className="block text-xs text-muted-foreground">
              {t("usernameHelp", { username: profile.username })}
            </span>
          </label>
          <label className="block space-y-2">
            <span className="text-sm">{t("city")}</span>
            <select
              name="city"
              defaultValue={profile.city}
              className="h-11 w-full rounded-button border border-input bg-background px-3"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {market(`cities.${city}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm">{t("bio")}</span>
            <Textarea name="bio" defaultValue={profile.bio} maxLength={300} />
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              name="whatsapp"
              type="checkbox"
              defaultChecked={profile.whatsapp}
              className="size-5 accent-foreground"
            />
            {t("whatsapp")}
          </label>
          <label className="block space-y-2">
            <span className="text-sm">{t("language")}</span>
            <select
              name="language"
              defaultValue={locale}
              className="h-11 w-full rounded-button border border-input bg-background px-3"
            >
              <option value="en">English</option>
              <option value="ur">اردو</option>
            </select>
          </label>
        </section>

        {/* CONTACT & VERIFICATION */}
        <section className="space-y-5 rounded-card border border-border p-5">
          <h2 className="text-xl font-semibold">{t("contact")}</h2>
          <label className="block space-y-2">
            <span className="flex items-center justify-between text-sm">
              {t("phone")}
              {verifyBadge(profile.phoneVerified)}
            </span>
            <div className="flex gap-2">
              <Input name="phone" defaultValue={profile.phone} dir="ltr" inputMode="tel" />
              <Button
                type="button"
                variant="outline"
                onClick={() => verify("phoneVerified")}
                disabled={profile.phoneVerified}
              >
                {t("verify")}
              </Button>
            </div>
            <span className="block text-xs text-muted-foreground">{t("phoneHelp")}</span>
          </label>
          <label className="block space-y-2">
            <span className="flex items-center justify-between text-sm">
              {t("email")}
              {verifyBadge(profile.emailVerified)}
            </span>
            <div className="flex gap-2">
              <Input name="email" type="email" defaultValue={profile.email} dir="ltr" />
              <Button
                type="button"
                variant="outline"
                onClick={() => verify("emailVerified")}
                disabled={profile.emailVerified}
              >
                {t("verify")}
              </Button>
            </div>
          </label>
        </section>

        {/* NOTIFICATIONS */}
        <section className="space-y-3 rounded-card border border-border p-5">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Bell className="size-5" aria-hidden />
            {t("notifications")}
          </h2>
          {(
            [
              ["notifPush", profile.notifPush],
              ["notifEmail", profile.notifEmail],
              ["notifChat", profile.notifChat],
            ] as const
          ).map(([key, val]) => (
            <label key={key} className="flex min-h-11 items-center gap-3 text-sm">
              <input
                name={key}
                type="checkbox"
                defaultChecked={val}
                className="size-5 accent-foreground"
              />
              {t(key)}
            </label>
          ))}
        </section>

        {/* CHAT & PRIVACY */}
        <section className="space-y-5 rounded-card border border-border p-5">
          <h2 className="text-xl font-semibold">{t("privacy")}</h2>
          <label className="block space-y-2">
            <span className="text-sm">{t("autoReply")}</span>
            <Textarea
              name="autoReply"
              defaultValue={profile.autoReply}
              maxLength={200}
              placeholder={t("autoReplyPlaceholder")}
            />
            <span className="block text-xs text-muted-foreground">{t("autoReplyHelp")}</span>
          </label>
          <label className="block space-y-2">
            <span className="text-sm">{t("showPhone")}</span>
            <select
              name="showPhone"
              defaultValue={profile.showPhone}
              className="h-11 w-full rounded-button border border-input bg-background px-3"
            >
              <option value="onRequest">{t("showPhoneRequest")}</option>
              <option value="all">{t("showPhoneAll")}</option>
            </select>
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              name="showOnline"
              type="checkbox"
              defaultChecked={profile.showOnline}
              className="size-5 accent-foreground"
            />
            {t("showOnline")}
          </label>
        </section>

        <div className="space-y-2">
          <Button type="submit">{shell("savePreview")}</Button>
          {notice && (
            <p role="status" className="text-sm text-muted-foreground">
              {shell("localChange")}
            </p>
          )}
        </div>
      </form>

      {/* SHOP & BUSINESS */}
      <section className="space-y-3 rounded-card border border-border p-5">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Store className="size-5" aria-hidden />
          {t("business")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("businessBody")}</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/shop">{t("businessCta")}</Link>
        </Button>
      </section>

      {/* QUICK LINKS */}
      <section className="rounded-card border border-border p-2">
        <h2 className="px-3 pt-3 pb-1 text-xl font-semibold">{t("quickLinks")}</h2>
        {(
          [
            ["/dashboard/listings", t("myOrders"), Package],
            ["/dashboard/favorites", t("saved"), Heart],
            ["/help", t("help"), LifeBuoy],
          ] as const
        ).map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            className="flex min-h-12 items-center gap-3 rounded-button px-3 text-sm hover:bg-muted"
          >
            <Icon className="size-5 text-muted-foreground" aria-hidden />
            <span className="flex-1">{label}</span>
            <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" aria-hidden />
          </Link>
        ))}
      </section>

      {/* SECURITY */}
      <section className="space-y-3 rounded-card border border-border p-5">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ShieldCheck className="size-5" aria-hidden />
          {t("security")}
        </h2>
        <p className="text-sm text-muted-foreground">{shell("securityUnavailable")}</p>

        <div className="space-y-1">
          <span className="text-sm font-medium">{t("passwordTitle")}</span>
          <Button variant="outline" disabled>
            {t("changePassword")}
          </Button>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">{t("devices")}</span>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Monitor className="size-4" aria-hidden />
              {t("deviceThis")}
            </li>
            <li className="flex items-center gap-2">
              <Monitor className="size-4" aria-hidden />
              {t("deviceOther")}
            </li>
          </ul>
          <Button variant="outline" disabled>
            {t("logoutAll")}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => {
            setPreviewLogin(false);
            router.push("/login");
          }}
        >
          <LogOut className="size-4" aria-hidden />
          {shell("resetPreviewLogin")}
        </Button>
      </section>

      {/* DANGER */}
      <section className="space-y-3 rounded-card border border-border p-5">
        <h2 className="text-xl font-semibold">{t("danger")}</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{t("deleteTitle")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("deleteTitle")}</DialogTitle>
              <DialogDescription>{shell("deleteUnavailable")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button disabled variant="destructive">
                {t("deleteConfirm")}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
