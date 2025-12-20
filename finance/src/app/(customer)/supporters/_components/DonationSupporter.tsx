import { CheckCircle, CoffeeIcon, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/axios";
import { Profile, useAuth } from "@/app/_providers/AuthProvider";
import { toast } from "sonner";
import { DonationDetails } from "../[id]/page";

const formSchema = z.object({
  socialURLOrBuyMeACoffee: z.string().min(2, {
    message: "URL must be at least 2 characters.",
  }),
  specialMessage: z.string().min(2, {
    message: "Special message must be at least 2 characters.",
  }),
});

type DonationSupporterProps = {
  profile?: Profile;
  onDonationSuccess: (details: DonationDetails) => void;
};

type FormValues = z.infer<typeof formSchema>;

const DonationSupporter = ({
  profile,
  onDonationSuccess,
}: DonationSupporterProps) => {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(
    null
  );
  const { user } = useAuth();

  const amounts = [1, 3, 5, 10];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialURLOrBuyMeACoffee: "",
      specialMessage: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await api.post("/donation", {
        ...values,
        amount: selectedAmount,
        donorId: user?.id,
        recipientId: profile?.userId,
      });
      console.log("Donation successful");
      setSubmitStatus("success");
      onDonationSuccess({
        amounts,
        recipientName: profile?.name,
        message: profile?.successMessage.trim(),
      });
      setTimeout(() => {
        form.reset();
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Donation error", error);
      setSubmitStatus("error");
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full md:w-[50%] bg-white p-4 md:p-6 rounded-lg border border-[#F4F4F5] flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-4 md:gap-6">
        <h5 className="text-xl md:text-2xl font-semibold">
          Buy {profile?.name} a Coffee
        </h5>
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base">Select amount:</p>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            {amounts.map((amount) => (
              <Button
                className={`flex gap-1 md:gap-2 w-[60px] md:w-[72px] text-xs md:text-sm ${
                  selectedAmount === amount
                    ? "bg-black text-white"
                    : "bg-[#F4F4F5] text-black hover:bg-[#e0e0e0]"
                }`}
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                type="button"
                size="sm"
              >
                <CoffeeIcon className="size-3 md:size-4" />${amount}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:space-y-8"
        >
          <FormField
            control={form.control}
            name="socialURLOrBuyMeACoffee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">
                  Enter BuyMeCoffee or social account URL:
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="buymeacoffee.com/"
                    {...field}
                    className="text-sm md:text-base"
                  />
                </FormControl>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">
                  Special message:
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please write your message here"
                    {...field}
                    className="text-sm md:text-base min-h-[100px]"
                  />
                </FormControl>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={`w-full text-sm md:text-base ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : submitStatus === "success"
                ? "bg-green-600 text-white"
                : ""
            }`}
            disabled={isSubmitting}
            size="sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                <span className="ml-2">Processing...</span>
              </>
            ) : submitStatus === "success" ? (
              <>
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                <span className="ml-2">Success!</span>
              </>
            ) : (
              "Support"
            )}
          </Button>
        </form>

        {submitStatus === "success" && (
          <div className="p-2 md:p-3 bg-green-50 border border-green-200 rounded-md mt-3 md:mt-4">
            <p className="text-xs md:text-sm text-green-800">
              Donation sent successfully! Thank you for your support.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-2 md:p-3 bg-red-50 border border-red-200 rounded-md mt-3 md:mt-4">
            <p className="text-xs md:text-sm text-red-800">
              Something went wrong. Please try again.
            </p>
          </div>
        )}
      </Form>
    </div>
  );
};

export default DonationSupporter;
