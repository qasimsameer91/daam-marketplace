"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";
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
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <Button asChild variant="ghost">
          <Link href="/dashboard">{shell("openDashboard")}</Link>
        </Button>
      </div>
      <main className="grid min-w-0 gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
        <nav aria-label={t("title")} className={cn("space-y-3", thread && "hidden md:block")}>
          {previewThreads.map((th) => (
            <Link
              key={th.id}
              href={`/messages/${th.id}`}
              aria-current={th.id === threadId ? "page" : undefined}
              className={cn(
                "block rounded-card border border-border p-4",
                th.id === threadId ? "bg-muted" : "bg-card",
              )}
            >
              <p className="font-semibold">{th.name}</p>
              <p className="mt-2 truncate text-sm text-muted-foreground">
                {listings.find((l) => l.id === th.listingId)?.modelName}
              </p>
              <span className="mt-2 inline-block text-xs text-muted-foreground">
                {shell("sampleConversation")}
              </span>
            </Link>
          ))}
        </nav>
        {!thread || !listing ? (
          <div className="hidden md:block">
            <EmptyState icon={MessageCircle} title={t("choose")} description={t("previewNote")} />
          </div>
        ) : (
          <section className="min-w-0 rounded-card border border-border bg-card">
            <header className="space-y-3 border-b border-border p-4">
              <Link
                href="/messages"
                className="inline-flex min-h-11 items-center gap-2 text-sm md:hidden"
              >
                <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
                {t("back")}
              </Link>
              <h2 className="font-semibold">{thread.name}</h2>
              <Link
                href={listing.href}
                className="inline-block text-sm underline underline-offset-4"
              >
                {t("about", { title: listing.modelName })}
              </Link>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBlocked((old) =>
                      isBlocked ? old.filter((id) => id !== thread.id) : [...old, thread.id],
                    );
                    setNotice(shell("localChange"));
                  }}
                >
                  {isBlocked ? shell("unblock") : t("block")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setNotice(shell("reportLocal"))}>
                  {t("report")}
                </Button>
              </div>
            </header>
            <div className="space-y-4 p-4">
              <aside className="rounded-card bg-muted p-4 text-sm">
                <h3 className="mb-2 font-semibold">{t("safetyTitle")}</h3>
                <p>{safety}</p>
              </aside>
              <div role="log" aria-label={t("title")} aria-live="polite" className="space-y-4">
                <div className="w-fit max-w-[90%] rounded-card bg-muted p-4 text-sm">
                  {shell("sampleMessage")}
                </div>
                <div className="w-fit max-w-full space-y-3 rounded-card border border-border p-4">
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
                      className="ms-auto w-fit max-w-[90%] rounded-card bg-secondary p-4 text-sm break-words text-secondary-foreground"
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
