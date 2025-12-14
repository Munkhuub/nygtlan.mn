import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "../../FormProvider";
import SelectCountry from "./SelectCountry";
import { ExpiryMonth } from "./ExpiryMonth";
import { ExpiryYear } from "./ExpiryYear";
import { z } from "zod";
import { api } from "@/axios";
import { useForm } from "react-hook-form";
import { BankCard, useAuth } from "@/app/_providers/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export const bankCardSchema = z.object({
  firstname: z
    .string()
    .min(1, "First Name is required")
    .max(50, "Name must be less than 50 characters"),
  lastname: z
    .string()
    .min(1, "Last Name is required")
    .max(50, "Name must be less than 50 characters"),
  cardNumber: z
    .string()
    .min(13, "Card Number is required")
    .max(19, "Card number is too long")
    .regex(/^\d+$/, "Card number must contain only digits"),
  cvc: z
    .string()
    .min(3, "CVC must be at least 3 digits")
    .max(4, "CVC must be at most 4 digits")
    .regex(/^\d+$/, "CVC must be numeric"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(1, "Expiry year is required"),
  country: z.string().min(1, "Country is required"),
});

type BankCardFormData = z.infer<typeof bankCardSchema>;

const Payment = () => {
  const { prevStep, isSubmitting } = useFormContext();

  const { user } = useAuth();
  const Router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
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

  const handleComplete = async (data: BankCardFormData) => {
    const { expiryMonth, expiryYear, ...dataWithoutExpiryDate } = data;

    try {
      const userId = user?.id;
      const expiryDate = `${expiryMonth}/${expiryYear.slice(-2)}`;
      const response = await api.post<BankCard>(`/bankCard`, {
        ...dataWithoutExpiryDate,
        userId,
        expiryDate,
      });
      console.log("Bank Card created:", response.data);
      Router.push("/");
    } catch (error) {
      console.error("Error creating bank card:", error);
    }
  };

  return (
    <form
      className="text-[14px] w-[510px] flex flex-col gap-6"
      onSubmit={handleSubmit(handleComplete)}
    >
      <p className="text-2xl font-semibold">Payment Information</p>
      <div className="flex flex-col gap-3 w-full text-[14px]">
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="country">Select Country</Label>
          <SelectCountry
            onValueChange={(value) => setValue("country", value)}
            error={errors.country?.message}
          />
        </div>

        <div className="flex gap-3 w-full">
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstname"
              type="text"
              placeholder="Enter your name here"
              {...register("firstname")}
            />
            {errors.firstname && (
              <span className="text-red-500 text-sm">
                {errors.firstname.message}
              </span>
            )}
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastname"
              type="text"
              placeholder="Enter your last name here"
              {...register("lastname")}
            />
            {errors.lastname && (
              <span className="text-red-500 text-sm">
                {errors.lastname.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            type="text"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            {...register("cardNumber")}
          />
          {errors.cardNumber && (
            <span className="text-red-500 text-sm">
              {errors.cardNumber.message}
            </span>
          )}
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="expiryMonth">Expiry month</Label>
            <ExpiryMonth
              onValueChange={(value) => setValue("expiryMonth", value)}
              error={errors.expiryMonth?.message}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="expiryYear">Expiry year</Label>
            <ExpiryYear
              onValueChange={(value) => setValue("expiryYear", value)}
              error={errors.expiryYear?.message}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              type="text"
              placeholder="123"
              {...register("cvc")}
            />
            {errors.cvc && (
              <span className="text-red-500 text-sm">{errors.cvc.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          className="w-[120px]"
          onClick={prevStep}
          disabled={isSubmitting}
          type="button"
        >
          Back
        </Button>
        <Button
          className="w-[246px]"
          disabled={isSubmitting || !isValid}
          type="submit"
        >
          {isSubmitting ? "Processing..." : "Complete"}
        </Button>
      </div>
    </form>
  );
};

export default Payment;
