import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "../../FormProvider";

export const Step2 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    prevStep,
    emailPasswordForm,
    formValues,
    handleSubmit,
    isSubmitting,
  } = useFormContext();
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState,
  } = emailPasswordForm;

  const onSubmit = handleFormSubmit(async () => {
    await handleSubmit();
  });

  return (
    <div className="w-full md:w-[50%] p-4 sm:p-6 lg:p-8 flex justify-center md:items-center mt-2">
      <form className="w-full max-w-md flex flex-col gap-6" onSubmit={onSubmit}>
        <Button
          variant="ghost"
          size="icon"
          onClick={prevStep}
          type="button"
          className="self-start -ml-2"
        >
          <ChevronLeft />
        </Button>

        <div>
          <h3 className="text-2xl font-semibold">Complete your account</h3>
          <p className="text-gray-500 text-sm">
            Add your email and create a strong password
          </p>
        </div>

        <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="text-sm">
            <span className="text-gray-500">Username:</span>
            <span className="ml-2 font-medium">{formValues.username}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="w-full h-12 px-4 py-3 border border-gray-200 rounded-lg">
              <input
                type="email"
                placeholder="Enter your email address"
                className="h-full w-full border-none text-base focus:outline-none"
                {...register("email")}
              />
            </div>
            {formState.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formState.errors.email.message}
              </div>
            )}
          </div>

          <div>
            <div className="w-full h-12 px-4 py-3 border border-gray-200 rounded-lg">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="h-full w-full border-none text-base focus:outline-none"
                {...register("password")}
              />
            </div>
          </div>

          <div>
            <div className="w-full h-12 px-4 py-3 border border-gray-200 rounded-lg">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="h-full w-full border-none text-base focus:outline-none"
                {...register("confirmPassword")}
              />
            </div>
            {(formState.errors.password ||
              formState.errors.confirmPassword) && (
              <div className="text-red-500 text-sm mt-1">
                {formState.errors.password?.message ||
                  formState.errors.confirmPassword?.message}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPassword"
              onChange={(e) => setShowPassword(e.target.checked)}
              className="size-4"
            />
            <label
              htmlFor="showPassword"
              className="text-sm text-gray-500 cursor-pointer"
            >
              Show password
            </label>
          </div>
        </div>

        <Button
          className="w-full h-12 text-base"
          type="submit"
          disabled={isSubmitting || !formState.isValid}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};
