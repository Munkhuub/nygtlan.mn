"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/axios";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useLanguage } from "@/app/_providers/LanguageProvider";
import { WorkspaceShell } from "../_components/WorkspaceShell";
import { EmptyCompanyState } from "../_components/EmptyCompanyState";
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

type Account = {
  id: number;
  code: string;
  name: string;
};

type JournalLine = {
  id: number;
  accountId: string;
  debit: string;
  credit: string;
  memo: string;
};

type JournalEntry = {
  id: number;
  entryNumber: string;
  date: string;
  description: string;
  status: "DRAFT" | "POSTED" | "VOID";
  reference?: string | null;
};

const newLine = (id: number): JournalLine => ({
  id,
  accountId: "",
  debit: "",
  credit: "",
  memo: "",
});

export default function JournalEntriesPage() {
  const router = useRouter();
  const { text } = useLanguage();
  const { user, loading, currentCompany, refreshUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [lines, setLines] = useState<JournalLine[]>([newLine(1), newLine(2)]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!currentCompany) {
      setAccounts([]);
      setEntries([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [accountsResponse, entriesResponse] = await Promise.all([
          api.get<ApiEnvelope<Account[]>>(
            `/api/companies/${currentCompany.id}/accounts`,
          ),
          api.get<{
            message: string;
            data: JournalEntry[];
          }>(`/api/companies/${currentCompany.id}/journal-entries?limit=10`),
        ]);

        setAccounts(accountsResponse.data.data);
        setEntries(entriesResponse.data.data);
      } catch (error) {
        console.error("Failed to load journal data", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [currentCompany]);

  const totalDebit = lines.reduce(
    (sum, line) => sum + Number.parseFloat(line.debit || "0"),
    0,
  );
  const totalCredit = lines.reduce(
    (sum, line) => sum + Number.parseFloat(line.credit || "0"),
    0,
  );

  const updateLine = (lineId: number, field: keyof JournalLine, value: string) => {
    setLines((current) =>
      current.map((line) =>
        line.id === lineId ? { ...line, [field]: value } : line,
      ),
    );
  };

  const fetchEntries = async () => {
    if (!currentCompany) {
      return;
    }

    const response = await api.get<{ message: string; data: JournalEntry[] }>(
      `/api/companies/${currentCompany.id}/journal-entries?limit=10`,
    );
    setEntries(response.data.data);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentCompany) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post<ApiEnvelope<JournalEntry>>(
        `/api/companies/${currentCompany.id}/journal-entries`,
        {
          date,
          description,
          reference: reference || undefined,
          lines: lines.map((line) => ({
            accountId: Number(line.accountId),
            debit: Number.parseFloat(line.debit || "0"),
            credit: Number.parseFloat(line.credit || "0"),
            memo: line.memo || undefined,
          })),
        },
      );

      await fetchEntries();
      await refreshUser();
      setDescription("");
      setReference("");
      setLines([newLine(1), newLine(2)]);
    } catch (error) {
      console.error("Failed to create journal entry", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoid = async (entryId: number) => {
    if (!currentCompany) {
      return;
    }

    try {
      await api.patch(
        `/api/companies/${currentCompany.id}/journal-entries/${entryId}/void`,
      );
      await fetchEntries();
    } catch (error) {
      console.error("Failed to void journal entry", error);
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
      title={text("Журналын бичилт", "Journal Entries")}
      description={text(
        "Дансны жагсаалтдаа тулгуурлан тэнцсэн журналын бичилт хийнэ үү. Дебит ба кредит үргэлж тэнцүү байх ёстой.",
        "Post balanced journal entries against your chart of accounts. Debits and credits must always match.",
      )}
    >
      {!currentCompany ? (
        <EmptyCompanyState />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              {text("Бичилт үүсгэх", "Create entry")}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {text(
                "Мөр мөрөөр нь бөглөөд, дебит ба кредит тэнцсэний дараа баталгаажуулна.",
                "Build the entry line by line, then post it once debits and credits balance.",
              )}
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="entryDate">{text("Огноо", "Date")}</Label>
                  <Input
                    id="entryDate"
                    type="date"
                    required
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">{text("Лавлагаа", "Reference")}</Label>
                  <Input
                    id="reference"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder={text("Нэхэмжлэх, баримт гэх мэт", "Invoice, receipt, etc.")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">{text("Тайлбар", "Description")}</Label>
                  <Textarea
                    id="description"
                    required
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={text("Ямар гүйлгээ болсон бэ?", "What happened?")}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {lines.map((line, index) => (
                  <div key={line.id} className="rounded-2xl border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-700">
                        {text(`${index + 1}-р мөр`, `Line ${index + 1}`)}
                      </p>
                      {lines.length > 2 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setLines((current) =>
                              current.filter((currentLine) => currentLine.id !== line.id),
                            )
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      ) : null}
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1.6fr_0.7fr_0.7fr]">
                      <div className="space-y-2">
                        <Label>{text("Данс", "Account")}</Label>
                        <Select
                          value={line.accountId}
                          onValueChange={(value) =>
                            updateLine(line.id, "accountId", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={text("Данс сонгох", "Select account")} />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem
                                key={account.id}
                                value={String(account.id)}
                              >
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{text("Дебит", "Debit")}</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.debit}
                          onChange={(event) =>
                            updateLine(line.id, "debit", event.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{text("Кредит", "Credit")}</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.credit}
                          onChange={(event) =>
                            updateLine(line.id, "credit", event.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label>{text("Мөрийн тайлбар", "Memo")}</Label>
                      <Input
                        value={line.memo}
                        onChange={(event) =>
                          updateLine(line.id, "memo", event.target.value)
                        }
                        placeholder={text("Заавал биш мөрийн тайлбар", "Optional line memo")}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setLines((current) => [...current, newLine(Date.now())])
                  }
                >
                  <Plus className="size-4" />
                  {text("Мөр нэмэх", "Add line")}
                </Button>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                  {text("Дебит", "Debit")} {totalDebit.toFixed(2)} / {text("Кредит", "Credit")} {totalCredit.toFixed(2)}
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-sm ${
                    Math.abs(totalDebit - totalCredit) < 0.01
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {Math.abs(totalDebit - totalCredit) < 0.01
                    ? text("Тэнцсэн", "Balanced")
                    : text(
                        `Зөрүү ${Math.abs(totalDebit - totalCredit).toFixed(2)}`,
                        `Difference ${Math.abs(totalDebit - totalCredit).toFixed(2)}`,
                      )}
                </div>
              </div>

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting
                  ? text("Бичилт хадгалж байна...", "Posting entry...")
                  : text("Журналын бичилт хийх", "Post journal entry")}
              </Button>
            </form>
          </section>

          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              {text("Сүүлийн бичилтүүд", "Recent entries")}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {text(
                "Сонгосон компанийн хамгийн сүүлийн бичилтүүд.",
                "The latest entries for the selected company.",
              )}
            </p>

            <div className="mt-6 space-y-3">
              {isLoading ? (
                <p className="text-sm text-slate-500">
                  {text("Бичилтүүдийг ачаалж байна...", "Loading entries...")}
                </p>
              ) : entries.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  {text("Одоогоор журналын бичилт алга.", "No journal entries yet.")}
                </p>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {entry.entryNumber}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {entry.description}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(entry.date).toLocaleDateString()}
                          {entry.reference ? ` · ${entry.reference}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {entry.status}
                        </span>
                        {entry.status !== "VOID" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleVoid(entry.id)}
                          >
                            {text("Цуцлах", "Void")}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </WorkspaceShell>
  );
}
