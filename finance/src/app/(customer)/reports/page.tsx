"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/axios";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useLanguage } from "@/app/_providers/LanguageProvider";
import { WorkspaceShell } from "../_components/WorkspaceShell";
import { EmptyCompanyState } from "../_components/EmptyCompanyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

type TrialBalanceAccount = {
  id: number;
  code: string;
  name: string;
  debit: number;
  credit: number;
  balance: number;
};

type TrialBalance = {
  accounts: TrialBalanceAccount[];
  totals: {
    debit: number;
    credit: number;
    balanced: boolean;
  };
};

type IncomeStatement = {
  revenue: { id: number; code: string; name: string; balance: number }[];
  costOfGoodsSold: { id: number; code: string; name: string; balance: number }[];
  expenses: { id: number; code: string; name: string; balance: number }[];
  totalRevenue: number;
  totalCOGS: number;
  totalExpenses: number;
  grossProfit: number;
  netIncome: number;
};

type BalanceSheetSection = {
  current?: { id: number; code: string; name: string; balance: number }[];
  nonCurrent?: { id: number; code: string; name: string; balance: number }[];
  items?: { id: number; code: string; name: string; balance: number }[];
  total: number;
};

type BalanceSheet = {
  assets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  equity: BalanceSheetSection;
  isBalanced: boolean;
  difference: number;
};

const today = new Date().toISOString().split("T")[0];
const yearStart = `${new Date().getFullYear()}-01-01`;

