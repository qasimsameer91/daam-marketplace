"use client";
import { useState, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

export function CampaignImageUpload({
  mobile = false,
  onUploaded,
  disabled = false,
}: {
  mobile?: boolean;
  onUploaded: (url: string) => void;
  disabled?: boolean;
}) {
  const r = useTranslations("Redesign");
  const [state, setState] = useState<"idle" | "uploading" | "failed">("idle");
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (
      !file.size ||
      file.size > 4 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setState("failed");
      return;
    }
    setState("uploading");
    const body = new FormData();
    body.set("file", file);
    try {
      const response = await fetch("/api/admin/campaign-media", { method: "POST", body });
      const result: unknown = await response.json();
      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("url" in result) ||
        typeof result.url !== "string"
      )
        throw new Error("Upload failed");
      onUploaded(result.url);
      setState("idle");
    } catch {
      setState("failed");
    }
  };
  return (
    <div className="space-y-2">
      <label className="flex flex-col gap-2 text-sm font-medium">
        {r(mobile ? "uploadMobile" : "uploadDesktop")}
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled || state === "uploading"}
          onChange={upload}
          className="h-auto min-h-11 py-3 text-xs"
        />
      </label>
      <p className="text-xs leading-relaxed text-muted-foreground">{r("uploadHelp")}</p>
      {state !== "idle" ? (
        <p role="status" className="text-xs">
          {r(state === "uploading" ? "uploading" : "uploadFailed")}
        </p>
      ) : null}
    </div>
  );
}
