"use client";

import Donation from "./_components/Donation";
import { UpdateCover } from "./_components/UpdateCover";
import { useEffect, useState, useCallback } from "react";
import ViewPageProfile from "./_components/ViewPageProfile";
import { api } from "@/axios";
import { Profile, useAuth } from "../../_providers/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const getProfile = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await api.get<Profile>(`/profile/${user.id}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
      toast("Login to view page", { position: "top-center", duration: 3000 });
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && !authLoading) {
      getProfile();
    }
  }, [user, authLoading, getProfile]);

  const handleCoverChange = async (url: string) => {
    if (!user?.profile?.id) {
      console.error("No user profile ID available");
      return;
    }

    const originalImage = profile?.backgroundImage;

    setProfile((prev) => (prev ? { ...prev, backgroundImage: url } : null));

    try {
      await api.put(`/profile/${user.profile.id}`, {
        backgroundImage: url,
      });

      await getProfile();
    } catch (error) {
      console.error("Failed to save background image:", error);
      toast.error("Failed to update cover image");

      if (originalImage !== undefined) {
        setProfile((prev) =>
          prev ? { ...prev, backgroundImage: originalImage } : null
        );
      }
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4">
        <p className="text-center">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4">
        <p className="text-center">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div>
      <UpdateCover
        defaultValue={profile?.backgroundImage || ""}
        onChange={handleCoverChange}
      />

      <div className="flex flex-col md:flex-row px-4 md:px-6 lg:px-20 mt-[-60px] md:mt-[-85px] w-full gap-4 md:gap-5 relative z-10 md:mb-4">
        <div className="md:w-[55%]">
          <ViewPageProfile />
        </div>
        <div className="md:w-[45%]">
          <Donation />
        </div>
      </div>
    </div>
  );
}
