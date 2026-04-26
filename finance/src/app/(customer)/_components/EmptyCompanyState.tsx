import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/_providers/LanguageProvider";

export const EmptyCompanyState = () => {
  const { text } = useLanguage();

  return (
    <div className="rounded-3xl border border-dashed bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100">
        <Building2 className="size-6 text-slate-600" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-slate-950">
        {text("Анхны компаниа үүсгэнэ үү", "Create your first company")}
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
        {text(
          "Санхүүгийн бүртгэлийн урсгал компани үүсгэснээр эхэлнэ. Үүний дараа дансны жагсаалт үүсгэж, журналын бичилт хийж, тайлангаа нээх боломжтой.",
          "The accounting workflow starts with a company record. Once that exists, you can create a chart of accounts, post journal entries, and open reports.",
        )}
      </p>
      <Button className="mt-6" asChild>
        <Link href="/companies/new">
          {text("Компани тохируулах", "Set up a company")}
        </Link>
      </Button>
    </div>
  );
};
