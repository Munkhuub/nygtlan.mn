import { ReactNode } from "react";

export const StatCard = ({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}) => {
  return (
    <div className="rounded-[28px] border border-[#dfe6de] bg-[linear-gradient(180deg,#ffffff_0%,#f7faf8_100%)] p-5 shadow-[0_18px_40px_rgba(24,59,52,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-3 h-1 w-12 rounded-full bg-[#d6b257]" />
        </div>
        {icon ? (
          <div className="rounded-2xl bg-[#edf4ef] p-2 text-[#244B43]">{icon}</div>
        ) : null}
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </div>
  );
};
