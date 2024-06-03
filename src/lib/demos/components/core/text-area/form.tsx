"use client";

import React from "react";
import { TextField } from "@/lib/components/core/default/text-field";

export default function Demo() {
  return (
    <TextField
      placeholder="example@email.com"
      label="Email"
      htmlType="email"
      autoComplete="off"
      description="Enter your email."
      className="w-full"
    />
  );
}
