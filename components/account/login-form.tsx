"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { normalizePakistaniMobile } from "@/lib/domain/phone";
import { usePreviewAccount } from "./preview-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
export function LoginForm() {
  const t = useTranslations("Login");
  const shell = useTranslations("Shell");
  const { setPreviewLogin, previewLogin, ready } = usePreviewAccount();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="rounded-card bg-muted p-4 text-sm">{t("previewNote")}</p>
      {previewLogin ? (
        <div className="space-y-5">
          <p role="status">{shell("loginPreviewComplete")}</p>
          <Button asChild>
            <Link href="/dashboard">{shell("openDashboard")}</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setPreviewLogin(false);
              setStep("phone");
              setPhone("");
              setCode("");
            }}
          >
            {shell("resetPreviewLogin")}
          </Button>
        </div>
      ) : (
        <form
          className="space-y-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            if (step === "phone") {
              if (!normalizePakistaniMobile(phone)) {
                setError(t("phoneInvalid"));
                return;
              }
              setStep("otp");
            } else {
              if (!/^\d{6}$/.test(code)) {
                setError(t("otpInvalid"));
                return;
              }
              setPreviewLogin(true);
              setCode("");
              setPhone("");
            }
          }}
        >
          {step === "phone" ? (
            <label className="block space-y-2">
              <span>{t("phone")}</span>
              <Input
                disabled={!ready}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("phonePlaceholder")}
                maxLength={24}
                dir="ltr"
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
              />
            </label>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{t("otpTitle")}</h2>
              <p className="text-sm text-muted-foreground">{shell("demoCode")}</p>
              <label className="block space-y-2">
                <span>{t("otpLabel")}</span>
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  dir="ltr"
                  className="font-mono tracking-widest"
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                />
              </label>
            </>
          )}
          {error && (
            <p id="login-error" role="alert" className="text-sm text-destructive-text">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full">
            {step === "phone" ? shell("showDemoCode") : shell("tryPreviewLogin")}
          </Button>
          {step === "otp" && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setError("");
                  setResent(false);
                }}
              >
                {t("changeNumber")}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setResent(true)}>
                {t("resend")}
              </Button>
              {resent && (
                <p role="status" className="w-full text-sm text-muted-foreground">
                  {shell("noSms")}
                </p>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground">{t("botCheck")}</p>
        </form>
      )}
      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/terms" className="underline">
          {shell("terms")}
        </Link>
        <Link href="/privacy" className="underline">
          {shell("privacy")}
        </Link>
      </div>
    </div>
  );
}
