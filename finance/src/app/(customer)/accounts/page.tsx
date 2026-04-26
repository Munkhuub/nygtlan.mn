"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

type DefaultAccountsLoadResult = {
  insertedCount: number;
  skippedCount: number;
  totalDefaultCount: number;
  totalCompanyAccounts: number;
};

type Account = {
  id: number;
  code: string;
  name: string;
  type: string;
  normalSide: "DEBIT" | "CREDIT";
  description?: string | null;
  parentId?: number | null;
  level: number;
  parent?: {
    id: number;
    code: string;
    name: string;
  } | null;
};

const accountTypes = [
  "CURRENT_ASSET",
  "NON_CURRENT_ASSET",
  "CURRENT_LIABILITY",
  "NON_CURRENT_LIABILITY",
  "EQUITY",
  "REVENUE",
  "EXPENSE",
  "COST_OF_GOODS_SOLD",
] as const;

export default function AccountsPage() {
  const router = useRouter();
  const { text } = useLanguage();
  const { user, loading, currentCompany, refreshUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "CURRENT_ASSET",
    normalSide: "DEBIT",
    parentId: "none",
    level: "0",
    description: "",
    isTaxAccount: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, router, user]);

  const fetchAccounts = async (companyId: number) => {
    setIsLoading(true);

    try {
      const response = await api.get<ApiEnvelope<Account[]>>(
        `/api/companies/${companyId}/accounts`,
      );
      setAccounts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentCompany) {
      setAccounts([]);
      return;
    }

    void fetchAccounts(currentCompany.id);
  }, [currentCompany]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentCompany) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post<ApiEnvelope<Account>>(
        `/api/companies/${currentCompany.id}/accounts`,
        {
          code: form.code,
          name: form.name,
          type: form.type,
          normalSide: form.normalSide,
          parentId: form.parentId === "none" ? undefined : Number(form.parentId),
          level: Number(form.level),
          description: form.description || undefined,
          isTaxAccount: form.isTaxAccount,
        },
      );

      await fetchAccounts(currentCompany.id);
      await refreshUser();
      setForm({
        code: "",
        name: "",
        type: "CURRENT_ASSET",
        normalSide: "DEBIT",
        parentId: "none",
        level: "0",
        description: "",
        isTaxAccount: false,
      });
    } catch (error) {
      console.error("Failed to create account", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadDefaults = async () => {
    if (!currentCompany) {
      return;
    }

    setIsLoadingDefaults(true);

    try {
      const response = await api.post<ApiEnvelope<DefaultAccountsLoadResult>>(
        `/api/companies/${currentCompany.id}/accounts/load-defaults`,
      );
      await fetchAccounts(currentCompany.id);
      await refreshUser();

      const result = response.data.data;
      const message =
        result.insertedCount > 0
          ? text(
              `${result.insertedCount} үндсэн данс нэмэгдлээ.`,
              `${result.insertedCount} default accounts were added.`,
            )
          : text(
              "Бүх үндсэн данс аль хэдийн ачаалагдсан байна.",
              "The default chart is already loaded.",
            );

      toast.success(message);
    } catch (error) {
      console.error("Failed to load default accounts", error);
      toast.error(
        text(
          "Үндсэн дансны жагсаалтыг ачаалж чадсангүй.",
          "Could not load the default chart of accounts.",
        ),
      );
    } finally {
      setIsLoadingDefaults(false);
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
      title={text("Дансны жагсаалт", "Chart of Accounts")}
      description={text(
        "Компанийн ашиглах дансны бүтцийг үүсгэнэ үү. Журналын мөр бүр эдгээр дансны аль нэгийг заавал ашиглана.",
        "Create the account structure your company will post into. Every journal line must reference one of these accounts.",
      )}
    >
      {!currentCompany ? (
        <EmptyCompanyState />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              {text("Шинэ данс", "New account")}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {text(
                "Код, нэр, төрөл, хэвийн үлдэгдлийн талыг оруулна уу.",
                "Add a code, name, type, and normal balance side.",
              )}
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">{text("Код", "Code")}</Label>
                  <Input
                    id="code"
                    required
                    value={form.code}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, code: event.target.value }))
                    }
                    placeholder="1010"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">{text("Нэр", "Name")}</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder={text("Касс", "Cash")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">{text("Дансны төрөл", "Account type")}</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, type: value }))
                    }
                  >
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder={text("Төрөл сонгох", "Select type")} />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="normalSide">
                    {text("Хэвийн тал", "Normal side")}
                  </Label>
                  <Select
                    value={form.normalSide}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        normalSide: value as "DEBIT" | "CREDIT",
                      }))
                    }
                  >
                    <SelectTrigger id="normalSide" className="w-full">
                      <SelectValue placeholder={text("Тал сонгох", "Select normal side")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEBIT">DEBIT</SelectItem>
                      <SelectItem value="CREDIT">CREDIT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentId">{text("Эцэг данс", "Parent account")}</Label>
                  <Select
                    value={form.parentId}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, parentId: value }))
                    }
                  >
                    <SelectTrigger id="parentId" className="w-full">
                      <SelectValue placeholder={text("Заавал биш", "Optional")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{text("Эцэг дансгүй", "No parent")}</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={String(account.id)}>
                          {account.code} - {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">{text("Түвшин", "Hierarchy level")}</Label>
                  <Input
                    id="level"
                    type="number"
                    min="0"
                    value={form.level}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, level: event.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">{text("Тайлбар", "Description")}</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder={text("Заавал биш тайлбар", "Optional account note")}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.isTaxAccount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isTaxAccount: event.target.checked,
                    }))
                  }
                />
                {text("Татвартай холбоотой данс гэж тэмдэглэх", "Mark this as a tax-related account")}
              </label>

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting
                  ? text("Данс үүсгэж байна...", "Creating account...")
                  : text("Данс үүсгэх", "Create account")}
              </Button>
            </form>
          </section>

          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  {text("Одоогийн дансууд", "Existing accounts")}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {text(
                    "Эдгээр идэвхтэй дансуудыг журналын бичилтэд ашиглана.",
                    "These are the active accounts available for journal posting.",
                  )}
                </p>
              </div>

              <Button
                disabled={isLoadingDefaults}
                onClick={handleLoadDefaults}
                type="button"
                variant="outline"
              >
                {isLoadingDefaults
                  ? text("Үндсэн данс ачаалж байна...", "Loading defaults...")
                  : text("Монгол үндсэн данс ачаалах", "Load Mongolian defaults")}
              </Button>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border">
              <table className="min-w-full divide-y text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">{text("Код", "Code")}</th>
                    <th className="px-4 py-3 font-medium">{text("Нэр", "Name")}</th>
                    <th className="px-4 py-3 font-medium">{text("Төрөл", "Type")}</th>
                    <th className="px-4 py-3 font-medium">
                      {text("Хэвийн тал", "Normal side")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white">
                  {isLoading ? (
                    <tr>
                      <td className="px-4 py-6 text-slate-500" colSpan={4}>
                        {text("Дансуудыг ачаалж байна...", "Loading accounts...")}
                      </td>
                    </tr>
                  ) : accounts.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-slate-500" colSpan={4}>
                        {text("Одоогоор данс алга.", "No accounts yet.")}
                      </td>
                    </tr>
                  ) : (
                    accounts.map((account) => (
                      <tr key={account.id}>
                        <td className="px-4 py-3 font-medium text-slate-950">
                          {account.code}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {account.name}
                          {account.parent ? (
                            <span className="ml-2 text-xs text-slate-400">
                              {text(
                                `Эцэг: ${account.parent.code}`,
                                `Parent: ${account.parent.code}`,
                              )}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{account.type}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {account.normalSide}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </WorkspaceShell>
  );
}
