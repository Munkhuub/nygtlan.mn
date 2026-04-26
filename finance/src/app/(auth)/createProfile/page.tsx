"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/companies/new");
  }, [router]);

  return <div className="p-8 text-sm text-slate-600">Redirecting...</div>;
}
