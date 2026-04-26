import { ReactNode } from "react";
import SideBar from "./SideBar";
import { useLanguage } from "@/app/_providers/LanguageProvider";

export const WorkspaceShell = ({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) => {
  const { text } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-8 sm:py-8">
      <SideBar />
      <main className="min-w-0 flex-1 pb-24 md:pb-8">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                {text("Санхүүгийн ажлын орчин", "Accounting Workspace")}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                {description}
              </p>
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};
