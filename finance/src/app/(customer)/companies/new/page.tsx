"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/axios";
import { Company, useAuth } from "@/app/_providers/AuthProvider";
import { useLanguage } from "@/app/_providers/LanguageProvider";
import { WorkspaceShell } from "../../_components/WorkspaceShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

type DefaultAccountsLoadResult = {
  insertedCount: number;
  skippedCount: number;
  totalDefaultCount: number;
  totalCompanyAccounts: number;
};

type CompanyCreationResult = Company & {
  defaultAccounts?: DefaultAccountsLoadResult | null;
};

const currencies = ["MNT", "USD", "EUR", "KRW", "CNY", "JPY", "RUB"] as const;

export default function NewCompanyPage() {
  const router = useRouter();
  const { text } = useLanguage();
  const { user, loading, refreshUser, setCurrentCompanyId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    taxId: "",
    address: "",
    phone: "",
    email: "",
    fiscalYearStart: "1",
    baseCurrency: "MNT",
    loadDefaultAccounts: true,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post<ApiEnvelope<CompanyCreationResult>>(
        "/api/companies",
        {
        ...form,
        taxId: form.taxId || undefined,
        address: form.address || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        fiscalYearStart: Number(form.fiscalYearStart),
        },
      );

      const createdCompany = response.data.data;

      await refreshUser();
      setCurrentCompanyId(createdCompany.id);

      const loadedAccounts = createdCompany.defaultAccounts?.insertedCount ?? 0;
      if (loadedAccounts > 0) {
        toast.success(
          text(
            `${loadedAccounts} үндсэн данс ачаалж, компани үүсгэлээ.`,
            `Company created with ${loadedAccounts} default accounts.`,
          ),
        );
      } else {
        toast.success(
          text("Компани амжилттай үүслээ.", "Company created successfully."),
        );
      }

      router.push("/accounts");
    } catch (error) {
      console.error("Failed to create company", error);
      toast.error(
        text(
          "Компани үүсгэх үед алдаа гарлаа.",
          "There was a problem creating the company.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (!user && !loading)) {
    return (
      <div className="p-8 text-sm text-slate-600">
        {text("Ажлын орчныг ачаалж байна...", "Loading workspace...")}
      </div>
    );
  }

  return (
    <WorkspaceShell
      title={text("Компаниуд", "Companies")}
      description={text(
        "Нягтлан бодох бүртгэлээ хөтлөх хуулийн этгээдээ үүсгэнэ үү. Та олон компани нэмээд толгой хэсгээс сольж болно.",
        "Create the legal entity you want to keep books for. You can add more than one company and switch between them from the header.",
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            {text("Компани үүсгэх", "Create a company")}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {text(
              "Шаардлагатай мэдээллээ оруулаад эхлээрэй. Дараа нь энэ компанийг данс, журнал, тайланд ашиглана.",
              "Start with the required details, then we'll use this company for accounts, journals, and reports.",
            )}
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">{text("Компанийн нэр", "Company name")}</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder={text("Жишээ ХХК", "Example LLC")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">{text("Татварын дугаар", "Tax ID")}</Label>
                <Input
                  id="taxId"
                  value={form.taxId}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, taxId: event.target.value }))
                  }
                  placeholder={text("Заавал биш", "Optional")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{text("Компанийн имэйл", "Company email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="finance@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{text("Утас", "Phone")}</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  placeholder="+976..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscalYearStart">
                  {text("Санхүүгийн жилийн эхлэх сар", "Fiscal year start month")}
                </Label>
                <Select
                  value={form.fiscalYearStart}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, fiscalYearStart: value }))
                  }
                >
                  <SelectTrigger id="fiscalYearStart" className="w-full">
                      <SelectValue placeholder={text("Сар сонгох", "Select month")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, index) => (
                      <SelectItem key={index + 1} value={String(index + 1)}>
                        {text(`${index + 1}-р сар`, `Month ${index + 1}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseCurrency">{text("Суурь валют", "Base currency")}</Label>
                <Select
                  value={form.baseCurrency}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, baseCurrency: value }))
                  }
                >
                  <SelectTrigger id="baseCurrency" className="w-full">
                    <SelectValue placeholder={text("Валют сонгох", "Select currency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">{text("Хаяг", "Address")}</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, address: event.target.value }))
                  }
                  placeholder={text("Заавал биш албан ёсны хаяг", "Optional registered address")}
                />
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.loadDefaultAccounts}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    loadDefaultAccounts: event.target.checked,
                  }))
                }
              />
              <span>
                {text(
                  "Монгол дансны үндсэн жагсаалтыг автоматаар ачаалах",
                  "Automatically load the default Mongolian chart of accounts",
                )}
              </span>
            </label>

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? text("Компани үүсгэж байна...", "Creating company...")
                : text("Компани үүсгэх", "Create company")}
            </Button>
          </form>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            {text("Одоогийн компаниуд", "Existing companies")}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {text("Таны бүртгэлтэй холбогдсон компаниуд.", "These are already attached to your account.")}
          </p>

          <div className="mt-6 space-y-3">
            {(user?.companies ?? []).length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                {text(
                  "Одоогоор компани алга. Эхний компаниа үүсгээд эхлээрэй.",
                  "No companies yet. Create your first company to begin.",
                )}
              </p>
            ) : (
              (user?.companies ?? []).map((company) => (
                <div key={company.id} className="rounded-2xl border p-4">
                  <p className="font-semibold text-slate-950">{company.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {company.taxId
                      ? text(`Татварын дугаар ${company.taxId}`, `Tax ID ${company.taxId}`)
                      : text("Татварын дугааргүй", "No tax ID")}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
