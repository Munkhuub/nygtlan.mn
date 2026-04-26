"use client";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { createContext } from "react";
import { api, setAuthToken } from "@/axios";
import { useLanguage } from "./LanguageProvider";

type ApiEnvelope<T> = {
  message: string;
  data: T;
};

export type Profile = {
  id: number;
  name: string;
  about: string;
  avatarImage: string;
  socialMediaUrl: string;
  backgroundImage: string;
  successMessage: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type BankCard = {
  id: number;
  country: string;
  firstname: string;
  lastname: string;
  cardNumber: string;
  expiryDate: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type Donation = {
  id: number;
  amount: number;
  specialMessage: string;
  socialURLOrBuyMeACoffee: string;
  donorId: number;
  recipientId: number;
  createdAt: string;
  updatedAt: string;
  donor?: {
    id: number;
    profile?: {
      name?: string;
      avatarImage?: string;
      socialMediaUrl?: string;
    };
  };
};

export type User = {
  id: number;
  email: string;
  password?: string;
  passwordChangedAt?: string | null;
  username: string;
  role?: "ADMIN" | "ACCOUNTANT" | "USER";
  phone?: string | null;
  avatar?: string | null;
  companies?: Company[];
  profile?: Profile | null;
  bankCard?: BankCard | null;
  sentDonations?: Donation[];
  receivedDonations?: Donation[];
  createdAt: string;
  updatedAt: string;
};

export type Company = {
  id: number;
  name: string;
  taxId?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  fiscalYearStart?: number;
  baseCurrency?: "MNT" | "USD" | "EUR" | "KRW" | "CNY" | "JPY" | "RUB";
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    accounts: number;
    journalEntries: number;
    accountingPeriods: number;
  };
};

type AuthPayload = {
  token: string;
  user: User;
};

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

type AuthContextType = {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  loading: boolean;
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signUp: ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | undefined>;
  currentCompany?: Company;
  currentCompanyId?: number;
  setCurrentCompanyId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { text } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [currentCompanyId, setCurrentCompanyId] = useState<number | undefined>(
    undefined,
  );
  const updateCurrentCompanyId: React.Dispatch<
    React.SetStateAction<number | undefined>
  > = (value) => {
    setCurrentCompanyId((currentValue) => {
      const nextValue =
        typeof value === "function" ? value(currentValue) : value;

      if (nextValue === undefined) {
        localStorage.removeItem("currentCompanyId");
      } else {
        localStorage.setItem("currentCompanyId", String(nextValue));
      }

      return nextValue;
    });
  };

  const syncCurrentCompany = (companies: Company[] = []) => {
    if (!companies.length) {
      localStorage.removeItem("currentCompanyId");
      updateCurrentCompanyId(undefined);
      return;
    }

    const savedCompanyId = localStorage.getItem("currentCompanyId");
    const parsedSavedCompanyId = savedCompanyId ? Number(savedCompanyId) : NaN;
    const matchedCompany = companies.find(
      (company) => company.id === parsedSavedCompanyId,
    );
    const nextCompanyId = matchedCompany?.id ?? companies[0]?.id;

    if (nextCompanyId) {
      localStorage.setItem("currentCompanyId", String(nextCompanyId));
      setCurrentCompanyId(nextCompanyId);
    }
  };

  const refreshUser = async () => {
    const { data } = await api.get<ApiEnvelope<User>>("/auth/getMe");
    const nextUser = data.data;

    setUser(nextUser);
    syncCurrentCompany(nextUser.companies);

    return nextUser;
  };

  const routeAfterAuth = (nextUser: User) => {
    if ((nextUser.companies?.length ?? 0) > 0) {
      router.push("/");
      return;
    }

    router.push("/companies/new");
  };

  const currentCompany = user?.companies?.find(
    (company) => company.id === currentCompanyId,
  );

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await api.post<ApiEnvelope<AuthPayload>>("/auth/signin", {
        email,
        password,
      });
      const payload = data.data;

      localStorage.setItem("token", payload.token);
      setUser(payload.user);
      syncCurrentCompany(payload.user.companies);

      setAuthToken(payload.token);
      toast.success(text("Амжилттай нэвтэрлээ.", "Logged in successfully!"));
      routeAfterAuth(payload.user);
    } catch (error) {
      console.error("Signin error:", error);
      toast.error(
        text(
          "Нэвтрэхэд алдаа гарлаа. Нэвтрэх мэдээллээ шалгана уу.",
          "Failed to sign in",
        ),
      );
      throw error;
    }
  };

  const signUp = async ({
    username,
    email,
    password,
  }: {
    email: string;
    password: string;
    username: string;
  }) => {
    try {
      const { data } = await api.post<ApiEnvelope<AuthPayload>>("/auth/signup", {
        username,
        email,
        password,
      });
      const payload = data.data;

      localStorage.setItem("token", payload.token);
      setUser(payload.user);
      syncCurrentCompany(payload.user.companies);

      setAuthToken(payload.token);

      routeAfterAuth(payload.user);
    } catch (error) {
      console.error("Signup error:", error);

      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.error ||
        apiError?.message ||
        text(
          "Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу.",
          "Signup failed. Please try again.",
        );

      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(undefined);
    updateCurrentCompanyId(undefined);
    setAuthToken("");
    router.push("/signin");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing auth...");

      const token = localStorage.getItem("token");
      console.log("Found token:", !!token);

      if (!token) {
        console.log("No token found, user not authenticated");
        setLoading(false);
        setInitialized(true);
        return;
      }

      setAuthToken(token);

      try {
        console.log("Validating token...");
        const nextUser = await refreshUser();
        console.log("Token valid, user:", nextUser);
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.removeItem("token");
        setUser(undefined);
        setAuthToken("");
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  if (!initialized) {
    return (
      <div className="flex w-full p-100 items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        loading,
        setUser,
        refreshUser,
        currentCompany,
        currentCompanyId,
        setCurrentCompanyId: updateCurrentCompanyId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
