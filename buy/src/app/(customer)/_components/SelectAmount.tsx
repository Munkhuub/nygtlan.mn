import React from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type SelectAmountProps = {
  onChange: (value: number[]) => void;
  value: number[];
};

const amountsAll = [1, 2, 5, 10];
export const SelectAmount = ({ onChange, value }: SelectAmountProps) => {
  const handleChange = (amount: number) => {
    const newFilter = value.includes(amount)
      ? value.filter((val) => val !== amount)
      : [...value, amount];
    onChange(newFilter);
  };
  return (
    <Select>
      <SelectTrigger className="w-[175px]">
        <SelectValue placeholder="Amount" />
      </SelectTrigger>

      <SelectContent>
        {amountsAll.map((amount) => (
          <div
            key={amount}
            className="flex items-center space-x-2 cursor-pointer py-1 px-2 rounded hover:bg-muted"
            onClick={() => handleChange(amount)}
          >
            <Checkbox
              id={`amount-${amount}`}
              checked={value.includes(amount)}
              onCheckedChange={() => handleChange(amount)}
            />
            <label htmlFor={`amount-${amount}`} className="text-sm">
              ${amount}
            </label>
          </div>
        ))}
      </SelectContent>
    </Select>
  );
};
