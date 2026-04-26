"use client";

import Image from "next/image";
import { BookOpenText, Landmark, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/app/_providers/LanguageProvider";

const Banner = () => {
  const { text } = useLanguage();

  return (
    <div className="relative w-full overflow-hidden bg-[linear-gradient(135deg,#183B34_0%,#285D53_52%,#E7D2A0_52%,#F7F3E8_100%)] px-4 py-4 sm:px-8 sm:py-6 md:min-h-screen md:w-[50%] md:px-12 md:py-0 lg:px-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(24,59,52,0.18),transparent_28%)]" />

      <div className="relative flex items-center gap-3 py-3 md:py-8">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">
          <BookOpenText className="size-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
            {text("Санхүү", "Accounting")}
          </p>
          <p className="text-xl font-semibold text-white">Ledger Lane</p>
        </div>
      </div>

      <div className="relative flex flex-col justify-center gap-8 py-6 md:h-[calc(100vh-124px)] md:py-0">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur">
            <Landmark className="size-4" />
            {text(
              "Монгол нягтлан бодох бүртгэлийн ажлын орчин",
              "Mongolian accounting workspace",
            )}
          </div>

          <h2 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            {text(
              "Журнал, данс, тайлангаа нэг урсгалаар удирд.",
              "Run journals, accounts, and reports in one flow.",
            )}
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-6 text-white/78 sm:text-base">
            {text(
              "Компани үүсгээд Монгол дансны бүтэцтэй эхэлж, өдөр тутмын гүйлгээгээ бүртгээд, санхүүгийн тайлангаа шууд гаргах орчин.",
              "Create a company, start with a Mongolian chart of accounts, post daily activity, and move straight into financial reporting.",
            )}
          </p>
        </div>

        <div className="grid gap-4 text-white/90 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/14 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              {text("Өнөөдрийн урсгал", "Daily flow")}
            </p>
            <div className="mt-4 space-y-3">
              {[
                text("Компани ба дансны бүтэц", "Company and account structure"),
                text("Тэнцсэн журналын бичилт", "Balanced journal posting"),
                text("Баланс ба орлогын тайлан", "Balance sheet and income statement"),
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/14 bg-[#f7f3e8] p-5 text-[#183B34] shadow-xl shadow-black/10">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="size-4" />
              {text("Найдвартай суурь", "Reliable foundation")}
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#183B34]/10 bg-white">
              <Image
                src="/images/login-ledger.svg"
                width={720}
                height={720}
                className="h-auto w-full"
                alt={text(
                  "Нягтлан бодох бүртгэлийн самбар дүрслэл",
                  "Accounting dashboard illustration",
                )}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
