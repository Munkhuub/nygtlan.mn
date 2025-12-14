"use client";

import { loginSchema } from "../FormProvider";
import Banner from "../signup/_components/Banner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/_providers/AuthProvider";
import { toast } from "sonner";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Home() {
  const { signIn } = useAuth();
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
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full lg:w-[1440px] m-auto relative flex flex-col lg:flex-row min-h-screen">
      <Banner />
      <Link href="/signup">
        <Button
          variant="secondary"
          className="absolute top-6 right-4 lg:top-8 lg:right-20 text-xs lg:text-sm"
          size="sm"
        >
          Sign Up
        </Button>
      </Link>
      <div className="w-full lg:w-[50%] p-4 lg:p-5 flex justify-center items-center lg:items-start lg:justify-start lg:h-screen">
        <form
          className="w-full max-w-[407px] mt-10 lg:mt-[246px] lg:ml-20 flex flex-col gap-4 lg:gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <h3 className="text-xl lg:text-2xl font-semibold">Welcome Back</h3>
          </div>
          <div className="flex flex-col gap-3 lg:gap-4">
            <div className="flex flex-col gap-1 lg:gap-2">
              <label className="text-xs lg:text-sm font-medium">Email</label>
              <div className="w-full h-9 px-3 py-2 border-[1px] border-[#E4E4E7] rounded-md">
                <input
                  type="email"
                  placeholder="Enter your mail address"
                  className="h-5 flex items-center text-xs lg:text-[14px] w-full border-none outline-none"
                  {...register("email")}
                />
              </div>
              {formState.errors.email && (
                <div className="text-[#E14942] text-xs lg:text-[14px]">
                  {formState.errors.email.message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1 lg:gap-2">
              <label className="text-xs lg:text-sm font-medium">Password</label>
              <div className="w-full h-9 px-3 py-2 border-[1px] border-[#E4E4E7] rounded-md">
                <input
                  type="password"
                  placeholder="Password"
                  className="h-5 flex items-center text-xs lg:text-[14px] w-full border-none outline-none"
                  {...register("password")}
                />
              </div>
              {formState.errors.password && (
                <div className="text-[#E14942] text-xs lg:text-[14px]">
                  {formState.errors.password.message}
                </div>
              )}
            </div>
          </div>
          <Button
            className={`w-full transition-none hover:bg-black hover:text-black text-xs lg:text-sm ${
              formState.isValid && !isSubmitting
                ? "bg-black text-white"
                : "bg-[#d1d1d1] text-[white] hover:bg-[#d1d1d1] hover:text-white"
            }`}
            type="submit"
            disabled={!formState.isValid || isSubmitting}
            size="sm"
          >
            {isSubmitting ? "Logging In..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
