"use client";

import React, { createContext, useState, useContext } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "../_providers/AuthProvider";
import { useLanguage } from "../_providers/LanguageProvider";

interface errorMessage {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}
function isErrorWithMessage(err: unknown): err is errorMessage {
  return (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof err.response === "object"
  );
}

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
});

export const emailPasswordSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "The password must be at least 8 characters long" })
      .max(32, { message: "The password must be a maximum 32 characters" })
      .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), {
        message:
          "Weak password. Password must contain an uppercase, lowercase letter, and number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Those passwords didn't match. Try again",
    path: ["confirmPassword"],
  });

export type UsernameFormValues = z.infer<typeof usernameSchema>;
export type EmailPasswordFormValues = z.infer<typeof emailPasswordSchema>;
export type FormValues = UsernameFormValues & EmailPasswordFormValues;

type FormContextType = {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  formValues: FormValues;
  updateFormValues: (values: Partial<FormValues>) => void;
  usernameForm: ReturnType<typeof useForm<UsernameFormValues>>;
  emailPasswordForm: ReturnType<typeof useForm<EmailPasswordFormValues>>;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
};

export const FormContext = createContext<FormContextType | null>(null);

type FormProviderProps = {
  children: React.ReactNode;
};

export const FormProvider = ({ children }: FormProviderProps) => {
  const { signUp } = useAuth();
  const { text } = useLanguage();
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameForm = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    mode: "onChange",
    defaultValues: {
      username: formValues.username,
    },
  });

  const emailPasswordForm = useForm<EmailPasswordFormValues>({
    resolver: zodResolver(emailPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
    },
  });

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const updateFormValues = (values: Partial<FormValues>) => {
    setFormValues((prev) => ({ ...prev, ...values }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const latestUsername = usernameForm.getValues();
    const latestEmailPassword = emailPasswordForm.getValues();

    const combinedValues = {
      ...latestUsername,
      ...latestEmailPassword,
    };

    setFormValues(combinedValues);

    try {
      await signUp({
        username: combinedValues.username,
        email: combinedValues.email,
        password: combinedValues.password,
      });

      toast.success(
        text("Бүртгэл амжилттай үүслээ.", "Account created successfully!"),
      );
    } catch (error) {
      console.error("Signup error:", error);

      if (isErrorWithMessage(error) && error.response?.data?.error) {
        const errorMessage = error.response.data.error;
        const normalizedMessage = errorMessage.toLowerCase();

        if (normalizedMessage.includes("username")) {
          usernameForm.setError("username", {
            type: "manual",
            message: "Username is already taken",
          });
          setStep(0);
        } else if (normalizedMessage.includes("email")) {
          emailPasswordForm.setError("email", {
            type: "manual",
            message: "Email is already registered",
          });
        }

        toast.error(
          normalizedMessage.includes("username")
            ? text("Хэрэглэгчийн нэр бүртгэлтэй байна.", "Username is already taken")
            : normalizedMessage.includes("email")
              ? text("Имэйл хаяг бүртгэлтэй байна.", "Email is already registered")
              : errorMessage,
        );
      } else {
        toast.error(text("Бүртгэл амжилтгүй боллоо.", "Signup failed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const value: FormContextType = {
    step,
    nextStep,
    prevStep,
    formValues,
    updateFormValues,
    usernameForm,
    emailPasswordForm,
    isSubmitting,
    handleSubmit,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
