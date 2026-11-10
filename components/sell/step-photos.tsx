"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Camera, GripVertical, ImagePlus, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-daam-motion";
import { cn } from "@/lib/utils";
import { MAX_PHOTOS, MIN_PHOTOS, type ListingPhoto } from "@/lib/validation/listing";
import { FieldError, errorId } from "./field-error";
import { useSellForm, useSetField } from "./sell-form-context";

/** Plan §16.5: reject anything over 10 MB before compression. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const TIP_KEYS = ["front", "back", "sides", "about", "battery"] as const;

/**
 * Compress in the browser to WebP ≤1600px (plan §8). Re-drawing on a canvas also drops EXIF/GPS;
 * the server re-encodes again in Phase 6. Loaded on demand to keep the wizard bundle small.
 */
async function compress(file: File): Promise<Blob> {
  const { default: imageCompression } = await import("browser-image-compression");
  return imageCompression(file, {
    maxWidthOrHeight: 1600,
    maxSizeMB: 1,
    fileType: "image/webp",
    initialQuality: 0.82,
    // The worker build would fetch a script from a CDN; keep everything same-origin.
    useWebWorker: false,
  });
}

function SortablePhoto({
  photo,
  index,
  onRemove,
}: {
  photo: ListingPhoto;
  index: number;
  onRemove: () => void;
}) {
  const t = useTranslations("Sell.photos");
  const reduced = usePrefersReducedMotion();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: reduced ? undefined : transition,
      }}
      className={cn(
        "relative aspect-[4/5] overflow-hidden rounded-card border border-border bg-muted",
        isDragging && "z-10 opacity-80 shadow-lift",
      )}
    >
      <Image
        src={photo.url}
        alt={t("reorder", { n: index + 1 })}
        fill
        sizes="(min-width: 640px) 20vw, 33vw"
        className="object-cover"
      />
      {index === 0 ? (
        <span className="absolute start-2 top-2 rounded-chip bg-lime px-2 py-0.5 text-xs font-semibold text-ink">
          {t("cover")}
        </span>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-background/85 p-1 backdrop-blur">
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={t("reorder", { n: index + 1 })}
          className="inline-flex size-11 cursor-grab touch-none items-center justify-center rounded-button outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("remove", { n: index + 1 })}
          className="inline-flex size-11 items-center justify-center rounded-button outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Trash2 aria-hidden className="size-5" />
        </button>
      </div>
    </li>
  );
}

/** Screen 5 (plan §8): 3–10 photos, local previews, drag-and-drop order, first = cover. */
export function StepPhotos() {
  const t = useTranslations("Sell.photos");
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { watch, formState } = useSellForm();
  const setField = useSetField();
  const photos = watch("photos") ?? [];
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);

  // Blob URLs are freed on remove here, and by SellWizard when the whole wizard unmounts or resets
  // (not on step change: the preview still needs them).

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const position = (photoId: string | number) => photos.findIndex((p) => p.id === photoId) + 1;
  const announcements: Announcements = {
    onDragStart: ({ active }) => t("dnd.start", { n: position(active.id) }),
    onDragOver: ({ active, over }) =>
      over ? t("dnd.over", { n: position(active.id), pos: position(over.id) }) : undefined,
    onDragEnd: ({ active, over }) =>
      over ? t("dnd.end", { n: position(active.id), pos: position(over.id) }) : undefined,
    onDragCancel: () => t("dnd.cancel"),
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = photos.findIndex((p) => p.id === active.id);
    const to = photos.findIndex((p) => p.id === over.id);
    setField("photos", arrayMove(photos, from, to));
  };

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const issues: string[] = [];
    const room = MAX_PHOTOS - photos.length;
    if (files.length > room) issues.push(t("limit"));
    setBusy(true);
    const added: ListingPhoto[] = [];
    for (const file of files.slice(0, Math.max(room, 0))) {
      if (!file.type.startsWith("image/")) {
        issues.push(t("notImage", { name: file.name }));
        continue;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        issues.push(t("tooBig", { name: file.name }));
        continue;
      }
      try {
        const blob = await compress(file);
        added.push({ id: crypto.randomUUID(), url: URL.createObjectURL(blob) });
      } catch {
        issues.push(t("failed", { name: file.name }));
      }
    }
    setBusy(false);
    setProblems(issues);
    if (added.length) setField("photos", [...photos, ...added]);
  };

  const remaining = Math.max(MIN_PHOTOS - photos.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">{t("title")}</h2>
          <p className="font-mono text-sm text-muted-foreground" aria-live="polite">
            {t("count", { count: photos.length })}
          </p>
        </div>
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={onFiles}
          aria-describedby={formState.errors.photos ? errorId("photos") : undefined}
        />
        <Button
          type="button"
          id="field-photos"
          variant="secondary"
          disabled={busy || photos.length >= MAX_PHOTOS}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? (
            <Loader2 aria-hidden className="animate-spin reduced-motion:animate-none" />
          ) : (
            <ImagePlus aria-hidden />
          )}
          {busy ? t("processing") : t("add")}
        </Button>
      </div>

      <FieldError name="photos" />
      {problems.length > 0 ? (
        <ul role="alert" className="flex flex-col gap-1 text-sm text-destructive-text">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : null}

      {photos.length > 0 ? (
        <>
          <p id={`${id}-hint`} className="text-sm text-muted-foreground">
            {t("moveHint")}
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
            accessibility={{
              announcements,
              screenReaderInstructions: { draggable: t("dnd.instructions") },
            }}
          >
            <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5" aria-describedby={`${id}-hint`}>
                {photos.map((photo, index) => (
                  <SortablePhoto
                    key={photo.id}
                    photo={photo}
                    index={index}
                    onRemove={() => {
                      URL.revokeObjectURL(photo.url);
                      setField(
                        "photos",
                        photos.filter((p) => p.id !== photo.id),
                      );
                    }}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </>
      ) : null}

      {remaining > 0 ? <p className="text-sm">{t("needMore", { count: remaining })}</p> : null}

      <section className="flex flex-col gap-2 rounded-card bg-muted/60 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Camera aria-hidden className="size-4" />
          {t("tipsTitle")}
        </h3>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {TIP_KEYS.map((k) => (
            <li key={k} className="before:me-2 before:content-['·']">
              {t(`tips.${k}`)}
            </li>
          ))}
        </ul>
        <p className="mt-1 flex gap-2 text-xs text-muted-foreground">
          <ShieldCheck aria-hidden className="size-4 shrink-0" />
          {t("exifNote")}
        </p>
      </section>
    </div>
  );
}
