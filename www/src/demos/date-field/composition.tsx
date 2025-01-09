"use client";

import React from "react";
import { DateFieldRoot } from "@/components/dynamic-core/date-field";
import { DateInput, DateSegment } from "@/components/dynamic-core/date-input";
import { Description, Label } from "@/components/dynamic-core/field";
import { InputRoot } from "@/components/dynamic-core/input";

export default function Demo() {
  return (
    <DateFieldRoot>
      <Label>Meeting time</Label>
      <InputRoot>
        <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
      </InputRoot>
      <Description>Please select a time between 9 AM and 5 PM.</Description>
    </DateFieldRoot>
  );
}
