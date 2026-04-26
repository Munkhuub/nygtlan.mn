"use client";

import { useLanguage } from "@/app/_providers/LanguageProvider";
import { cn } from "@/lib/utils";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border bg-white p-1 shadow-sm">
      {(["mn", "en"] as const).map((value) => (
        <button
          key={value}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            language === value
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:text-slate-900",
          )}
          onClick={() => setLanguage(value)}
          type="button"
        >
          {value.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
