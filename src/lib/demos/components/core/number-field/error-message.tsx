"use client";

import React from "react";
import { NumberField } from "@/lib/components/core/default/number-field";

export default function Demo() {
  return (
    <NumberField
      label="Search"
      isInvalid
      errorMessage="Please fill out this field."
    />
  );
}
