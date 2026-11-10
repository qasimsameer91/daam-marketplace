"use client";

import { MessageCircle, MessagesSquare, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

interface ContactActionsProps {
  contact: { chat: boolean; whatsapp: boolean; call: boolean };
  /** `bar`: fixed above the mobile bottom nav, within thumb reach. */
  variant?: "inline" | "bar";
  className?: string;
}

/**
 * Chat / WhatsApp / Show number. Phase 3: visitors are logged out, so every action opens a login
 * prompt. The phone number is never in the page; Phase 6 reveals it via the revealContact action.
 */
export function ContactActions({ contact, variant = "inline", className }: ContactActionsProps) {
  const t = useTranslations("Listing");
  const tCommon = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const bar = variant === "bar";

  const actions = [
    { key: "chat", enabled: contact.chat, Icon: MessagesSquare, variant: "default" as const },
    {
      key: "whatsapp",
      enabled: contact.whatsapp,
      Icon: MessageCircle,
      variant: "secondary" as const,
    },
    { key: "call", enabled: contact.call, Icon: Phone, variant: "outline" as const },
  ].filter((a) => !bar || a.enabled);

  return (
    <>
      <div
        className={cn(
          bar
            ? "fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 grid auto-cols-fr grid-flow-col gap-2 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden"
            : "grid gap-2 sm:grid-cols-3",
          className,
        )}
      >
        {actions.map(({ key, enabled, Icon, variant: v }) => (
          <Button
            key={key}
            variant={v}
            disabled={!enabled}
            title={enabled ? undefined : t("contactOff")}
            onClick={() => setOpen(true)}
            className="w-full"
          >
            <Icon aria-hidden />
            {t(key as "chat" | "whatsapp" | "call")}
            {!enabled ? <span className="sr-only">({t("contactOff")})</span> : null}
          </Button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("loginTitle")}</DialogTitle>
            <DialogDescription>{t("loginBody")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {tCommon("close")}
            </Button>
            <Button asChild>
              <Link href="/login">{t("loginCta")}</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
