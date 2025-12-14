"use client";

import { DateField } from "@dotui/registry/ui/date-field";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

interface DateFieldPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
}

export function DateFieldPlayground({
  label = "Date",
  ...props
}: DateFieldPlaygroundProps) {
  return (
    <DateField {...props}>
      {label && <Label>{label}</Label>}
      <DateInput />
    </DateField>
  );
}
