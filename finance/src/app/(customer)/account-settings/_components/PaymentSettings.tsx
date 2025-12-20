import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { api } from "@/axios";
import { useForm } from "react-hook-form";
import { BankCard, useAuth } from "@/app/_providers/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpiryMonth } from "@/app/(auth)/createProfile/_components/ExpiryMonth";
import { ExpiryYear } from "@/app/(auth)/createProfile/_components/ExpiryYear";
import { bankCardSchema } from "@/app/(auth)/createProfile/_components/Payment";
import SelectCountrySettings from "./SelectCountrySettings";
import { toast } from "sonner";

type BankCardFormData = z.infer<typeof bankCardSchema>;

interface BankCardUpdateData {
  firstname?: string;
  lastname?: string;
  country?: string;
  cardNumber?: string;
  cvc?: string;
  expiryDate?: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

const PaymentSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, dirtyFields },
  } = useForm<BankCardFormData>({
    resolver: zodResolver(bankCardSchema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      cardNumber: "",
      cvc: "",
      expiryMonth: "",
      expiryYear: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user?.bankCard) {
      const bankCardData: BankCardFormData = {
        firstname: user.bankCard.firstname || "",
        lastname: user.bankCard.lastname || "",
        cardNumber: "",
        cvc: "",
        expiryMonth: "",
        expiryYear: "",
        country: user.bankCard.country || "",
      };

      reset(bankCardData);
    }
  }, [user?.bankCard, reset]);

  const handleComplete = async (data: BankCardFormData) => {
    setIsSubmitting(true);

    try {
      if (!user?.bankCard?.id) {
        throw new Error("Bank card not found. Please create one first.");
      }

      const updateData: BankCardUpdateData = {};

      if (dirtyFields.firstname) updateData.firstname = data.firstname;
      if (dirtyFields.lastname) updateData.lastname = data.lastname;
      if (dirtyFields.country) updateData.country = data.country;

      if (data.cardNumber) updateData.cardNumber = data.cardNumber;
      if (data.cvc) updateData.cvc = data.cvc;

      if (data.expiryMonth && data.expiryYear) {
        updateData.expiryDate = `${data.expiryMonth}/${data.expiryYear.slice(
          -2
        )}`;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info("No changes detected");
        return;
      }

      console.log("Updating bank card with:", updateData);

      const response = await api.put<BankCard>(
        `/bankCard/${user.bankCard.id}`,
        updateData
      );

      if (user) {
        setUser({
          ...user,
          bankCard: response.data,
        });
      }

      toast.success("Payment information updated successfully!");
      console.log("Bank Card updated:", response.data);
    } catch (error) {
      console.error("Error updating bank card:", error);

      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.error ||
        apiError?.message ||
        "Failed to update payment information";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-none sm:max-w-[650px] mx-auto px-4 sm:px-0">
      <form
        className="text-sm sm:text-base w-full flex flex-col gap-4 sm:gap-6 rounded-lg border border-[#E4E4E7] p-4 sm:p-6"
        onSubmit={handleSubmit(handleComplete)}
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
          Payment Information
        </h2>

        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="country" className="text-sm sm:text-base">
              Select Country
            </Label>
            <SelectCountrySettings
              onValueChange={(value: string) =>
                setValue("country", value, { shouldDirty: true })
              }
              error={errors.country?.message}
              value={user?.bankCard?.country}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="firstName" className="text-sm sm:text-base">
                First Name
              </Label>
              <Input
                id="firstname"
                type="text"
                placeholder="Enter your name here"
                className="h-10 sm:h-11 text-sm sm:text-base"
                {...register("firstname")}
              />
              {errors.firstname && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {errors.firstname.message}
                </span>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="lastName" className="text-sm sm:text-base">
                Last Name
              </Label>
              <Input
                id="lastname"
                type="text"
                placeholder="Enter your last name here"
                className="h-10 sm:h-11 text-sm sm:text-base"
                {...register("lastname")}
              />
              {errors.lastname && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {errors.lastname.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cardNumber" className="text-sm sm:text-base">
              Card Number
            </Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="h-10 sm:h-11 text-sm sm:text-base"
              {...register("cardNumber")}
            />
            {errors.cardNumber && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.cardNumber.message}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="expiryMonth" className="text-sm sm:text-base">
                Expiry month
              </Label>
              <ExpiryMonth
                onValueChange={(value: string) =>
                  setValue("expiryMonth", value, { shouldDirty: true })
                }
                error={errors.expiryMonth?.message}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="expiryYear" className="text-sm sm:text-base">
                Expiry year
              </Label>
              <ExpiryYear
                onValueChange={(value: string) =>
                  setValue("expiryYear", value, { shouldDirty: true })
                }
                error={errors.expiryYear?.message}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="cvc" className="text-sm sm:text-base">
                CVC
              </Label>
              <Input
                id="cvc"
                type="text"
                placeholder="123"
                className="h-10 sm:h-11 text-sm sm:text-base"
                {...register("cvc")}
              />
              {errors.cvc && (
                <span className="text-red-500 text-xs sm:text-sm">
                  {errors.cvc.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end pt-2 sm:pt-4">
          <Button
            className="w-full sm:w-auto sm:min-w-[150px] h-10 sm:h-11 text-sm sm:text-base"
            disabled={isSubmitting || !isValid}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentSettings;
