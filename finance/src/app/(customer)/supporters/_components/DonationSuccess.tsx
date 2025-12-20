import { Profile } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft } from "lucide-react";

type DonationSuccessProps = {
  profile: Profile;

  onBackToProfile: () => void;
};

export const DonationSuccess = ({
  profile,

  onBackToProfile,
}: DonationSuccessProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 flex flex-col gap-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <h2 className="w-full text-center font-semibold">Donation Complete!</h2>
        <div className="p-3 gap-4 bg-white rounded-lg shadow-xs border border-[FFFFFF]">
          <div className="flex items-center gap-2">
            {profile?.avatarImage ? (
              <img
                src={profile.avatarImage}
                className="size-8 rounded-full object-cover"
                alt={`${profile.name} avatar`}
              />
            ) : (
              <div className="size-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {profile?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
            )}
            <p className="font-semibold">{profile?.name || "Anonymous"}:</p>
          </div>

          <p className="text-sm text-gray-600 mr-auto">
            {profile?.successMessage || "Thanks for the support!"}
          </p>
        </div>

        <Button
          onClick={onBackToProfile}
          className="max-w-[148px] mx-auto flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Profile
        </Button>
      </div>
    </div>
  );
};
