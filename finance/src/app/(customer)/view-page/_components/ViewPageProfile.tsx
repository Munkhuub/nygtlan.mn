import { useAuth } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
import React from "react";
import RecentSupporters from "./RecentSupporters";
import Link from "next/link";

const ViewPageProfile = () => {
  const { user } = useAuth();
  return (
    <div className="w-full md:w-[95%] flex flex-col gap-4 md:gap-5">
      <div className="bg-white p-4 md:p-6 rounded-lg border border-[#F4F4F5]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex gap-3 items-center">
            <img
              className="size-10 md:size-12 rounded-full bg-black object-cover"
              src={user?.profile?.avatarImage || "/default-avatar.png"}
              alt={`${user?.profile?.name}'s avatar`}
            />
            <h5 className="font-bold text-base md:text-lg truncate max-w-[150px] md:max-w-none">
              {user?.profile?.name || "Your Name"}
            </h5>
          </div>
          <Link href={"/account-settings"} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto flex gap-2 bg-[#F4F4F5] text-black hover:bg-[#e0e0e0] text-sm md:text-base">
              Edit page
            </Button>
          </Link>
        </div>

        <div className="border-t border-[#E4E4E7] w-full my-3 md:my-4"></div>

        <h5 className="font-semibold text-base">
          About {user?.profile?.name?.split(" ")[0] || "You"}
        </h5>
        <p className="text-xs md:text-[14px] mt-2">
          {user?.profile?.about ||
            "Add information about yourself in your account settings"}
        </p>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg border border-[#F4F4F5]">
        <h5 className="font-semibold text-base">Social media URL</h5>
        <p className="text-xs md:text-[14px] text-gray-600 mt-2 truncate">
          {user?.profile?.socialMediaUrl || "No social link added"}
        </p>
      </div>

      <RecentSupporters />
    </div>
  );
};

export default ViewPageProfile;
