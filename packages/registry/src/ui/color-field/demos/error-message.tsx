"use client";

import React from "react";

import { ColorField } from "@dotui/registry/ui/color-field";

export default function Demo() {
  return (
    <ColorField
      label="Color"
      isInvalid
      errorMessage="Please fill out this field."
    />
  );
}
