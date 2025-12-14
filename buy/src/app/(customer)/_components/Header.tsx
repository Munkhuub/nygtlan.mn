"use client";
import { CoffeeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { HeaderLogOut } from "./HeaderLogOut";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_providers/AuthProvider";

const Header = () => {
  const { user } = useAuth();
  return (
    <div className="flex justify-between items-center px-4 sm:px-8 md:px-20 py-3">
      <Link href={"/"}>
        <div className="flex items-center gap-1 sm:gap-2">
          <CoffeeIcon className="size-4 sm:size-5" />
          <p className="text-lg sm:text-xl font-bold">Buy Me Coffee</p>
        </div>
      </Link>
      {!user ? (
        <div className="flex gap-2 sm:gap-3">
          <Button size="sm" className="text-xs sm:text-sm">
            Login
          </Button>
          <Button size="sm" className="text-xs sm:text-sm">
            Sign Up
          </Button>
        </div>
      ) : (
        <HeaderLogOut />
      )}
    </div>
  );
};

export default Header;
