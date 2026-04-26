"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ClipboardCheck,
  Receipt,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useLanguage } from "@/app/_providers/LanguageProvider";
import { WorkspaceShell } from "./_components/WorkspaceShell";
import { EmptyCompanyState } from "./_components/EmptyCompanyState";
import { StatCard } from "./_components/StatCard";

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

type JournalEntry = {
  id: number;
  entryNumber: string;
  date: string;
  description: string;
  status: "DRAFT" | "POSTED" | "VOID";
};

type JournalResponse = {
  data: JournalEntry[];
};

type IncomeStatement = {
  totalRevenue: number;
  totalCOGS: number;
  totalExpenses: number;
  grossProfit: number;
  netIncome: number;
  period: {
    startDate: string;
    endDate: string;
  };
};

const formatMoney = (value: number, currency = "MNT") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "MNT" ? 0 : 2,
  }).format(value);

export default function Home() {
  const router = useRouter();
  const { text } = useLanguage();
  const { user, loading, currentCompany } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!currentCompany) {
      setEntries([]);
      setIncomeStatement(null);
      return;
    }

    const fetchDashboard = async () => {
      setIsLoading(true);

      try {
        const [entriesResponse, incomeResponse] = await Promise.all([
          api.get<JournalResponse>(
            `/api/companies/${currentCompany.id}/journal-entries?limit=5`,
          ),
          api.get<ApiEnvelope<IncomeStatement>>(
            `/api/companies/${currentCompany.id}/reports/income-statement`,
          ),
        ]);

        setEntries(entriesResponse.data.data);
        setIncomeStatement(incomeResponse.data.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboard();
  }, [currentCompany]);

  if (loading || (!user && !loading)) {
    return (
      <div className="p-8 text-sm text-slate-600">
        {text("Ажлын орчныг ачаалж байна...", "Loading workspace...")}
      </div>
    );
  }

  const journalCount = currentCompany?._count?.journalEntries ?? 0;
  const accountCount = currentCompany?._count?.accounts ?? 0;
  const taxIdHint = currentCompany?.taxId
    ? text(`Татварын дугаар ${currentCompany.taxId}`, `Tax ID ${currentCompany.taxId}`)
    : text("Татварын дугаар оруулаагүй", "No tax ID yet");

  const workflowItems = currentCompany
    ? [
        {
          title: text("Дансны бүтэц шалгах", "Review account structure"),
          description: text(
            "Монгол үндсэн дансны жагсаалт ачаалсан эсэхээ нягтлаарай.",
            "Make sure the default Mongolian chart is loaded and adjusted for the company.",
          ),
          href: "/accounts",
        },
        {
          title: text("Өдрийн журнал бүртгэх", "Post daily journals"),
          description: text(
            "Гүйлгээ бүрийг тэнцсэн дебит, кредитээр оруулна.",
            "Capture each transaction with balanced debits and credits.",
          ),
          href: "/journal-entries",
        },
        {
          title: text("Тайлангаа шалгах", "Review statements"),
          description: text(
            "Баланс, орлогын тайлангаа үеийн дүнгээр нягтална.",
            "Check the balance sheet and income statement for the selected period.",
          ),
          href: "/reports",
        },
      ]
    : [];

  return (
    <WorkspaceShell
      title={text("Ерөнхий тойм", "Overview")}
      description={text(
        "Энэ самбараас компанийн тохиргоо, сүүлийн журналын хөдөлгөөн, одоогийн орлогын тайланг хянаарай.",
        "Use this dashboard to keep an eye on company setup, recent journal activity, and the current income statement.",
      )}
      actions={
        currentCompany ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/accounts">{text("Данс удирдах", "Manage accounts")}</Link>
            </Button>
            <Button asChild className="bg-[#183B34] hover:bg-[#244B43]">
              <Link href="/journal-entries">
                {text("Шинэ журналын бичилт", "New journal entry")}
              </Link>
            </Button>
          </div>
        ) : null
      }
    >
      {!currentCompany ? (
        <EmptyCompanyState />
      ) : (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[32px] border border-[#dce3da] bg-[linear-gradient(135deg,#183B34_0%,#244B43_46%,#f2e3b2_46%,#f7f3e8_100%)] shadow-[0_28px_70px_rgba(24,59,52,0.14)]">
            <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                  <Sparkles className="size-4" />
                  {text("Ажлын төв самбар", "Workspace pulse")}
                </div>
                <h2 className="mt-5 text-3xl font-semibold leading-tight lg:text-4xl">
                  {currentCompany.name}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                  {text(
                    "Өнөөдрийн ажил: дансны бүтэц, журналын урсгал, ашиг алдагдлын зураглалыг нэг дороос хянаарай.",
                    "Today's view keeps your account structure, journal activity, and profitability in one place.",
                  )}
                </p>

                <p className="mt-6 max-w-xl text-sm leading-6 text-white/70">
                  {text(
                    `Компанийн суурь мэдээлэл: ${currentCompany.baseCurrency ?? "MNT"} суурь валют, ${text(
                      `${currentCompany.fiscalYearStart ?? 1}-р сард`,
                      `month ${currentCompany.fiscalYearStart ?? 1}`,
                    )} санхүүгийн жил эхэлнэ. ${taxIdHint}.`,
                    `Company context: base currency is ${currentCompany.baseCurrency ?? "MNT"}, fiscal year starts in month ${currentCompany.fiscalYearStart ?? 1}. ${taxIdHint}.`,
                  )}
                </p>
              </div>

              <div className="rounded-[28px] border border-[#183B34]/8 bg-[#fbfaf6] p-5 text-[#183B34]">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ClipboardCheck className="size-4 text-[#b78818]" />
                  {text("Дараагийн алхмууд", "Next steps")}
                </div>
                <div className="mt-4 space-y-3">
                  {workflowItems.map((item, index) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block rounded-2xl border border-[#183B34]/10 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf4ef] text-sm font-semibold text-[#244B43]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label={text("Идэвхтэй компани", "Active company")}
              value={currentCompany.name}
              hint={taxIdHint}
              icon={<Building2 className="size-4" />}
            />
            <StatCard
              label={text("Дансууд", "Accounts")}
              value={String(accountCount)}
              hint={text("Одоогоор үүсгэсэн дансууд", "Chart of accounts created so far")}
              icon={<BookOpen className="size-4" />}
            />
            <StatCard
              label={text("Журналын бичилт", "Journal entries")}
              value={String(journalCount)}
              hint={text("Баталсан, ноорог, цуцалсан бичилтүүд", "Posted, draft, and void entries")}
              icon={<Receipt className="size-4" />}
            />
            <StatCard
              label={text("Цэвэр ашиг", "Net income")}
              value={formatMoney(
                incomeStatement?.netIncome ?? 0,
                currentCompany.baseCurrency ?? "MNT",
              )}
              hint={
                incomeStatement
                  ? text(
                      `${incomeStatement.period.startDate} - ${incomeStatement.period.endDate}`,
                      `${incomeStatement.period.startDate} to ${incomeStatement.period.endDate}`,
                    )
                  : text("Одоогийн хугацаа", "Current period")
              }
              icon={<TrendingUp className="size-4" />}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-[28px] border border-[#dde5dc] bg-white p-6 shadow-[0_18px_48px_rgba(24,59,52,0.08)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    {text("Сүүлийн журналын бичилтүүд", "Recent journal entries")}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {text(
                      `${currentCompany.name} компанийн хамгийн сүүлийн журналын хөдөлгөөн.`,
                      `The latest activity posted against ${currentCompany.name}.`,
                    )}
                  </p>
                </div>
                <Button variant="ghost" asChild className="justify-start md:justify-center">
                  <Link href="/journal-entries">
                    {text("Журнал нээх", "Open journal")}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                {isLoading ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    {text("Журналын бичилтүүдийг ачаалж байна...", "Loading journal entries...")}
                  </p>
                ) : entries.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {text(
                      "Одоогоор журналын бичилт алга. Эхний тэнцсэн бичилтээ үүсгээд бүртгэлээ эхлүүлнэ үү.",
                      "No journal entries yet. Create your first balanced entry to start the ledger.",
                    )}
                  </p>
                ) : (
                  entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col gap-3 rounded-2xl border border-[#e8ece7] bg-[#fcfdfc] p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {entry.entryNumber}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {entry.description}
                        </p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-sm font-medium text-slate-700">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            entry.status === "POSTED"
                              ? "bg-[#edf4ef] text-[#244B43]"
                              : entry.status === "VOID"
                                ? "bg-[#fbe9e7] text-[#a23b32]"
                                : "bg-[#fff4d8] text-[#8a6513]"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-[#dde5dc] bg-white p-6 shadow-[0_18px_48px_rgba(24,59,52,0.08)]">
                <h2 className="text-xl font-semibold text-slate-950">
                  {text("Орлогын тайлангийн товч", "Income statement snapshot")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {text(
                    "Орлого, зардал, ашгийн хурдан тойм.",
                    "A quick read on revenue, costs, and profitability.",
                  )}
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    [text("Орлого", "Revenue"), incomeStatement?.totalRevenue ?? 0],
                    [text("Борлуулалтын өртөг", "Cost of goods sold"), incomeStatement?.totalCOGS ?? 0],
                    [text("Зардал", "Expenses"), incomeStatement?.totalExpenses ?? 0],
                    [text("Нийт ашиг", "Gross profit"), incomeStatement?.grossProfit ?? 0],
                    [text("Цэвэр ашиг", "Net income"), incomeStatement?.netIncome ?? 0],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                        index === 4
                          ? "bg-[#183B34] text-white"
                          : "bg-slate-50 text-slate-950"
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          index === 4 ? "text-white/80" : "text-slate-600"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-sm font-semibold">
                        {formatMoney(
                          Number(value),
                          currentCompany.baseCurrency ?? "MNT",
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <Button className="mt-6 w-full" variant="outline" asChild>
                  <Link href="/reports">
                    {text("Бүх тайланг нээх", "Open full reports")}
                  </Link>
                </Button>
              </section>

              <section className="rounded-[28px] border border-[#dde5dc] bg-[linear-gradient(180deg,#f7f3e8_0%,#ffffff_100%)] p-6 shadow-[0_18px_48px_rgba(24,59,52,0.08)]">
                <h2 className="text-xl font-semibold text-slate-950">
                  {text("Хурдан үйлдлүүд", "Quick actions")}
                </h2>
                <div className="mt-4 grid gap-3">
                  {[
                    {
                      title: text("Дансны жагсаалт", "Chart of accounts"),
                      href: "/accounts",
                    },
                    {
                      title: text("Журналын бичилт", "Journal entries"),
                      href: "/journal-entries",
                    },
                    {
                      title: text("Тайлангууд", "Reports"),
                      href: "/reports",
                    },
                  ].map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl border border-[#183B34]/10 bg-white px-4 py-4 text-sm font-medium text-[#183B34] transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span>{item.title}</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
