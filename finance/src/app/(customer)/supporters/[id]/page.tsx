"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export type DonationDetails = {
  amounts: number[];
  recipientName: string | undefined;
  message: string | undefined;
};

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
        This page is no longer used
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        The project now runs as an accounting workspace rather than a supporter
        page flow. Use the main dashboard to manage companies, accounts, journal
        entries, and reports.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/">Open dashboard</Link>
      </Button>
    </div>
  );
}
