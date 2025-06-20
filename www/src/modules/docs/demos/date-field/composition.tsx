"use client";

import React from "react";

import { DateFieldInput, DateFieldRoot } from "@dotui/ui/components/date-field";
import { Description, Label } from "@dotui/ui/components/field";

export default function Demo() {
  return (
    <DateFieldRoot className="w-auto">
      <Label>Meeting time</Label>
      <DateFieldInput />
      <Description>Please select a time between 9 AM and 5 PM.</Description>
    </DateFieldRoot>
  );
}
