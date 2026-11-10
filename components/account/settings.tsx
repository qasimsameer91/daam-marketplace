"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePreviewAccount } from "./preview-provider";
import { useRouter } from "@/lib/i18n/navigation";
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
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <form
        className="space-y-5 rounded-card border border-border p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setProfile({
            name: String(data.get("name")).trim(),
            username: String(data.get("username")).trim(),
            city: String(data.get("city")),
            bio: String(data.get("bio")).trim(),
            whatsapp: data.has("whatsapp"),
          });
          setNotice(true);
          const language = data.get("language");
          if (language !== locale && (language === "en" || language === "ur"))
            router.replace("/dashboard/settings", { locale: language });
        }}
      >
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
        <Button type="submit">{shell("savePreview")}</Button>
        {notice && (
          <p role="status" className="text-sm text-muted-foreground">
            {shell("localChange")}
          </p>
        )}
      </form>
      <section className="space-y-3 rounded-card border border-border p-5">
        <h2 className="text-xl font-semibold">{t("security")}</h2>
        <p className="text-sm text-muted-foreground">{shell("securityUnavailable")}</p>
        <Button variant="outline" disabled>
          {t("logoutAll")}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setPreviewLogin(false);
            router.push("/login");
          }}
        >
          {shell("resetPreviewLogin")}
        </Button>
      </section>
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
