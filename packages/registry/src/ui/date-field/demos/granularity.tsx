"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { DateField } from "@dotui/registry/ui/date-field";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <DateField
        granularity="hour"
        defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      >
        <Label>Hour</Label>
        <DateInput />
      </DateField>
      <DateField
        granularity="minute"
        defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      >
        <Label>Minute</Label>
        <DateInput />
      </DateField>
      <DateField
        granularity="second"
        defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      >
        <Label>Second</Label>
        <DateInput />
      </DateField>
    </div>
  );
}
