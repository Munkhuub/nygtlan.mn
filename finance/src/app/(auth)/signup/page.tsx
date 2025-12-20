"use client";
import { FormProvider } from "../FormProvider";
import { MultiStepForm } from "./_components/MultiStepForm";

export default function SignUp() {
  return (
    <FormProvider>
      <MultiStepForm />
    </FormProvider>
  );
}
