import React, { useEffect, useState } from "react";
import { SelectAmount } from "./SelectAmount";
import { Donation, useAuth } from "@/app/_providers/AuthProvider";
import { api } from "@/axios";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

const Transactions = () => {
  const [supporters, setSupporters] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [amountFilter, setAmountFilter] = useState<number[] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      console.log("No user or userId:", user);
      return;
    }

    setIsLoading(true);
    const getDonations = async () => {
      try {
        const { data } = await api.get<{ donations: Donation[] }>(
          `/donation/${user.id}`
        );
        setSupporters(data.donations);
      } catch (error) {
        console.error("Failed to fetch supporters", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDonations();
  }, [user?.id, user]);

  const filteredSupporters =
    amountFilter && amountFilter.length > 0
      ? supporters.filter((d) => amountFilter.includes(d.amount))
      : supporters;
  return (
    <div className="flex flex-col gap-3 mb-28">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h5 className="font-semibold text-lg sm:text-base">
          Recent transactions
        </h5>
        <SelectAmount
          onChange={(value: number[]) => setAmountFilter(value)}
          value={amountFilter ?? []}
        />
      </div>

      {isLoading ? (
        <p className="flex items-center justify-center py-4">Loading...</p>
      ) : supporters.length === 0 ? (
        <p className="flex items-center justify-center py-10 sm:py-20">
          No donations yet.
        </p>
      ) : (
        filteredSupporters.map((supporter) => (
          <div
            key={supporter.id}
            className="border border-[#E4E4E7] p-4 sm:p-6 rounded-lg"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
              <div className="flex gap-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0">
                  <Image
                    src={
                      supporter.donor?.profile?.avatarImage || "/default.jpg"
                    }
                    alt="Avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <h5 className="font-bold truncate">
                    {supporter.donor?.profile?.name || "Anonymous"}
                  </h5>
                  <p className="text-xs sm:text-[14px] text-gray-600 md:max-w-[400px] truncate">
                    {supporter.socialURLOrBuyMeACoffee ||
                      supporter.donor?.profile?.socialMediaUrl ||
                      "No social link"}
                  </p>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="font-bold text-green-600 text-base sm:text-lg">
                  + ${supporter.amount}
                </p>
                <p className="text-[#71717A] text-xs">
                  {supporter.createdAt
                    ? formatDistanceToNow(new Date(supporter.createdAt), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </p>
              </div>
            </div>
            {supporter.specialMessage && (
              <p className="mt-3 text-sm break-words">
                {supporter.specialMessage}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Transactions;
