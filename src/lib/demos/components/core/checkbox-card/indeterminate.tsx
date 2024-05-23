"use client";

import { CheckboxCard } from "@/lib/components/core/default/checkbox/checkbox-card";

export default function CheckboxDisabledDemo() {
  return (
    <CheckboxCard isIndeterminate defaultSelected>
      Select all
    </CheckboxCard>
  );
}
