"use client";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { createContext } from "react";
import { api, setAuthToken } from "@/axios";

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
  password: string;
  passwordChangedAt?: string | null;
  username: string;
  profile?: Profile | null;
  bankCard?: BankCard | null;
  sentDonations?: Donation[];
  receivedDonations?: Donation[];
  createdAt: string;
  updatedAt: string;
};

type getMeTypes = {
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await api.post<getMeTypes>("/auth/signin", {
        email,
        password,
      });
      console.log("SignIn response data:", data);

      localStorage.setItem("token", data.token);
      setUser(data.user);

      setAuthToken(data.token);
      toast.success("Logged in successfully!");
      router.push("/createProfile");
    } catch (error) {
      console.error("Signin error:", error);
      toast.error("Failed to sign in");
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
    console.log("hi11");

    try {
      const { data } = await api.post<getMeTypes>("/auth/signup", {
        username,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      setUser(data.user);

      setAuthToken(data.token);

      router.push("/createProfile");
    } catch (error) {
      console.error("Signup error:", error);

      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.error ||
        apiError?.message ||
        "Signup failed. Please try again.";

      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(undefined);
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
        const { data } = await api.get<User>("/auth/getMe");
        console.log("Token valid, user:", data);
        setUser(data);
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
      value={{ user, signIn, signUp, signOut, loading, setUser }}
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
