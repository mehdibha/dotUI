"use client";

import { Checkbox } from "@/lib/components/core/default/checkbox/checkbox";

export default function CheckboxDisabledDemo() {
  return (
    <Checkbox isDisabled defaultSelected>
      I accept the terms and conditions
    </Checkbox>
  );
}
