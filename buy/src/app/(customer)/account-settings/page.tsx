"use client";

import { useAuth } from "@/app/_providers/AuthProvider";
import SideBar from "../_components/SideBar";
import { ChangePassword } from "./_components/ChangePassword";
import PaymentSettings from "./_components/PaymentSettings";
import ProfileSettings from "./_components/ProfileSettings";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SuccessMessage from "./_components/SuccessMessage";

export default function Home() {
  const { user, loading } = useAuth();

  const router = useRouter();
  if (!user && loading) {
    router.push("/signin");
    toast("Login to edit profile");
  }
  return (
    <div className="w-full flex md:ml-20">
      <SideBar />
      <div className="flex flex-col gap-8">
        <ProfileSettings />
        <ChangePassword />
        <PaymentSettings />
        <SuccessMessage />
      </div>
    </div>
  );
}
