import type { ReactNode } from "react";
export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="animate-[page-enter_200ms_ease-out] motion-reduce:animate-none">{children}</div>
  );
}
