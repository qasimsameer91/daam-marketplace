"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Send, ArrowLeft, ShieldCheck, ArrowUpRight } from "lucide-react";
import { usePreviewAccount } from "./preview-provider";
import { previewThreads } from "@/lib/mock/account";
import { listings } from "@/lib/mock/marketplace";
import { formatPKR, parsePKR, PRICE_MIN_PKR, PRICE_MAX_PKR } from "@/lib/domain/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/lib/i18n/navigation";
import { EmptyState } from "@/components/daam/empty-state";
import { PreviewNotice } from "./preview-notice";
import { cn } from "@/lib/utils";

export function MessagesScreen({ threadId, safety }: { threadId?: string; safety: string }) {
  const t = useTranslations("Messages");
  const shell = useTranslations("Shell");
  const { messages, setMessages, blocked, setBlocked, ready } = usePreviewAccount();
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [offerOpen, setOfferOpen] = useState(false);
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(null);
  const [notice, setNotice] = useState("");
  const [invalidOffer, setInvalidOffer] = useState(false);
  const thread = previewThreads.find((th) => th.id === threadId);
  const listing = listings.find((l) => l.id === thread?.listingId);
  const isBlocked = !!thread && blocked.includes(thread.id);
  const append = (offer?: number) => {
    if (!thread || isBlocked) return;
    setMessages((old) => [
      ...old,
      {
        id: `preview-${Date.now()}-${old.length}`,
        thread: thread.id,
        text: offer ? "" : text.trim(),
        mine: true,
        ...(offer ? { offer } : {}),
      },
    ]);
    setText("");
    setAmount("");
    setOfferOpen(false);
    setNotice(shell("messageLocal"));
  };
  const risky = /advance|token|easypaisa|jazzcash|پیشگی|ٹوکن/i.test(text);
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-6 lg:px-8">
      <PreviewNotice />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-display md:text-4xl">{t("title")}</h1>
        <Button asChild variant="ghost">
          <Link href="/dashboard">{shell("openDashboard")}</Link>
        </Button>
      </div>
      <main className="grid min-w-0 gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
        <nav aria-label={t("title")} className={cn("space-y-3", thread && "hidden md:block")}>
          {previewThreads.map((th) => (
            <Link
              key={th.id}
              href={`/messages/${th.id}`}
              aria-current={th.id === threadId ? "page" : undefined}
              className={cn(
                "group flex items-start gap-3 rounded-card border border-border p-4 transition-colors hover:bg-muted/60",
                th.id === threadId ? "border-foreground/30 bg-muted" : "bg-card",
              )}
            >
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-paper"
              >
                {th.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{th.name}</span>
                <span className="mt-1 block truncate text-sm text-muted-foreground">
                  {listings.find((l) => l.id === th.listingId)?.modelName}
                </span>
                <span className="mt-2 block text-xs text-muted-foreground">
                  {shell("sampleConversation")}
                </span>
              </span>
              <ArrowUpRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </nav>
        {!thread || !listing ? (
          <div className="hidden md:block">
            <EmptyState icon={MessageCircle} title={t("choose")} description={t("previewNote")} />
          </div>
        ) : (
          <section className="min-w-0 overflow-hidden rounded-card border border-border bg-card">
            <header className="space-y-4 border-b border-border bg-sand/60 p-5 text-foreground">
              <Link
                href="/messages"
                className="inline-flex min-h-11 items-center gap-2 text-sm md:hidden"
              >
                <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
                {t("back")}
              </Link>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-12 shrink-0 place-items-center rounded-full border border-border bg-surface font-semibold"
                >
                  {thread.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">{thread.name}</h2>
                  <Link
                    href={listing.href}
                    className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    {t("about", { title: listing.modelName })}
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-surface"
                  onClick={() => {
                    setBlocked((old) =>
                      isBlocked ? old.filter((id) => id !== thread.id) : [...old, thread.id],
                    );
                    setNotice(shell("localChange"));
                  }}
                >
                  {isBlocked ? shell("unblock") : t("block")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:bg-surface"
                  onClick={() => setNotice(shell("reportLocal"))}
                >
                  {t("report")}
                </Button>
              </div>
            </header>
            <div className="space-y-4 p-4 md:p-6">
              <aside className="flex gap-3 rounded-card border border-border bg-muted/50 p-4 text-sm">
                <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0" />
                <div>
                  <h3 className="mb-1 font-semibold">{t("safetyTitle")}</h3>
                  <p className="text-muted-foreground">{safety}</p>
                </div>
              </aside>
              <div
                role="log"
                aria-label={t("title")}
                aria-live="polite"
                className="min-h-48 space-y-4 rounded-card bg-muted/30 p-4 md:p-5"
              >
                <div className="w-fit max-w-[90%] rounded-card rounded-ss-sm bg-card p-4 text-sm shadow-sm">
                  {shell("sampleMessage")}
                </div>
                <div className="w-fit max-w-full space-y-3 rounded-card border border-border bg-card p-4 shadow-sm">
                  <p className="text-sm font-semibold">{t("offer")}</p>
                  <p dir="ltr" className="font-mono text-xl">
                    {formatPKR(thread.offer)}
                  </p>
                  {decision ? (
                    <p role="status" className="text-sm">
                      {decision === "accepted"
                        ? shell("offerAcceptedLocal")
                        : shell("offerDeclinedLocal")}
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => setDecision("accepted")}>
                        {t("accept")}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setDecision("declined")}>
                        {t("decline")}
                      </Button>
                    </div>
                  )}
                </div>
                {messages
                  .filter((m) => m.thread === thread.id)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="ms-auto w-fit max-w-[90%] rounded-card rounded-se-sm bg-secondary p-4 text-sm break-words text-secondary-foreground"
                    >
                      {m.offer ? (
                        <span className="font-mono" dir="ltr">
                          {t("offer")}: {formatPKR(m.offer)}
                        </span>
                      ) : (
                        m.text
                      )}
                      <p className="mt-2 text-xs opacity-75">{shell("localOnly")}</p>
                    </div>
                  ))}
              </div>
              {isBlocked ? (
                <p role="status" className="rounded-card bg-muted p-4 text-sm">
                  {shell("blockedLocal")}
                </p>
              ) : (
                <>
                  <form
                    className="space-y-3 border-t border-border pt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (text.trim()) append();
                    }}
                  >
                    <label className="block space-y-2">
                      <span className="text-sm">{t("composer")}</span>
                      <Textarea
                        disabled={!ready}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={2000}
                        rows={3}
                      />
                    </label>
                    {risky && (
                      <p role="alert" className="rounded-card bg-warning p-3 text-sm text-ink">
                        {t("scamBody")}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button type="submit" disabled={!text.trim()}>
                        <Send aria-hidden />
                        {t("send")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOfferOpen((open) => !open)}
                      >
                        {t("makeOffer")}
                      </Button>
                    </div>
                  </form>
                  {offerOpen && (
                    <form
                      className="space-y-3 rounded-card border border-border p-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const value = parsePKR(amount);
                        if (value === null || value < PRICE_MIN_PKR || value > PRICE_MAX_PKR) {
                          setInvalidOffer(true);
                          return;
                        }
                        setInvalidOffer(false);
                        append(value);
                      }}
                    >
                      <label className="block space-y-2">
                        <span className="text-sm">{shell("offerAmount")}</span>
                        <Input
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          inputMode="decimal"
                          dir="ltr"
                          aria-invalid={invalidOffer}
                        />
                      </label>
                      {invalidOffer && (
                        <p role="alert" className="text-sm text-destructive-text">
                          {shell("offerInvalid")}
                        </p>
                      )}
                      <Button type="submit">{shell("addOffer")}</Button>
                    </form>
                  )}
                </>
              )}
              {notice && (
                <p role="status" className="text-sm text-muted-foreground">
                  {notice}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{t("previewNote")}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
