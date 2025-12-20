import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/axios";
import { ProfileType } from "@/app/(auth)/createProfile/_components/Profile";
import { useAuth } from "@/app/_providers/AuthProvider";

const successMessageSchema = z.object({
  confirmationMessage: z
    .string()
    .min(1, "Confirmation message is required")
    .max(1000, "Message must be less than 1000 characters"),
});

type SuccessMessageFormData = z.infer<typeof successMessageSchema>;

const SuccessMessage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<SuccessMessageFormData>({
    resolver: zodResolver(successMessageSchema),
    mode: "onChange",
    defaultValues: {
      confirmationMessage: "",
    },
  });

  useEffect(() => {
    if (user?.profile?.successMessage) {
      setValue("confirmationMessage", user.profile.successMessage);
    }
  }, [user?.profile?.successMessage, setValue]);

  const onSubmit = async (data: SuccessMessageFormData) => {
    setIsSubmitting(true);
    try {
      const userId = user?.id;

      if (!userId) {
        console.error("User not found:", user);
        throw new Error("Please log in to update your profile");
      }

      console.log("Saving confirmation message:", data.confirmationMessage);

      if (!user?.profile) {
        const response = await api.post<{ data: ProfileType }>("/profile", {
          name: user.profile?.name || "Default Name",
          successMessage: data.confirmationMessage,
          userId: userId,
        });

        console.log("Profile created with success message:", response.data);
        toast.success("Profile created with confirmation message");
      } else {
        await api.put<{ data: ProfileType }>(`/profile/${user.profile.id}`, {
          successMessage: data.confirmationMessage,
        });

        toast.success("Confirmation message saved successfully");
      }
    } catch (err) {
      console.error("Error saving confirmation message:", err);
      toast.error("Failed to save confirmation message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-none sm:max-w-[650px] mx-auto px-4 sm:px-0 md:mb-8 mb-28">
      <div className="text-sm sm:text-base w-full flex flex-col gap-4 sm:gap-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
          Success Message
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 sm:gap-6 rounded-lg border border-[#E4E4E7] p-4 sm:p-6"
        >
          <h4 className="font-bold text-base sm:text-lg">
            Confirmation Settings
          </h4>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="confirmationMessage"
                className="text-sm sm:text-base font-medium"
              >
                Confirmation message
              </Label>
              <Textarea
                id="confirmationMessage"
                placeholder="Enter your confirmation message here..."
                className={`h-[120px] sm:h-[131px] w-full text-sm sm:text-base resize-none ${
                  errors.confirmationMessage ? "border-red-500" : ""
                }`}
                {...register("confirmationMessage")}
              />
              {errors.confirmationMessage && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.confirmationMessage.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center sm:justify-start pt-2 sm:pt-4">
            <Button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[150px] h-10 sm:h-11 text-sm sm:text-base"
              disabled={isSubmitting || !isValid || !user?.id}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuccessMessage;
