import {
  CircleQuestionMark,
  Lock,
  LockOpen,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestionMark,
  ShieldX,
  TriangleAlert,
  type LucideProps,
} from "lucide-react";
import type { StatusIcon as StatusIconKey } from "@/lib/domain/pta";

const ICONS = {
  "shield-check": ShieldCheck,
  "shield-alert": ShieldAlert,
  "shield-x": ShieldX,
  "shield-question": ShieldQuestionMark,
  unlock: LockOpen,
  lock: Lock,
  "sim-alert": TriangleAlert,
  help: CircleQuestionMark,
} satisfies Record<StatusIconKey, React.ComponentType<LucideProps>>;

/** Resolves a domain icon key (lib/domain/pta.ts) to its Lucide icon. Decorative by default. */
export function StatusIcon({ icon, ...props }: { icon: StatusIconKey } & LucideProps) {
  const Icon = ICONS[icon];
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}
