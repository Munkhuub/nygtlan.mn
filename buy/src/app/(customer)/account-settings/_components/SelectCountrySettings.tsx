import React from "react";
import countries from "world-countries";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectCountryProps {
  onValueChange?: (value: string) => void;
  error?: string;
  value?: string;
}

const SelectCountrySettings: React.FC<SelectCountryProps> = ({
  onValueChange,
  error,
  value,
}) => {
  return (
    <div>
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Countries</SelectLabel>
            {countries.map((country, i) => (
              <SelectItem value={country.cca2} key={i}>
                {country.name.common}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default SelectCountrySettings;
