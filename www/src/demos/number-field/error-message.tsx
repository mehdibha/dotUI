import React from "react";
import { NumberField } from "@/components/dynamic-core/number-field";

export default function Demo() {
  return (
    <NumberField
      label="Width"
      isInvalid
      errorMessage="Please fill out this field."
    />
  );
}
