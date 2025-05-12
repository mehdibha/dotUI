"use client";

import React from "react";
import { TextField } from "@/components/dynamic-ui/text-field";

export default function Demo() {
  return (
    <TextField
      defaultValue="support@copyui.dev"
      label="Email"
      isInvalid
      errorMessage="This email is already taken."
    />
  );
}
