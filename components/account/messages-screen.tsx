"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  ShieldCheck,
  ArrowUpRight,
  Mic,
  X,
  ImagePlus,
  Flag,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { usePreviewAccount, type PreviewMessage } from "./preview-provider";
import { previewThreads } from "@/lib/mock/account";
import { listings } from "@/lib/mock/marketplace";
import { formatPKR, parsePKR, PRICE_MIN_PKR, PRICE_MAX_PKR } from "@/lib/domain/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/i18n/navigation";
import { EmptyState } from "@/components/daam/empty-state";
import { PreviewNotice } from "./preview-notice";
import { cn } from "@/lib/utils";

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Static waveform bars for a voice bubble (no real audio in the preview). */
function Waveform({ mine }: { mine?: boolean }) {
  const bars = [7, 13, 9, 17, 11, 20, 8, 15, 10, 18, 6, 12];
  return (
    <span className="flex items-center gap-[2px]" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-full", mine ? "bg-paper/80" : "bg-ink/70")}
          style={{ height: `${h}px` }}
        />
      ))}
    </span>
  );
}

export function MessagesScreen({ threadId, safety }: { threadId?: string; safety: string }) {
  const t = useTranslations("Messages");
  const shell = useTranslations("Shell");
  const { messages, setMessages, blocked, setBlocked, ready } = usePreviewAccount();
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [offerOpen, setOfferOpen] = useState(false);
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(null);
  const [invalidOffer, setInvalidOffer] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const recTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const logEnd = useRef<HTMLDivElement>(null);

  const thread = previewThreads.find((th) => th.id === threadId);
  const listing = listings.find((l) => l.id === thread?.listingId);
  const isBlocked = !!thread && blocked.includes(thread.id);
  const threadMessages = messages.filter((m) => m.thread === thread?.id);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ block: "end" });
  }, [threadMessages.length, recording]);

  const stopRec = () => {
    if (recTimer.current) clearInterval(recTimer.current);
    recTimer.current = null;
    setRecording(false);
    setRecTime(0);
  };
  useEffect(() => () => stopRec(), []);

  const add = (extra: Partial<PreviewMessage>) => {
    if (!thread || isBlocked) return false;
    setMessages((old) => [
      ...old,
      {
        id: `preview-${Date.now()}-${old.length}`,
        thread: thread.id,
        text: "",
        mine: true,
        ...extra,
      },
    ]);
    return true;
  };
  const sendText = () => {
    if (!text.trim()) return;
    if (add({ text: text.trim() })) {
      setText("");
      toast.info(shell("messageLocal"));
    }
  };
  const sendOffer = (offer: number) => {
    if (add({ offer })) {
      setAmount("");
      setOfferOpen(false);
      toast.info(shell("messageLocal"));
    }
  };
  const startRec = () => {
    if (!thread || isBlocked) return;
    setRecording(true);
    setRecTime(0);
    recTimer.current = setInterval(() => setRecTime((s) => s + 1), 1000);
  };
  const sendVoice = () => {
    const duration = Math.max(1, recTime);
    if (add({ voice: duration })) toast.info(t("voiceMessage"));
    stopRec();
  };

  const risky = /advance|token|easypaisa|jazzcash|پیشگی|ٹوکن/i.test(text);
  const viewing = !!thread && !!listing;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      {/* Top chrome — hidden on mobile while a conversation is open so the chat fills the screen */}
      <div className={cn("space-y-5", viewing && "hidden md:block")}>
        <PreviewNotice />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-extrabold tracking-display md:text-4xl">
            {t("title")}
          </h1>
          <Button asChild variant="ghost">
            <Link href="/dashboard">{shell("openDashboard")}</Link>
          </Button>
        </div>
      </div>

      <main className="grid min-w-0 gap-5 md:grid-cols-[280px_minmax(0,1fr)]">
        <nav aria-label={t("title")} className={cn("space-y-3", thread && "hidden md:block")}>
          {previewThreads.map((th) => (
            <Link
              key={th.id}
              href={`/messages/${th.id}`}
              aria-current={th.id === threadId ? "page" : undefined}
              className={cn(
                "group flex items-start gap-3 border-2 border-ink p-4 transition-colors hover:bg-muted/60",
                th.id === threadId ? "bg-muted" : "bg-card",
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
              </span>
              <ArrowUpRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </nav>

        {!viewing ? (
          <div className="hidden md:block">
            <EmptyState icon={MessageCircle} title={t("choose")} description={t("previewNote")} />
          </div>
        ) : (
          <section className="flex min-h-[70dvh] min-w-0 flex-col border-2 border-ink bg-card md:h-[72vh] md:min-h-0">
            {/* Compact chat header */}
            <header className="flex items-center gap-3 border-b-2 border-ink bg-sand/60 p-3">
              <Link
                href="/messages"
                aria-label={t("back")}
                className="grid size-9 shrink-0 place-items-center md:hidden"
              >
                <ArrowLeft aria-hidden className="size-5 rtl:rotate-180" />
              </Link>
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-surface font-semibold"
              >
                {thread.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate leading-tight font-semibold">{thread.name}</h2>
                <Link
                  href={listing.href}
                  className="block truncate text-xs text-muted-foreground underline underline-offset-2"
                >
                  {t("about", { title: listing.modelName })}
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("report")}
                className="shrink-0"
                onClick={() => toast.info(t("reportSent"))}
              >
                <Flag aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={isBlocked ? shell("unblock") : t("block")}
                className="shrink-0"
                onClick={() => {
                  setBlocked((old) =>
                    isBlocked ? old.filter((id) => id !== thread.id) : [...old, thread.id],
                  );
                  toast.info(isBlocked ? t("unblockedToast") : t("blockedToast"));
                }}
              >
                <Ban aria-hidden />
              </Button>
            </header>

            {/* Scrollable chat log */}
            <div
              role="log"
              aria-label={t("title")}
              aria-live="polite"
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-muted/20 p-4"
            >
              <p className="mx-auto flex items-center gap-1.5 border border-ink/15 bg-sand/60 px-3 py-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck aria-hidden className="size-3.5 shrink-0" /> {safety}
              </p>

              {/* received */}
              <div className="w-fit max-w-[85%] border-2 border-ink bg-white p-3 text-sm">
                {shell("sampleMessage")}
              </div>

              {/* seller's offer */}
              <div className="w-fit max-w-[85%] space-y-2 border-2 border-ink bg-white p-3">
                <p className="text-sm font-semibold">{t("offer")}</p>
                <p dir="ltr" className="font-display text-xl font-bold">
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

              {/* my messages */}
              {threadMessages.map((m) => (
                <div
                  key={m.id}
                  className="ms-auto w-fit max-w-[85%] border-2 border-ink bg-ink p-3 text-sm break-words text-paper"
                >
                  {m.voice ? (
                    <span className="flex items-center gap-2">
                      <Mic aria-hidden className="size-4 shrink-0" />
                      <Waveform mine />
                      <span dir="ltr" className="font-mono text-xs">
                        {mmss(m.voice)}
                      </span>
                    </span>
                  ) : m.offer ? (
                    <span className="font-display font-bold" dir="ltr">
                      {t("offer")}: {formatPKR(m.offer)}
                    </span>
                  ) : (
                    m.text
                  )}
                </div>
              ))}
              <div ref={logEnd} />
            </div>

            {/* Composer */}
            {isBlocked ? (
              <p role="status" className="border-t-2 border-ink bg-muted p-4 text-sm">
                {shell("blockedLocal")}
              </p>
            ) : recording ? (
              <div className="flex items-center gap-3 border-t-2 border-ink bg-sand/60 p-3">
                <span className="size-3 shrink-0 animate-pulse rounded-full bg-danger-ink" />
                <span className="flex-1 text-sm font-semibold">
                  {t("recording")} ·{" "}
                  <span dir="ltr" className="font-mono">
                    {mmss(recTime)}
                  </span>
                </span>
                <Button variant="ghost" size="icon" aria-label={t("voiceCancel")} onClick={stopRec}>
                  <X aria-hidden />
                </Button>
                <Button size="sm" onClick={sendVoice}>
                  <Send aria-hidden />
                  {t("voiceSend")}
                </Button>
              </div>
            ) : (
              <div className="border-t-2 border-ink p-3">
                {risky && (
                  <p
                    role="alert"
                    className="mb-2 border-2 border-ink bg-warning p-2 text-xs text-ink"
                  >
                    {t("scamBody")}
                  </p>
                )}
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendText();
                  }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={t("photo")}
                    className="shrink-0"
                    onClick={() => toast.info(t("previewNote"))}
                  >
                    <ImagePlus aria-hidden />
                  </Button>
                  <Input
                    disabled={!ready}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={2000}
                    placeholder={t("composer")}
                    aria-label={t("composer")}
                    className="min-w-0 flex-1"
                  />
                  {text.trim() ? (
                    <Button type="submit" size="icon" aria-label={t("send")} className="shrink-0">
                      <Send aria-hidden />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      aria-label={t("voiceRecord")}
                      className="shrink-0"
                      disabled={!ready}
                      onClick={startRec}
                    >
                      <Mic aria-hidden />
                    </Button>
                  )}
                </form>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setOfferOpen((open) => !open)}
                  >
                    {t("makeOffer")}
                  </Button>
                </div>
                {offerOpen && (
                  <form
                    className="mt-2 flex flex-wrap items-end gap-2 border-2 border-ink p-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const value = parsePKR(amount);
                      if (value === null || value < PRICE_MIN_PKR || value > PRICE_MAX_PKR) {
                        setInvalidOffer(true);
                        return;
                      }
                      setInvalidOffer(false);
                      sendOffer(value);
                    }}
                  >
                    <label className="flex-1 space-y-1 text-sm">
                      <span>{shell("offerAmount")}</span>
                      <Input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        inputMode="decimal"
                        dir="ltr"
                        aria-invalid={invalidOffer}
                      />
                      {invalidOffer && (
                        <span className="block text-destructive-text">{shell("offerInvalid")}</span>
                      )}
                    </label>
                    <Button type="submit">{shell("addOffer")}</Button>
                  </form>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
