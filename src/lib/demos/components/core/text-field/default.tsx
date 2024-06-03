"use client";

import React from "react";
import { TextField } from "@/lib/components/core/default/text-field";

export default function Demo() {
  return (
    <TextField
      placeholder="hello@mehdibha.com"
      type="email"
      label="Email"
      description="Enter your email."
      autoComplete="off"
    />
  );
}
