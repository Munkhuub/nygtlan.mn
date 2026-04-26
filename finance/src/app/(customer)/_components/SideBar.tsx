"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Building2, FileText, Home, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/_providers/LanguageProvider";

const SideBar = () => {
  const pathname = usePathname();
  const { text } = useLanguage();

  const menuItems = [
    { name: text("Нүүр", "Home"), icon: <Home className="size-4" />, path: "/" },
    {
      name: text("Компаниуд", "Companies"),
      icon: <Building2 className="size-4" />,
      path: "/companies/new",
    },
    {
      name: text("Дансууд", "Accounts"),
      icon: <BookOpen className="size-4" />,
      path: "/accounts",
    },
    {
      name: text("Журнал", "Journal"),
      icon: <Receipt className="size-4" />,
      path: "/journal-entries",
    },
    {
      name: text("Тайлан", "Reports"),
      icon: <FileText className="size-4" />,
      path: "/reports",
    },
  ];

  return (
    <>
      <div className="hidden md:flex md:w-64 md:flex-col md:gap-1 md:px-6 md:py-10">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
              pathname === item.path && "bg-slate-900 text-white hover:bg-slate-900",
            )}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 md:hidden">
        <div className="flex items-center justify-around py-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "flex w-full max-w-[100px] flex-col items-center rounded-lg p-2 text-slate-500",
                pathname === item.path && "text-slate-950",
              )}
            >
              <span>{item.icon}</span>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideBar;
