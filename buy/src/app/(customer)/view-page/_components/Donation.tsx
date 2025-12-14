"use client";
import { CoffeeIcon } from "lucide-react";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const Donation = () => {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const amounts = [1, 3, 5, 10];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log({ ...values, selectedAmount });
  };

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-lg border border-[#F4F4F5] flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col gap-4 md:gap-6">
        <h5 className="text-xl md:text-2xl font-semibold">Buy Jake a Coffee</h5>
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base">Select amount:</p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {amounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "secondary"}
                className={`flex gap-1 md:gap-2 w-[calc(50%-4px)] md:w-[72px] text-xs md:text-sm ${
                  selectedAmount === amount
                    ? "bg-primary text-primary-foreground"
                    : "bg-[#F4F4F5] text-foreground hover:bg-[#e0e0e0]"
                }`}
                onClick={() => setSelectedAmount(amount)}
              >
                <CoffeeIcon className="size-3 md:size-4" />${amount}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2 md:space-y-5">
                <div>
                  <FormLabel className="text-sm md:text-base">
                    Enter BuyMeCoffee or social account URL:
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="buymeacoffee.com/"
                      className="text-xs md:text-sm"
                      {...field}
                    />
                  </FormControl>
                </div>

                <div>
                  <FormLabel className="text-sm md:text-base">
                    Special message:
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please write your message here"
                      className="text-xs md:text-sm min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full text-sm md:text-base">
            Support
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Donation;
