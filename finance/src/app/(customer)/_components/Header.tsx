"use client";
import { Building2, Landmark } from "lucide-react";
import Link from "next/link";
import React from "react";
import { HeaderLogOut } from "./HeaderLogOut";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useLanguage } from "@/app/_providers/LanguageProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageToggle } from "@/components/LanguageToggle";

const Header = () => {
  const { user, currentCompanyId, setCurrentCompanyId } = useAuth();
  const { text } = useLanguage();

  return (
    <div className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
      <Link href={"/"}>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-900 p-2 text-white">
            <Landmark className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Ledger Lane</p>
            <p className="text-xs text-slate-500">
              {text(
                "Компанийн нягтлан бодох бүртгэлийн орчин",
                "Company bookkeeping workspace",
              )}
            </p>
          </div>
        </div>
      </Link>
      {!user ? (
        <div className="flex gap-2 sm:gap-3">
          <LanguageToggle />
          <Button size="sm" variant="outline" asChild>
            <Link href="/signin">{text("Нэвтрэх", "Login")}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">{text("Бүртгүүлэх", "Sign Up")}</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <div className="hidden items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 md:flex">
            <Building2 className="size-4 text-slate-500" />
            <Select
              value={currentCompanyId ? String(currentCompanyId) : undefined}
              onValueChange={(value) => setCurrentCompanyId(Number(value))}
            >
              <SelectTrigger className="w-[220px] border-none bg-transparent px-0 shadow-none">
                <SelectValue placeholder={text("Компани сонгох", "Select company")} />
              </SelectTrigger>
              <SelectContent>
                {(user.companies ?? []).map((company) => (
                  <SelectItem key={company.id} value={String(company.id)}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <HeaderLogOut />
        </div>
      )}
      </div>
    </div>
  );
};

export default Header;
