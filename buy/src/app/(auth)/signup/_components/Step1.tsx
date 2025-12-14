import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFormContext } from "../../FormProvider";

export const Step1 = () => {
  const { nextStep, usernameForm, updateFormValues } = useFormContext();
  const { register, handleSubmit, formState } = usernameForm;

  const onSubmit = handleSubmit((data) => {
    updateFormValues(data);
    nextStep();
  });

  return (
    <div className="w-full md:w-[50%] p-4 sm:p-6 lg:p-8 flex justify-center md:items-center mt-16">
      <form className="w-full max-w-md flex flex-col gap-6" onSubmit={onSubmit}>
        <div>
          <h3 className="text-2xl font-semibold">Create your account</h3>
          <p className="text-gray-500 text-sm">
            Choose a username for your page
          </p>
        </div>

        <div>
          <div className="w-full h-10 px-4 py-3 border border-gray-200 rounded-lg flex items-center">
            <input
              type="text"
              placeholder="Enter username here"
              className="h-full w-full border-none text-base focus:outline-none"
              {...register("username")}
            />
          </div>
          {formState.errors.username && (
            <div className="text-red-500 text-sm mt-1">
              {formState.errors.username.message}
            </div>
          )}
        </div>

        <Button
          className="w-full h-10 text-base"
          type="submit"
          disabled={!formState.isValid}
        >
          Continue
        </Button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?
          <Link href="/signin" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};
