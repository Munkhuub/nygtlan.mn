import React, { useEffect, useState } from "react";
import HeartIcon from "./assets/HeartIcon";
import { api } from "@/axios";
import { Donation, Profile } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { CircleChevronDown, CircleChevronUp } from "lucide-react";

type RecentSupporterProps = {
  profile?: Profile;
};

const RecentSupporters = ({ profile }: RecentSupporterProps) => {
  const [supporters, setSupporters] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!profile?.userId) {
      console.log("No profile or userId:", profile);
      return;
    }

    console.log("Fetching donations for userId:", profile.userId);
    setIsLoading(true);

    const getDonations = async () => {
      try {
        const { data } = await api.get<{ donations: Donation[] }>(
          `/donation/${profile.userId}`
        );
        console.log("Donations data:", data.donations);
        setSupporters(data.donations);
      } catch (error) {
        console.error("Failed to fetch supporters", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDonations();
  }, [profile?.userId, profile]);

  if (!profile) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#F4F4F5] flex flex-col gap-3">
        <h5 className="font-semibold">Recent Supporters</h5>
        <div className="h-[140px] w-full flex justify-center items-center">
          Loading...
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-[#F4F4F5] flex flex-col gap-3">
        <h5 className="font-semibold">Recent Supporters</h5>
        <div className="h-[140px] w-full flex justify-center items-center">
          Loading supporters...
        </div>
      </div>
    );
  }

  const displayedSupporters = showAll ? supporters : supporters.slice(0, 1);
  const hasMoreSupporters = supporters.length > 1;

  return (
    <div className="bg-white p-6 rounded-lg border border-[#F4F4F5] flex flex-col gap-3">
      <h5 className="font-semibold">Recent Supporters</h5>

      {supporters.length > 0 ? (
        <div className="flex flex-col gap-3">
          {displayedSupporters.map((donation) => (
            <div
              key={donation.id}
              className="max-h-[52px] flex items-center gap-4"
            >
              {donation.donor?.profile?.avatarImage ? (
                <img
                  src={donation.donor.profile.avatarImage}
                  className="size-10 rounded-full object-cover"
                  alt={`${donation.donor.profile.name} avatar`}
                />
              ) : (
                <div className="size-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {donation.donor?.profile?.name?.charAt(0).toUpperCase() ||
                      "?"}
                  </span>
                </div>
              )}

              <div>
                <div className="flex gap-1">
                  <p className="font-semibold">
                    {donation.donor?.profile?.name || "Anonymous"}
                  </p>
                  <p>bought ${donation?.amount}</p>
                </div>
                <p className="text-sm text-gray-600">
                  {donation?.specialMessage || "Thanks for the support!"}
                </p>
              </div>
            </div>
          ))}

          {hasMoreSupporters && (
            <Button
              variant="ghost"
              className="border border-[#E4E4E7]"
              onClick={() => setShowAll(!showAll)}
            >
              <p>
                {showAll
                  ? "Show less"
                  : `See more (${supporters.length - 1} more)`}
              </p>
              {showAll ? <CircleChevronUp /> : <CircleChevronDown />}
            </Button>
          )}
        </div>
      ) : (
        <div className="h-[140px] w-full flex flex-col gap-1 justify-center items-center border border-[#F4F4F5] rounded-lg">
          <HeartIcon />
          <p className="font-semibold">
            Be the first one to support {profile.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentSupporters;
