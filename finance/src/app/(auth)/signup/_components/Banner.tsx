"use client";
import { CoffeeIcon } from "lucide-react";
import React from "react";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="w-full md:w-[50%] bg-amber-400 md:min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-4 sm:py-6 md:py-0">
      <div className="flex items-center gap-2 py-3 md:py-8">
        <CoffeeIcon className="size-4 sm:size-5" />
        <p className="text-lg sm:text-xl font-bold">Buy Me Coffee</p>
      </div>

      <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 py-4 sm:py-8 md:py-0 md:h-[calc(100vh-150px)] md:justify-center">
        <div className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px]">
          <Image
            src="https://res.cloudinary.com/dpbmpprw5/image/upload/v1752322821/coffee_rbkg4n.png"
            width={280}
            height={280}
            className="w-full object-contain"
            alt="Coffee illustration"
          />
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">
            Fund your creative work
          </h2>
          <p className="text-sm sm:text-base text-gray-800 px-2">
            Accept support. Start a membership. Setup a shop.
            <br className="hidden sm:block" />
            It&apos;s easier than you think.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
