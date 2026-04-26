import Banner from "./Banner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { useFormContext } from "../../FormProvider";
import { useLanguage } from "@/app/_providers/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

export const MultiStepForm = () => {
  const { step } = useFormContext();
  const { text } = useLanguage();

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      <Banner />
      <div className="relative flex-1 md:flex justify-center">
        <div className="absolute -top-96 right-6 z-10 flex items-center gap-2 md:top-8 md:right-20">
          <LanguageToggle />
          <Link href="/signin">
            <Button variant="secondary" size="sm">
              {text("Нэвтрэх", "Log In")}
            </Button>
          </Link>
        </div>
        {step === 0 ? <Step1 /> : <Step2 />}
      </div>
    </div>
  );
};
