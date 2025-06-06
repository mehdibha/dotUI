"use client";

import React from "react";
import {
  DateFieldInput,
  DateFieldRoot,
} from "@/components/dynamic-ui/date-field";
import { Description, Label } from "@/components/dynamic-ui/field";

export default function Demo() {
  return (
    <DateFieldRoot className="w-auto">
      <Label>Meeting time</Label>
      <DateFieldInput />
      <Description>Please select a time between 9 AM and 5 PM.</Description>
    </DateFieldRoot>
  );
}
