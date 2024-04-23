"use client";

import React from "react";
import { InputOTP } from "@/lib/components/core/default/input-otp";
import { cn } from "@/lib/utils/classes";

export default function InputOTPDemo() {
  const [pin, setPin] = React.useState("");
  return (
    <div className="space-y-2">
      <InputOTP
        length={6}
        value={pin}
        onChange={(value) => {
          setPin(value);
        }}
      />
      <div className={cn("text-center text-sm text-fg-muted", pin && "text-fg")}>
        {pin === "" ? <>Enter your one-time password.</> : <>You entered: {pin}</>}
      </div>
    </div>
  );
}
