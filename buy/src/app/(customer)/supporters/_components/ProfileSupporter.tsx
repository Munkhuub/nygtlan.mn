import { Profile } from "@/app/_providers/AuthProvider";
import React from "react";
import RecentSupporters from "./RecentSupporters";

type ProfileSupporterProps = {
  profile?: Profile;
};

const ProfileSupporter = ({ profile }: ProfileSupporterProps) => {
  return (
    <div className="w-full md:w-[50%] flex flex-col gap-5">
      <div className="bg-white p-4 md:p-6 rounded-lg border border-[#F4F4F5]">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            {profile?.avatarImage ? (
              <img
                className="size-10 md:size-12 rounded-full bg-black object-cover"
                src={profile.avatarImage}
                alt={`${profile.name} avatar`}
              />
            ) : (
              <div className="size-10 md:size-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-white font-semibold text-base md:text-lg">
                  {profile?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
            )}
            <h5 className="font-bold text-sm md:text-base">{profile?.name}</h5>
          </div>
        </div>
        <div className="border-t border-[#E4E4E7] w-full my-3 md:my-4"></div>
        <h5 className="font-semibold text-sm md:text-base">
          About {profile?.name || "Creator"}
        </h5>
        <p className="text-xs md:text-[14px]">{profile?.about}</p>
      </div>

      {profile?.socialMediaUrl && (
        <div className="bg-white p-4 md:p-6 rounded-lg border border-[#F4F4F5]">
          <h5 className="font-semibold text-sm md:text-base">
            Social media URL
          </h5>
          <p className="text-xs md:text-[14px]">
            <a
              href={profile.socialMediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {profile.socialMediaUrl}
            </a>
          </p>
        </div>
      )}

      <RecentSupporters profile={profile} />
    </div>
  );
};

export default ProfileSupporter;
