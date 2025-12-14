"use client";
import { useEffect, useState } from "react";
import { api } from "@/axios";
import { Profile } from "../../../_providers/AuthProvider";
import { useParams } from "next/navigation";
import Image from "next/image";
import DonationSupporter from "../_components/DonationSupporter";
import ProfileSupporter from "../_components/ProfileSupporter";
import { DonationSuccess } from "../_components/DonationSuccess";

export type DonationDetails = {
  amounts: number[];
  recipientName: string | undefined;
  message: string | undefined;
};

export default function Home() {
  const [profile, setProfile] = useState<Profile>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const params = useParams();
  const creatorId = params.id as string;

  useEffect(() => {
    if (!creatorId) return;

    const getCreatorProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Profile>(`/profile/${creatorId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch creator profile:", error);
        setError("Creator not found");
      } finally {
        setIsLoading(false);
      }
    };

    getCreatorProfile();
  }, [creatorId]);

  const handleDonationSuccess = (details: DonationDetails) => {
    setDonationSuccess(true);
    console.log("Donation successful:", details);
  };

  const handleBackToProfile = () => {
    setDonationSuccess(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Loading creator profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Creator Not Found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>Creator not found</div>
      </div>
    );
  }

  return (
    <>
      {donationSuccess ? (
        <DonationSuccess
          profile={profile}
          onBackToProfile={handleBackToProfile}
        />
      ) : (
        <div className="mb-20 md:mb-[187px]">
          {profile.backgroundImage && (
            <Image
              className="relative w-full h-[200px] md:h-[319px] bg-[#F4F4F5] object-cover"
              src={profile.backgroundImage}
              alt={`${profile.name} background`}
              width={1920}
              height={319}
              priority
            />
          )}

          {!profile.backgroundImage && (
            <div className="relative w-full h-[200px] md:h-[319px] bg-[#F4F4F5]" />
          )}

          <div className="flex flex-col md:flex-row px-4 md:px-20 mt-[-60px] md:mt-[-85px] w-full gap-5 relative z-10">
            <ProfileSupporter profile={profile} />
            <DonationSupporter
              profile={profile}
              onDonationSuccess={handleDonationSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}
