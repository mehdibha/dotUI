"use client";

import React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { Input } from "@/lib/components/core/default/input";

export default function InputPasswordDemo() {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <Input
      type={showPassword ? "text" : "password"}
      suffix={
        <Button
          shape="circle"
          size="sm"
          aria-label={showPassword ? "show password" : "hide password"}
          className="h-6 w-6"
          onClick={() => {
            setShowPassword((state) => !state);
          }}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      }
    />
  );
}