export default function ReportsPage() {
  const router = useRouter();
  const { text } = useLanguage();
  const { user, loading, currentCompany } = useAuth();
  const [startDate, setStartDate] = useState(yearStart);
  const [endDate, setEndDate] = useState(today);
  const [asOfDate, setAsOfDate] = useState(today);
  const [isLoading, setIsLoading] = useState(false);
  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(
    null,
  );
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);

  const currency = currentCompany?.baseCurrency ?? "MNT";
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "MNT" ? 0 : 2,
    }).format(value);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, router, user]);

  const loadReports = async () => {
    if (!currentCompany) {
      return;
    }

    setIsLoading(true);

    try {
      const [trialBalanceResponse, incomeStatementResponse, balanceSheetResponse] =
        await Promise.all([
          api.get<ApiEnvelope<TrialBalance>>(
            `/api/companies/${currentCompany.id}/reports/trial-balance`,
            { params: { startDate, endDate } },
          ),
          api.get<ApiEnvelope<IncomeStatement>>(
            `/api/companies/${currentCompany.id}/reports/income-statement`,
            { params: { startDate, endDate } },
          ),
          api.get<ApiEnvelope<BalanceSheet>>(
            `/api/companies/${currentCompany.id}/reports/balance-sheet`,
            { params: { date: asOfDate } },
          ),
        ]);

      setTrialBalance(trialBalanceResponse.data.data);
      setIncomeStatement(incomeStatementResponse.data.data);
      setBalanceSheet(balanceSheetResponse.data.data);
    } catch (error) {
      console.error("Failed to load reports", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentCompany) {
      void loadReports();
    } else {
      setTrialBalance(null);
      setIncomeStatement(null);
      setBalanceSheet(null);
    }
  }, [currentCompany]);

  if (loading || (!user && !loading)) {
    return (
      <div className="p-8 text-sm text-slate-600">
        {text("Ажлын орчныг ачаалж байна...", "Loading workspace...")}
      </div>
    );
  }

  return (
    <WorkspaceShell
      title={text("Тайлангууд", "Reports")}
      description={text(
        "Backend дээр тооцоологдсон стандарт санхүүгийн тайлангуудаар бүртгэлээ харна уу.",
        "Read the books through the standard accounting reports that are already computed by the backend.",
      )}
      actions={
        currentCompany ? (
          <Button disabled={isLoading} onClick={() => void loadReports()}>
            {isLoading ? text("Шинэчилж байна...", "Refreshing...") : text("Тайлан шинэчлэх", "Refresh reports")}
          </Button>
        ) : null
      }
    >
      {!currentCompany ? (
        <EmptyCompanyState />
      ) : (
        <div className="space-y-6">
          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              {text("Шүүлтүүр", "Filters")}
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">{text("Эхлэх огноо", "Start date")}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">{text("Дуусах огноо", "End date")}</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asOfDate">
                  {text("Балансын тайлангийн огноо", "Balance sheet date")}
                </Label>
                <Input
                  id="asOfDate"
                  type="date"
                  value={asOfDate}
                  onChange={(event) => setAsOfDate(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                {text("Шалгах баланс", "Trial balance")}
              </h2>
            <div className="mt-6 overflow-hidden rounded-2xl border">
              <table className="min-w-full divide-y text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">{text("Код", "Code")}</th>
                    <th className="px-4 py-3 font-medium">{text("Данс", "Account")}</th>
                    <th className="px-4 py-3 font-medium">{text("Дебит", "Debit")}</th>
                    <th className="px-4 py-3 font-medium">{text("Кредит", "Credit")}</th>
                    <th className="px-4 py-3 font-medium">{text("Үлдэгдэл", "Balance")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {trialBalance?.accounts?.map((account) => (
                    <tr key={account.id}>
                      <td className="px-4 py-3 font-medium text-slate-950">
                        {account.code}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{account.name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatMoney(account.debit)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatMoney(account.credit)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatMoney(account.balance)}
                      </td>
                    </tr>
                  ))}
                  {!trialBalance?.accounts?.length ? (
                    <tr>
                      <td className="px-4 py-6 text-slate-500" colSpan={5}>
                        {text("Одоогоор шалгах балансын мэдээлэл алга.", "No trial balance data yet.")}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            {trialBalance ? (
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-4 py-2">
                  {text("Нийт дебит", "Total debit")} {formatMoney(trialBalance.totals.debit)}
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2">
                  {text("Нийт кредит", "Total credit")} {formatMoney(trialBalance.totals.credit)}
                </span>
                <span
                  className={`rounded-full px-4 py-2 ${
                    trialBalance.totals.balanced
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {trialBalance.totals.balanced
                    ? text("Тэнцсэн", "Balanced")
                    : text("Тэнцээгүй", "Out of balance")}
                </span>
              </div>
            ) : null}
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                {text("Орлогын тайлан", "Income statement")}
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  [text("Орлого", "Revenue"), incomeStatement?.totalRevenue ?? 0],
                  [text("Борлуулалтын өртөг", "Cost of goods sold"), incomeStatement?.totalCOGS ?? 0],
                  [text("Зардал", "Expenses"), incomeStatement?.totalExpenses ?? 0],
                  [text("Нийт ашиг", "Gross profit"), incomeStatement?.grossProfit ?? 0],
                  [text("Цэвэр ашиг", "Net income"), incomeStatement?.netIncome ?? 0],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm text-slate-600">{label}</span>
                    <span className="text-sm font-semibold text-slate-950">
                      {formatMoney(Number(value))}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                {text("Балансын тайлан", "Balance sheet")}
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    {text("Хөрөнгө", "Assets")}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {text("Нийт", "Total")} {formatMoney(balanceSheet?.assets.total ?? 0)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    {text("Өр төлбөр", "Liabilities")}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {text("Нийт", "Total")} {formatMoney(balanceSheet?.liabilities.total ?? 0)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    {text("Эзэмшигчийн өмч", "Equity")}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {text("Нийт", "Total")} {formatMoney(balanceSheet?.equity.total ?? 0)}
                  </p>
                </div>
                <div
                  className={`rounded-2xl p-4 text-sm ${
                    balanceSheet?.isBalanced
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {balanceSheet?.isBalanced
                    ? text("Балансын тайлан тэнцэж байна.", "Balance sheet is balanced.")
                    : text(
                        `Зөрүү ${formatMoney(balanceSheet?.difference ?? 0)}`,
                        `Difference ${formatMoney(balanceSheet?.difference ?? 0)}`,
                      )}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
