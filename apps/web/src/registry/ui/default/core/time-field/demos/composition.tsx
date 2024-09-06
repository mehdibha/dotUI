"use client";

import React from "react";
import { DateInput, DateSegment } from "@/registry/ui/default/core/date-input";
import { Description, Label } from "@/registry/ui/default/core/field";
import { InputRoot } from "@/registry/ui/default/core/input";
import { TimeFieldRoot } from "@/registry/ui/default/core/time-field";

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
