import {
  CheckCircle2,
  Clock,
  Flag,
  XCircle,
  Ban,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { chipBase, chipSizes, toneClasses } from "@/components/daam/tone-classes";
import type { Tone } from "@/lib/domain/pta";
import { cn } from "@/lib/utils";

type Kind =
  | "approved"
  | "pending"
  | "flagged"
  | "rejected"
  | "open"
  | "reviewing"
  | "resolved"
  | "dismissed"
  | "active"
  | "suspended"
  | "banned";

const MAP: Record<Kind, { tone: Tone; Icon: LucideIcon }> = {
  approved: { tone: "success", Icon: CheckCircle2 },
  active: { tone: "success", Icon: CheckCircle2 },
  resolved: { tone: "success", Icon: CheckCircle2 },
  pending: { tone: "warning", Icon: Clock },
  reviewing: { tone: "warning", Icon: Clock },
  open: { tone: "warning", Icon: ShieldAlert },
  flagged: { tone: "danger", Icon: Flag },
  rejected: { tone: "danger", Icon: XCircle },
  suspended: { tone: "warning", Icon: ShieldAlert },
  banned: { tone: "danger", Icon: Ban },
  dismissed: { tone: "neutral", Icon: XCircle },
};

/** Status is never colour alone: always an icon + label. */
export function StatusChip({ kind, label }: { kind: Kind; label: string }) {
  const { tone, Icon } = MAP[kind];
  return (
    <span className={cn(chipBase, chipSizes.sm, toneClasses[tone])}>
      <Icon aria-hidden />
      {label}
    </span>
  );
}
