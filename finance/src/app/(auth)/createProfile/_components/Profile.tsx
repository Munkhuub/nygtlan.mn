"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFormContext } from "../../FormProvider";
import { useAuth } from "@/app/_providers/AuthProvider";
import { UpdateImage } from "./UpdateImage";
import { api } from "@/axios";
import { useRouter } from "next/navigation";

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

export type ProfileType = {
  id: number;
  name: string;
  about: string;
  avatarImage: string;
  socialMediaUrl: string;
  backgroundImage: string;
  successMessage: string;
  userId: number;
};

const Profile = () => {
  const { nextStep, updateFormValues } = useFormContext();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
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

  const avatarImage = watch("avatarImage");

  useEffect(() => {
    if (user?.profile && user?.bankCard) {
      router.push("/");
    } else if (user?.profile) {
      nextStep();
    }
  }, [user, nextStep, router]);

  if (loading) {
    return (
      <div className="text-[14px] w-full max-w-[510px] px-4 mx-auto flex flex-col gap-6">
        <p className="text-2xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-[14px] w-full max-w-[510px] px-4 mx-auto flex flex-col gap-6">
        <p className="text-2xl font-semibold">Please log in to continue</p>
      </div>
    );
  }

  if (profile?.id) {
    return null;
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const userId = user?.id;

      if (!userId) {
        console.error("User not found:", user);
        throw new Error("Please log in to create a profile");
      }

      console.log("Creating profile for user ID:", userId);

      const response = await api.post<ProfileType>(`/profile`, {
        ...data,
        backgroundImage: "",
        successMessage: "",
        userId,
      });

      setProfile(response.data);
      console.log("Profile created:", response.data);

      updateFormValues({
        username: data.name,
      });

      nextStep();
    } catch (err) {
      console.error("Error creating profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 w-full">
      <div className="text-[14px] w-full max-w-[510px] mx-auto flex flex-col gap-6">
        <p className="text-2xl font-semibold">Complete your profile page</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p>Add photo</p>
            <UpdateImage
              onChange={(url) =>
                setValue("avatarImage", url, { shouldValidate: true })
              }
              defaultValue={avatarImage}
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

          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-full sm:w-[246px]"
              disabled={isSubmitting || !isValid || !user?.id}
            >
              {isSubmitting
                ? "Creating Profile..."
                : "Create Profile & Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
