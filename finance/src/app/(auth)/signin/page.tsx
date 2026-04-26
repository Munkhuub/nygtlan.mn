"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { loginSchema } from "../FormProvider";
import Banner from "../signup/_components/Banner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useLanguage } from "@/app/_providers/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Home() {
  const { signIn } = useAuth();
  const { text } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        text(
          "Нэвтрэхэд алдаа гарлаа. Нэвтрэх мэдээллээ шалгана уу.",
          "Login failed. Please check your credentials.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col bg-[#f5f1e7] lg:flex-row">
      <Banner />

      <div className="relative flex w-full items-center justify-center px-4 py-8 sm:px-8 lg:w-[50%] lg:px-12 xl:px-16">
        <div className="absolute right-4 top-6 z-20 flex items-center gap-2 sm:right-8 lg:right-12 xl:right-16">
          <LanguageToggle />
          <Link href="/signup">
            <Button
              variant="secondary"
              className="border border-slate-200 bg-white/90 text-xs shadow-sm lg:text-sm"
              size="sm"
            >
              {text("Бүртгүүлэх", "Sign Up")}
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-[480px] rounded-[32px] border border-[#d8d2c4] bg-white p-6 shadow-[0_32px_90px_rgba(24,59,52,0.12)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b7f62]">
                {text("Нэвтрэх", "Sign in")}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#183B34]">
                {text("Тавтай морилно уу", "Welcome back")}
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                {text(
                  "Санхүүгийн ажлын орчиндоо нэвтэрч данс, журнал, тайлангаа үргэлжлүүлэн удирдаарай.",
                  "Sign in to continue managing your accounts, journals, and reports.",
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 rounded-3xl bg-[#f7f3e8] p-4 text-sm text-[#244B43]">
            {[
              text("Монгол үндсэн дансны бүтэц", "Default Mongolian chart of accounts"),
              text("Тэнцсэн журналын бичилт", "Balanced journal posting"),
              text("Баланс ба орлогын тайлан", "Balance sheet and income statement"),
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="size-4 shrink-0 text-[#b78818]" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                {text("Имэйл", "Email")}
              </label>
              <input
                type="email"
                placeholder={text(
                  "Имэйл хаягаа оруулна уу",
                  "Enter your email address",
                )}
                className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#285D53] focus:ring-4 focus:ring-[#285D53]/10"
                {...register("email")}
              />
              {formState.errors.email ? (
                <div className="text-sm text-[#E14942]">
                  {formState.errors.email.message}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                {text("Нууц үг", "Password")}
              </label>
              <input
                type="password"
                placeholder={text("Нууц үгээ оруулна уу", "Enter your password")}
                className="h-12 rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#285D53] focus:ring-4 focus:ring-[#285D53]/10"
                {...register("password")}
              />
              {formState.errors.password ? (
                <div className="text-sm text-[#E14942]">
                  {formState.errors.password.message}
                </div>
              ) : null}
            </div>

            <Button
              className="mt-2 h-12 rounded-2xl bg-[#183B34] text-sm font-medium text-white hover:bg-[#244B43]"
              type="submit"
              disabled={!formState.isValid || isSubmitting}
            >
              {isSubmitting
                ? text("Нэвтэрч байна...", "Signing in...")
                : text("Нэвтрэх", "Sign in")}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            {text("Шинэ хэрэглэгч үү?", "New here?")}{" "}
            <Link href="/signup" className="font-medium text-[#183B34] underline-offset-4 hover:underline">
              {text("Бүртгэл үүсгэх", "Create an account")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
