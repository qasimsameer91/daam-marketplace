import { LoginForm } from "@/components/account/login-form";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const r = await getTranslations("Redesign");
  const perks = [
    { title: r("perk1Title"), body: r("perk1Body") },
    { title: r("perk2Title"), body: r("perk2Body") },
    { title: r("perk3Title"), body: r("perk3Body") },
  ];
  return (
    <main className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch md:grid-cols-2">
      {/* FORM */}
      <div className="flex items-center justify-center border-ink px-6 py-10 md:border-e-2 md:px-12 md:py-16">
        <div className="w-full max-w-[420px]">
          <LoginForm />
        </div>
      </div>

      {/* DARK SIDE PANEL */}
      <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-ink p-8 text-paper md:p-12">
        <h2 className="max-w-[500px] font-display text-[clamp(34px,4vw,60px)] leading-[0.95] font-extrabold tracking-[-2px] rtl:leading-[1.3]">
          {r("loginPanelTitle")}
        </h2>
        <div className="mt-10 flex max-w-[420px] flex-col gap-4">
          {perks.map((p) => (
            <div key={p.title} className="flex items-start gap-3">
              <span className="flex size-[30px] shrink-0 items-center justify-center border-2 border-lime bg-lime font-extrabold text-ink">
                ✓
              </span>
              <div>
                <b className="font-display text-[17px]">{p.title}</b>
                <p className="mt-0.5 text-[13.5px] font-medium text-paper/80">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute -end-[60px] -bottom-[60px] size-[260px] rounded-full border-2 border-lime/40"
        />
      </div>
    </main>
  );
}
