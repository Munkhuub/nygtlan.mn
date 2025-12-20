import { ProfileType } from "@/app/(auth)/createProfile/_components/Profile";
import { UpdateImage } from "@/app/(auth)/createProfile/_components/UpdateImage";
import { useAuth } from "@/app/_providers/AuthProvider";
import { api } from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  about: z
    .string()
    .max(500, "About must be less than 500 characters")
    .optional(),
  socialMediaUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  avatarImage: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileUpdateData {
  name?: string;
  about?: string;
  socialMediaUrl?: string;
  avatarImage?: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

const ProfileSettings = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, dirtyFields },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      about: "",
      socialMediaUrl: "",
      avatarImage: "",
    },
  });

  useEffect(() => {
    if (user?.profile) {
      const profileData: ProfileFormData = {
        name: user.profile.name || "",
        about: user.profile.about || "",
        socialMediaUrl: user.profile.socialMediaUrl || "",
        avatarImage: user.profile.avatarImage || "",
      };

      reset(profileData);
    }
  }, [user?.profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const id = user?.profile?.id;

      if (!user?.profile?.id) {
        console.error("User not found:", user);
        throw new Error("Please log in to create a profile");
      }

      const updateData: ProfileUpdateData = {};

      if (dirtyFields.name && data.name !== undefined) {
        updateData.name = data.name;
      }

      if (dirtyFields.about && data.about !== undefined) {
        updateData.about = data.about;
      }

      if (dirtyFields.socialMediaUrl && data.socialMediaUrl !== undefined) {
        updateData.socialMediaUrl = data.socialMediaUrl;
      }

      if (dirtyFields.avatarImage && data.avatarImage !== undefined) {
        updateData.avatarImage = data.avatarImage;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes detected");
        return;
      }

      await api.put<ProfileType>(`/profile/${id}`, updateData);

      toast.success("Successfully updated");
    } catch (err) {
      console.error("Error updating profile:", err);

      const apiError = err as ApiError;
      const errorMessage =
        apiError?.response?.data?.error ||
        apiError?.message ||
        "Failed to update profile";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[650px] flex flex-col gap-6 px-4 sm:px-0">
      <p className="text-2xl font-semibold">My Profile</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 rounded-lg border border-[#E4E4E7] p-4 sm:p-6"
      >
        <h4 className="font-bold">Personal Info</h4>
        <div className="flex flex-col gap-3">
          <p>Add photo</p>
          <UpdateImage
            onChange={(url: string) =>
              setValue("avatarImage", url, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            defaultValue={user?.profile?.avatarImage}
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name here"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              placeholder="Write about yourself here"
              className={`h-[131px] w-full ${
                errors.about ? "border-red-500" : ""
              }`}
              {...register("about")}
            />
            {errors.about && (
              <p className="text-red-500 text-sm">{errors.about.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="socialMediaUrl">Social media URL</Label>
            <Input
              id="socialMediaUrl"
              type="url"
              placeholder="https://"
              {...register("socialMediaUrl")}
              className={errors.socialMediaUrl ? "border-red-500" : ""}
            />
            {errors.socialMediaUrl && (
              <p className="text-red-500 text-sm">
                {errors.socialMediaUrl.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !isValid || !user?.id}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
