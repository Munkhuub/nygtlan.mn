import Banner from "./Banner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { useFormContext } from "../../FormProvider";

export const MultiStepForm = () => {
  const { step } = useFormContext();

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      <Banner />
      <div className="relative flex-1 md:flex justify-center">
        <Link
          href="/signin"
          className="absolute -top-96 md:top-8 md:right-20 right-6 z-10"
        >
          <Button variant="secondary" size="sm">
            Log In
          </Button>
        </Link>
        {step === 0 ? <Step1 /> : <Step2 />}
      </div>
    </div>
  );
};
