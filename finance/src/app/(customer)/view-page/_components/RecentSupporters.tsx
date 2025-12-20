import React, { useEffect, useState } from "react";
import Image from "next/image";
import HeartIcon from "./assets/HeartIcon";
import { api } from "@/axios";
import { Donation, useAuth } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";

const RecentSupporters = () => {
  const [supporters, setSupporters] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    setIsLoading(true);
    const getDonations = async () => {
      try {
        const { data } = await api.get<{ donations: Donation[] }>(
          `/donation/${user.id}`
        );
        setSupporters(data.donations);
      } catch (error) {
        console.error("Failed to fetch supporters", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDonations();
  }, [user?.id]);

  if (!user?.profile) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg border border-[#F4F4F5] flex flex-col gap-3">
        <h5 className="font-semibold text-base md:text-lg">
          Recent Supporters
        </h5>
        <div className="h-[100px] md:h-[140px] w-full flex justify-center items-center">
          Loading...
        </div>
      </div>
    );
  }

  const displayedSupporters = showAll ? supporters : supporters.slice(0, 1);
  const hasMoreSupporters = supporters.length > 1;
  const profileOwnerName = user.profile.name || "this page";

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-[#F4F4F5] flex flex-col gap-3">
      <h5 className="font-semibold text-base md:text-lg">Recent Supporters</h5>

      {isLoading ? (
        <div className="h-[100px] md:h-[140px] w-full flex justify-center items-center">
          Loading supporters...
        </div>
      ) : supporters.length > 0 ? (
        <div className="flex flex-col gap-3">
          {displayedSupporters.map((donation) => (
            <div key={donation.id} className="flex items-start gap-3 py-2">
              <Image
                src={
                  donation.donor?.profile?.avatarImage || "/default-avatar.png"
                }
                className="size-8 md:size-10 rounded-full object-cover"
                width={40}
                height={40}
                alt={`${donation.donor?.profile?.name || "Supporter"}'s avatar`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1 text-sm md:text-base">
                  <p className="font-semibold truncate">
                    {donation.donor?.profile?.name || "Anonymous"}
                  </p>
                  <p>bought ${donation?.amount}</p>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">
                  {donation?.specialMessage || "Thanks for the support!"}
                </p>
              </div>
            </div>
          ))}
          {hasMoreSupporters && (
            <Button
              variant="ghost"
              className="border border-[#E4E4E7] w-full md:w-auto mt-2"
              onClick={() => setShowAll(!showAll)}
            >
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm">
                  {showAll
                    ? "Show less"
                    : `See ${supporters.length - 1} more supporter${
                        supporters.length > 2 ? "s" : ""
                      }`}
                </p>
                {showAll ? (
                  <CircleChevronUp size={18} />
                ) : (
                  <CircleChevronDown size={18} />
                )}
              </div>
            </Button>
          )}
        </div>
      ) : (
        <div className="h-[100px] md:h-[140px] w-full flex flex-col gap-1 justify-center items-center border border-[#F4F4F5] rounded-lg">
          <HeartIcon />
          <p className="font-semibold text-center text-sm md:text-base px-2">
            Be the first to support {profileOwnerName}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentSupporters;
