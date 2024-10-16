"use client";

import React from "react";
import { DateFieldRoot } from "@/registry/ui/default/core/date-field";
import { DateInput, DateSegment } from "@/registry/ui/default/core/date-input";
import { Description, Label } from "@/registry/ui/default/core/field";
import { InputRoot } from "@/registry/ui/default/core/input";

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
