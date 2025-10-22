"use client";

import { Label } from "@dotui/registry-v2/ui/field";
import { DateInput } from "@dotui/registry-v2/ui/input";
import { TimeField } from "@dotui/registry-v2/ui/time-field";
import { Description } from "@dotui/registry/ui/field";

export function TimeFieldDemo() {
  return (
    <div className="flex flex-col gap-6">
      <TimeField>
        <Label>Event time</Label>
        <DateInput />
        <Description>
          
        </Description>
      </TimeField>
    </div>
  );
}
