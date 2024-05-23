"use client";

import { CheckboxCard } from "@/lib/components/core/default/checkbox/checkbox-card";

export default function CheckboxDemo() {
  return (
    <CheckboxCard
      isDisabled
      defaultSelected
      title="Upload documents"
      description="upload documents from your computer."
    />
  );
}
