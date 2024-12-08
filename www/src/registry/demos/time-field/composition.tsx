"use client";

import React from "react";
import { DateInput, DateSegment } from "@/components/dynamic-core/date-input";
import { Description, Label } from "@/components/dynamic-core/field";
import { InputRoot } from "@/components/dynamic-core/input";
import { TimeFieldRoot } from "@/components/dynamic-core/time-field";

export default function Demo() {
  return (
    <TimeFieldRoot>
      <Label>Meeting time</Label>
      <InputRoot>
        <DateInput>{(segment) => <DateSegment segment={segment} />}</DateInput>
      </InputRoot>
      <Description>Please select a time between 9 AM and 5 PM.</Description>
    </TimeFieldRoot>
  );
}
