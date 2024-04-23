"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/core/default/form";
import { InputOTP } from "@/lib/components/core/default/input-otp";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function InputOTPFormDemo() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const inputRef = React.useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
    reValidateMode: "onSubmit",
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (data.pin === "123456") {
      setStatus("success");
      inputRef.current?.blur();
      return;
    }
    form.setValue("pin", "");
    setStatus("error");
    setTimeout(() => inputRef.current?.focus(), 20);
  }

  return (
    <div className="flex w-full flex-col items-center text-center">
      <h2 className="text-xl font-bold">Two-Factor Authentication</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 flex flex-col items-center min-h-32"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel className="sr-only">One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP
                    {...field}
                    ref={inputRef}
                    length={6}
                    onChange={(value) => {
                      setStatus("idle");
                      field.onChange(value);
                    }}
                    onComplete={form.handleSubmit(onSubmit)}
                    disabled={status === "loading"}
                    variant={
                      status === "error"
                        ? "error"
                        : status === "success"
                          ? "success"
                          : "default"
                    }
                  />
                </FormControl>
                <FormMessage>
                  {status === "error" &&
                    "You have entered an incorrect verification code. Try again later."}
                </FormMessage>
                <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription>
              </FormItem>
            )}
          />
          {status === "loading" && <Loader2Icon className="mt-4 animate-spin" />}
        </form>
      </Form>
    </div>
  );
}
