"use client";

import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const TOPICS = ["listing", "account", "shops", "press", "other"] as const;

/** Contact form UI (Phase 3). Submission is wired to email/Turnstile in a later phase. */
export function ContactForm() {
  const t = useTranslations("Pages.contact");
  const id = useId();
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [topic, setTopic] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const missing = new Set<string>();
    if (!String(data.get("name") ?? "").trim()) missing.add("name");
    if (!topic) missing.add("topic");
    if (!String(data.get("message") ?? "").trim()) missing.add("message");
    setErrors(missing);
    if (missing.size > 0) return;
    e.currentTarget.reset();
    setTopic("");
    toast.info(t("sent"));
  };

  const errorFor = (field: string) =>
    errors.has(field) ? (
      <p id={`${id}-${field}-err`} className="text-sm text-destructive-text">
        {t("required")}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <p className="rounded-card bg-muted p-3 text-sm text-muted-foreground">{t("previewNote")}</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-name`} className="text-sm font-medium">
          {t("name")}
        </label>
        <Input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          aria-invalid={errors.has("name") || undefined}
          aria-describedby={errors.has("name") ? `${id}-name-err` : undefined}
        />
        {errorFor("name")}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-email`} className="text-sm font-medium">
          {t("email")}
        </label>
        <Input id={`${id}-email`} name="email" type="email" autoComplete="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span id={`${id}-topic`} className="text-sm font-medium">
          {t("topic")}
        </span>
        <Select value={topic} onValueChange={setTopic}>
          <SelectTrigger
            aria-labelledby={`${id}-topic`}
            aria-invalid={errors.has("topic") || undefined}
            aria-describedby={errors.has("topic") ? `${id}-topic-err` : undefined}
            className="w-full"
          >
            <SelectValue placeholder={t("topicPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {TOPICS.map((k) => (
              <SelectItem key={k} value={k}>
                {t(`topics.${k}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorFor("topic")}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-message`} className="text-sm font-medium">
          {t("message")}
        </label>
        <Textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          maxLength={2000}
          aria-invalid={errors.has("message") || undefined}
          aria-describedby={errors.has("message") ? `${id}-message-err` : undefined}
        />
        {errorFor("message")}
      </div>
      <Button type="submit" className="w-full sm:w-fit">
        {t("send")}
      </Button>
    </form>
  );
}
