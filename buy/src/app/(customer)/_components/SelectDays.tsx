import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectDaysProps = {
  selectedDays: string;
  onChange: (value: string) => void;
};

export const SelectDays = ({ selectedDays, onChange }: SelectDaysProps) => {
  return (
    <Select value={selectedDays} onValueChange={onChange}>
      <SelectTrigger className="w-[175px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="90">Last 90 days</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
