import React from "react";

import { NumberField } from "@dotui/ui/components/number-field";

export default function Demo() {
  return (
    <NumberField
      label="Width"
      isInvalid
      errorMessage="Please fill out this field."
    />
  );
}
