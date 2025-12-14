"use client";

import React from "react";
import { FormProvider, useFormContext } from "../FormProvider";
import Profile from "./_components/Profile";
import Payment from "./_components/Payment";

const Stepper = ({ totalSteps }: { totalSteps: number }) => {
  const { step } = useFormContext();

  return (
    <div className="absolute top-6 inset-x-0 flex justify-center gap-2">
      {[...Array(totalSteps)].map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            step === i ? "bg-black" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const FormContent = () => {
  const { step } = useFormContext();
  const TOTAL_STEPS = 2;

  return (
    <main className="max-w-md mx-auto h-screen flex flex-col items-center justify-center p-4 relative">
      <Stepper totalSteps={TOTAL_STEPS} />

      {step === 0 && <Profile />}
      {step === 1 && <Payment />}
    </main>
  );
};

export default function Page() {
  return (
    <FormProvider>
      <FormContent />
    </FormProvider>
  );
}
