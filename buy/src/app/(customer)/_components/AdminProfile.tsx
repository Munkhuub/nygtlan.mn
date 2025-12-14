import React, { useEffect, useState } from "react";
import { SelectDays } from "./SelectDays";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { api } from "@/axios";
import { Profile, useAuth } from "@/app/_providers/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AdminProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedDays, setSelectedDays] = useState("30");
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (loading) return;

    if (!loading && !user) {
      toast("Login to see Profile");
      router.push("/signin");
      return;
    }

    if (!user?.id) {
      console.error("User object exists but has no id");
      toast("Invalid user session. Please login again.");
      router.push("/signin");
      return;
    }

    const getProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<Profile>(`/profile/${user.id}`);
        setProfile(response.data);
        console.log("res", response);
        console.log("admin profile", response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.receivedDonations) return;

    const now = new Date();

    const filteredDonations = user.receivedDonations.filter((donation) => {
      if (selectedDays === "all") return true;

      const createdAt = new Date(donation.createdAt);
      const daysDiff =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      return daysDiff <= Number(selectedDays);
    });

    const total = filteredDonations.reduce(
      (sum, donation) => sum + donation.amount,
      0
    );

    setEarnings(total);
  }, [selectedDays, user?.receivedDonations]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[16rem] md:h-64 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 border border-[#E4E4E7] p-4 sm:p-6 rounded-lg w-full">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-3 items-center">
          <img
            className="size-10 sm:size-12 rounded-full object-cover"
            src={profile?.avatarImage}
            alt={`${profile?.name}'s avatar`}
          />
          <div>
            <h5 className="font-bold text-base sm:text-lg">{profile?.name}</h5>
            <p className="text-[12px] sm:text-[14px] text-gray-500 break-words">
              {profile?.socialMediaUrl}
            </p>
          </div>
        </div>

        <Button
          className="flex gap-2 w-full sm:w-auto justify-center"
          onClick={() => {
            const link = `${window.location.origin}/supporters/${user?.id}`;
            navigator.clipboard.writeText(link);
            toast.success("Link copied to clipboard!");
          }}
          size="sm"
        >
          <CopyIcon size={16} />
          <p className="text-sm">Share page link</p>
        </Button>
      </div>

      <div className="border-t border-[#E4E4E7] w-full my-2 sm:my-4"></div>

      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <h3 className="text-lg sm:text-xl font-semibold">Earnings</h3>
          <SelectDays selectedDays={selectedDays} onChange={setSelectedDays} />
        </div>
        <p className="text-3xl sm:text-4xl font-bold">${earnings}</p>
      </div>
    </div>
  );
};

export default AdminProfile;
