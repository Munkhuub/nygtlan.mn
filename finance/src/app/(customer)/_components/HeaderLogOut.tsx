"use client";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useLanguage } from "@/app/_providers/LanguageProvider";
import { Button } from "@/components/ui/button";

export function HeaderLogOut() {
  const { user, signOut, loading } = useAuth();
  const { text } = useLanguage();
  if (loading) {
    return null;
  }
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-slate-900">{user?.username}</p>
        <p className="text-xs text-slate-500">{user?.email}</p>
      </div>
      <Button variant="outline" onClick={() => signOut()} type="button">
        {text("Гарах", "Log out")}
      </Button>
    </div>
  );
}
